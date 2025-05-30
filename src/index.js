const express = require('express');
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// Load ABI for Oracle and SupplyChainAutomation contracts
const OracleABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'build', 'contracts', 'Oracle.json'), 'utf8')).abi;
const SupplyChainAutomationABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'build', 'contracts', 'SupplyChainAutomation.json'), 'utf8')).abi;

// Contract addresses (update after deployment)
const oracleAddress = '0xYourOracleContractAddress';
const supplyChainAddress = '0xYourSupplyChainContractAddress';

// Contract instances
const oracle = new web3.eth.Contract(OracleABI, oracleAddress);
const supplyChain = new web3.eth.Contract(SupplyChainAutomationABI, supplyChainAddress);

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Get Oracle data
app.get('/oracle/data', async (req, res) => {
  try {
    const data = await oracle.methods.getData().call();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Oracle data
app.post('/oracle/update', async (req, res) => {
  const { from, newData } = req.body;
  if (!from || newData === undefined) {
    return res.status(400).json({ error: 'Missing from address or newData' });
  }
  try {
    const gas = await oracle.methods.updateData(newData).estimateGas({ from });
    const receipt = await oracle.methods.updateData(newData).send({ from, gas });
    res.json({ status: 'Oracle data updated', transactionHash: receipt.transactionHash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Trigger automation action
app.post('/automation/trigger', async (req, res) => {
  const { from } = req.body;
  if (!from) {
    return res.status(400).json({ error: 'Missing from address' });
  }
  try {
    const gas = await supplyChain.methods.triggerActionIfNeeded().estimateGas({ from });
    const receipt = await supplyChain.methods.triggerActionIfNeeded().send({ from, gas });
    res.json({ status: 'Automation triggered', transactionHash: receipt.transactionHash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
