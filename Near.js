const Koa = require('koa');
const Router = require('koa-router');
const fetch = require('node-fetch');
const qs = require('qs');
const fs = require('fs/promises');
const { connect, keyStores, KeyPair } = require('near-api-js');
const getRawBody = require('raw-body');
const dns = require('dns').promises;

const app = new Koa();
const router = new Router();

// Configure environment variables
const IPFS_GATEWAY_URL = process.env.IPFS_GATEWAY_URL || 'https://cloudflare-ipfs.com';
const NEARFS_GATEWAY_URL = process.env.NEARFS_GATEWAY_URL || 'https://ipfs.web4.near.page';
const MAX_PRELOAD_HOPS = 5;
const DEFAULT_GAS = '300000000000000';

// NEAR configuration
const config = require('./config')(process.env.NODE_ENV || 'development');

// Function to connect to NEAR blockchain
async function setupNearConnection() {
    const keyStore = new keyStores.InMemoryKeyStore();
    const near = await connect({ ...config, keyStore });
    return near;
}

// Middleware for NEAR connection
async function withNear(ctx, next) {
    const near = await setupNearConnection();
    ctx.near = near;
    await next();
}

// Middleware to extract account ID from cookies
async function withAccountId(ctx, next) {
    const accountId = ctx.cookies.get('web4_account_id');
    ctx.accountId = accountId;
    await next();
}

// Middleware to ensure the user is authenticated
async function requireAccountId(ctx, next) {
    if (!ctx.accountId) {
        ctx.redirect('/web4/login');
        return;
    }
    await next();
}

// Middleware for logging
async function withDebug(ctx, next) {
    ctx.debug = require('debug')(`web4:${ctx.host}${ctx.path}`);
    await next();
}

// Function to render HTML templates
async function renderTemplate(templatePath, params) {
    let result = await fs.readFile(`${__dirname}/${templatePath}`, 'utf8');
    for (const key of Object.keys(params)) {
        result = result.replace(`$${key}$`, JSON.stringify(params[key]));
    }
    return result;
}

// Get smart contract's view function result
async function callViewFunction({ near }, contractId, methodName, args) {
    const account = await near.account(contractId);
    return await account.viewFunction(contractId, methodName, args);
}

// Save assets in decentralized storage (IPFS or NEARFS)
async function fetchFromIPFS(ipfsHash) {
    const gatewayUrl = IPFS_GATEWAY_URL;
    const url = `${gatewayUrl}/ipfs/${ipfsHash}`;
    const response = await fetch(url);
    if (response.ok) {
        return await response.buffer(); // Use .json() for JSON data
    }
    throw new Error(`Failed to fetch IPFS data from ${url}`);
}

// Routes
router.get('/web4/login', withNear, async (ctx) => {
    const { query } = ctx;
    const callbackUrl = new URL(query.web4_callback_url || ctx.get('referrer') || '/', ctx.origin).toString();
    ctx.type = 'text/html';
    ctx.body = await renderTemplate('login.html', {
        CALLBACK_URL: callbackUrl,
        NETWORK_ID: ctx.near.connection.networkId,
    });
});

router.get('/web4/login/complete', async (ctx) => {
    const { account_id, web4_callback_url } = ctx.query;
    if (account_id) {
        ctx.cookies.set('web4_account_id', account_id, { httpOnly: false });
    }
    if (!web4_callback_url) {
        ctx.throw(400, 'Missing web4_callback_url');
    }
    ctx.redirect(web4_callback_url);
});

// Route for signing a transaction (e.g., transferring an asset)
router.get('/web4/sign', withAccountId, requireAccountId, async (ctx) => {
    const { web4_contract_id, web4_method_name, web4_args, web4_gas, web4_deposit, web4_callback_url } = ctx.query;
    ctx.type = 'text/html';
    ctx.body = await renderTemplate('sign.html', {
        CONTRACT_ID: web4_contract_id,
        METHOD_NAME: web4_method_name,
        ARGS: web4_args,
        GAS: web4_gas,
        DEPOSIT: web4_deposit,
        CALLBACK_URL: web4_callback_url
    });
});

// Handle contract interactions (view and call functions)
router.get('/web4/contract/:contractId/:methodName', withNear, async (ctx) => {
    const { contractId, methodName } = ctx.params;
    const methodParams = Object.keys(ctx.query)
        .map(key => key.endsWith('.json')
            ? { [key.replace(/\.json$/, '')]: JSON.parse(ctx.query[key]) }
            : { [key]: ctx.query[key] })
        .reduce((a, b) => ({ ...a, ...b }), {});

    const result = await callViewFunction(ctx, contractId, methodName, methodParams);
    ctx.body = result;
});

// Preload content from decentralized storage (IPFS)
router.get('/web4/asset/:assetId', async (ctx) => {
    const { assetId } = ctx.params;
    try {
        const content = await fetchFromIPFS(assetId);
        ctx.body = content;
    } catch (e) {
        ctx.throw(500, 'Failed to fetch asset', e);
    }
});

// Handle contract interactions (post requests for transactions)
router.post('/web4/contract/:contractId/:methodName', withNear, withAccountId, requireAccountId, async (ctx) => {
    const { contractId, methodName } = ctx.params;
    const rawBody = await getRawBody(ctx.req);
    let args = rawBody;
    let gas = DEFAULT_GAS;
    let deposit = '0';
    let callbackUrl = ctx.get('referrer') || '/';

    // Parse arguments from form data (application/x-www-form-urlencoded)
    if (ctx.request.type === 'application/x-www-form-urlencoded') {
        const body = qs.parse(rawBody.toString('utf8'), { allowDots: true });
        args = Object.keys(body)
            .filter(key => !key.startsWith('web4_'))
            .map(key => ({ [key]: body[key] }))
            .reduce((a, b) => ({ ...a, ...b }), {});
        args = Buffer.from(JSON.stringify(args));

        // Handle additional params
        if (body.web4_gas) {
            gas = body.web4_gas;
        }
        if (body.web4_deposit) {
            deposit = body.web4_deposit;
        }
        if (body.web4_callback_url) {
            callbackUrl = body.web4_callback_url;
        }
    }

    // Handle transaction signing and redirection
    ctx.redirect(`/web4/sign?${qs.stringify({
        web4_contract_id: contractId,
        web4_method_name: methodName,
        web4_args: Buffer.from(args).toString('base64'),
        web4_gas: gas,
        web4_deposit: deposit,
        web4_callback_url: callbackUrl
    })}`);
});

// Catch-all route for asset interactions
router.get('/(.*)', withNear, async (ctx) => {
    const { contractId, path, query } = ctx;
    const methodParams = { request: { path, query } };

    try {
        const result = await callViewFunction(ctx, contractId, 'web4_get', methodParams);
        ctx.body = result;
    } catch (e) {
        ctx.throw(500, 'Failed to process request', e);
    }
});

// Use Koa middleware
app
    .use(withDebug)
    .use(async (ctx, next) => {
        console.log(ctx.method, ctx.host, ctx.path);
        await next();
    })
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

