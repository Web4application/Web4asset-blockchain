// config.js

const ENV = process.env.NODE_ENV || "development";

const CONFIG = {
  development: {
    network: {
      name: "Web4Asset Testnet",
      chainId: 1337,
      rpcUrl: "http://127.0.0.1:8545",
      explorerUrl: "http://127.0.0.1:3000"
    },
    contracts: {
      Web4Token: "0x1234567890abcdef1234567890abcdef12345678",
      WalletManager: "0xabcdefabcdefabcdefabcdefabcdefabcdef"
    },
    gasSettings: {
      gasLimit: 21000,
      gasPrice: "10 GWEI"
    },
    encryption: {
      saltRounds: 12
    }
  },
  production: {
    network: {
      name: "Web4Asset Mainnet",
      chainId: 56,
      rpcUrl: "https://mainnet.web4asset.io/rpc",
      explorerUrl: "https://mainnet.web4asset.io/explorer"
    },
    contracts: {
      Web4Token: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
      WalletManager: "0x1234567890abcdef1234567890abcdef12345678"
    },
    gasSettings: {
      gasLimit: 30000,
      gasPrice: "20 GWEI"
    },
    encryption: {
      saltRounds: 14
    }
  }
};

const currentConfig = CONFIG[ENV];

module.exports = currentConfig;
