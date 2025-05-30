const express = require('express');
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// Load contract ABI and address (update paths and address accordingly)
const contractABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'contracts', 'Web4asset.json'), 'utf8')).abi;
const contractAddress = '0xYourDeployedContractAddress';  // Replace with your deployed contract address

const contract = new web3.eth.Contract(contractABI, contractAddress);

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Get blockchain info
app.get('/eth/info', async (req, res) => {
  try {
    const networkId = await web3.eth.net.getId();
    const accounts = await web3.eth.getAccounts();
    const latestBlock = await web3.eth.getBlock('latest');
    res.json({
      networkId,
      accounts,
      latestBlockNumber: latestBlock.number,
      latestBlockHash: latestBlock.hash,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch Ethereum info' });
  }
});

// Example: Call a read-only contract method
app.get('/contract/data', async (req, res) => {
  try {
    // Replace 'getSomeData' with your contract's method
    const data = await contract.methods.getSomeData().call();
    res.json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Contract call failed' });
  }
});

// Example: Send a transaction to the contract
app.post('/contract/send', async (req, res) => {
  const { from, param1 } = req.body; // adjust params based on your contract function

  if (!from || !param1) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const gasEstimate = await contract.methods
      .setSomeData(param1) // replace with your contract method
      .estimateGas({ from });

    const receipt = await contract.methods
      .setSomeData(param1)
      .send({ from, gas: gasEstimate + 10000 });

    res.json({ status: 'Transaction successful', transactionHash: receipt.transactionHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Transaction failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Web4asset server listening on port ${PORT}`);
});
