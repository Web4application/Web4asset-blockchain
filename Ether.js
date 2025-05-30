const { ethers } = require("ethers");
const crypto = require("crypto");

// Web4Asset Mainnet RPC URL
const rpcUrl = "https://web4asset.io/rpc";

// Connect to the Web4Asset network via ethers.js
const provider = new ethers.JsonRpcProvider(rpcUrl);

// Wallet details (replace these with actual wallet details)
const encryptedPrivateKey = "U2FsdGVkX19BfG6vYrZX2c8Dwvx8BqHtNTbKDE2Cylw="; // Encrypted private key
const password = "mMankind1$&@""; // Password to decrypt the private key

// Function to decrypt the private key using AES (assuming OpenSSL format encryption)
function decryptPrivateKey(encryptedKey, password) {
  const buffer = Buffer.from(encryptedKey, 'base64');
  
  const iv = buffer.slice(8, 24); // Extract the initialization vector (IV) (16 bytes)
  const encryptedData = buffer.slice(24); // Extract the encrypted data
  
  // Decrypt using AES-256-CBC
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(password, 'utf8'), iv);
  let decrypted = decipher.update(encryptedData);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8'); // Return the decrypted private key
}

// Decrypt the private key
const decryptedPrivateKey = decryptPrivateKey(encryptedPrivateKey, password);

// Connect wallet to provider using the decrypted private key
const wallet = new ethers.Wallet(decryptedPrivateKey, provider);

// Get wallet balance in W4T
async function getBalance() {
  const balance = await wallet.getBalance();
  console.log(`Wallet Balance: ${ethers.utils.formatEther(balance)} W4T`);
}

// Send a transaction (Example: sending 0.1 W4T to another address)
async function sendTransaction(toAddress, amountInEther) {
  const tx = {
    to: toAddress,
    value: ethers.utils.parseEther(amountInEther),
    gasLimit: 21000,
    gasPrice: ethers.utils.parseUnits("10", "gwei"), // 10 GWEI
  };

  try {
    const txResponse = await wallet.sendTransaction(tx);
    console.log(`Transaction Sent! Hash: ${txResponse.hash}`);
    await txResponse.wait(); // Wait for the transaction to be mined
    console.log(`Transaction Mined: ${txResponse.hash}`);
  } catch (error) {
    console.error("Error sending transaction:", error);
  }
}

// Example usage
async function main() {
  await getBalance(); // Get the balance of the wallet

  const recipientAddress = "0xb99925EA17c3780e8B96B4254b911364434Be7cc"; // Replace with actual recipient address
  const amount = "0.1"; // Amount to send (in W4T)
  
  await sendTransaction(recipientAddress, amount); // Send transaction
}

main().catch(console.error);
