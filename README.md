# Web4AssetChain – UUPS Upgradeable Scaffold

Modern UUPS (EIP‑1822) setup with ERC1967 proxy, Hardhat scripts, tests, CI, and a tiny admin frontend.

## Quickstart

```bash
npm i
cp .env.example .env
# edit .env with RPC, PRIVATE_KEY, OWNER_ADDRESS, etc.

npm run build
npm run deploy:v1
# -> note Proxy address

PROXY_ADDRESS=0xProxyHere npm run upgrade:v2
```

### Verify implementations
```
IMPLEMENTATION_ADDRESS=0xImplHere npm run verify:v1
```

## Frontend (local)
Open `frontend/index.html` with a local server (or drop into your site).
Use a Safe multisig for real upgrades; this page is for testing/dev.

## Contracts
- `ERC1967Proxy.sol` – minimal constructor-initialized proxy
- `UUPSUpgradeable.sol` – base for upgrades
- `OwnableUpgradeable.sol` – initializer-based ownership
- `AssetChainV1.sol` / `AssetChainV2.sol` – example logic

## Testing
```
npm test
```

## Notes
- Keep storage layout stable; only append variables in new versions.
- Gate `_authorizeUpgrade` with a multisig owner (e.g., Safe).

---
© Web4AssetChain
