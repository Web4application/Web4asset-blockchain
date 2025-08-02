// config.js
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const Joi = require('joi');

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'staging').default('development'),
  WEB4_RPC_URL: Joi.string().uri().required(),
  WEB4_EXPLORER_URL: Joi.string().uri().required(),
  WEB4_CHAIN_ID: Joi.number().integer().required(),
  WEB4TOKEN_ADDRESS: Joi.string().required(),
  WALLET_MANAGER_ADDRESS: Joi.string().required(),
  GAS_LIMIT: Joi.number().integer().required(),
  GAS_PRICE: Joi.number().required(),
  SALT_ROUNDS: Joi.number().integer().required()
}).unknown();

const { error, value: env } = envSchema.validate(process.env);

if (error) {
  throw new Error(`❌ Config validation error: ${error.message}`);
}

const CONFIG = {
  environment: env.NODE_ENV,
  network: {
    name: `Web4Asset ${env.NODE_ENV.charAt(0).toUpperCase() + env.NODE_ENV.slice(1)}`,
    chainId: Number(env.WEB4_CHAIN_ID),
    rpcUrl: env.WEB4_RPC_URL,
    explorerUrl: env.WEB4_EXPLORER_URL
  },
  contracts: {
    Web4Token: env.WEB4TOKEN_ADDRESS,
    WalletManager: env.WALLET_MANAGER_ADDRESS
  },
  gasSettings: {
    gasLimit: Number(env.GAS_LIMIT),
    gasPrice: `${env.GAS_PRICE} GWEI`
  },
  encryption: {
    saltRounds: Number(env.SALT_ROUNDS)
  }
};

module.exports = CONFIG;
