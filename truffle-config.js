const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

// ⚠️ Replace these with your actual mnemonic and Infura Project ID
const mnemonic = "your twelve word mnemonic goes here";
const infuraProjectId = "your-infura-project-id";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    web4asset: {
      provider: () => new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
      network_id: "1234",
      gas: 6000000,
      gasPrice: 20000000000,
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: mnemonic,
          },
          providerOrUrl: `https://sepolia.infura.io/v3/${infuraProjectId}`,
        }),
      network_id: 11155111,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },

  compilers: {
    solc: {
      version: "^0.8.20",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
