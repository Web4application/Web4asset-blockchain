import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

// Example config from your data
const RPC_URL = "https://web4asset.io/rpc";
const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";

// Example token contract addresses (replace with your actual ones)
const TOKEN_CONTRACTS = [
  {
    symbol: "W4T",
    address: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
  },
  {
    symbol: "W4NFT",
    address: "0x123456789abcdef123456789abcdef1234567890",
  },
];

// Minimal ERC20 ABI fragment for balanceOf
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
];

export default function App() {
  const [balance, setBalance] = useState("Loading...");
  const [tokenBalances, setTokenBalances] = useState({});

  useEffect(() => {
    async function fetchBalances() {
      try {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

        // Fetch native balance (in wei)
        const nativeBalance = await provider.getBalance(walletAddress);
        setBalance(ethers.utils.formatEther(nativeBalance) + " W4T");

        // Fetch token balances
        const balances = {};
        for (const token of TOKEN_CONTRACTS) {
          const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
          const rawBalance = await contract.balanceOf(walletAddress);
          // Format assuming 18 decimals (adjust if needed)
          balances[token.symbol] = ethers.utils.formatEther(rawBalance);
        }
        setTokenBalances(balances);
      } catch (err) {
        setBalance("Error loading balance");
        console.error(err);
      }
    }

    fetchBalances();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Web4Asset Wallet</h1>
      <p>
        <strong>Address:</strong> {walletAddress}
      </p>
      <p>
        <strong>Native Balance:</strong> {balance}
      </p>
      <h2>Token Balances</h2>
      <ul>
        {Object.entries(tokenBalances).map(([symbol, bal]) => (
          <li key={symbol}>
            {symbol}: {bal}
          </li>
        ))}
      </ul>
    </div>
  );
}
