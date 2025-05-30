import React, { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";

const RPC_URL = "https://web4asset.io/rpc";
const TOKEN_CONTRACTS = [
  { symbol: "W4T", address: "0xabcdefabcdefabcdefabcdefabcdefabcdef" },
  { symbol: "W4NFT", address: "0x123456789abcdef123456789abcdef1234567890" },
];
const ERC20_ABI = ["function balanceOf(address owner) view returns (uint256)", "function transfer(address to, uint amount) returns (bool)"];
const ERC721_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
];

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [nativeBalance, setNativeBalance] = useState("0");
  const [tokenBalances, setTokenBalances] = useState({});
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Connect wallet function
  async function connectWallet() {
    const detectedProvider = await detectEthereumProvider();
    if (!detectedProvider) {
      setError("MetaMask or compatible wallet not found");
      return;
    }
    try {
      await detectedProvider.request({ method: "eth_requestAccounts" });
      const ethersProvider = new ethers.providers.Web3Provider(detectedProvider);
      const signer = ethersProvider.getSigner();
      const accountAddress = await signer.getAddress();
      setProvider(ethersProvider);
      setSigner(signer);
      setAccount(accountAddress);
      setError("");
    } catch (err) {
      setError("Wallet connection failed");
      console.error(err);
    }
  }

  // Fetch balances when account or provider changes
  useEffect(() => {
    if (!provider || !account) return;

    async function fetchBalances() {
      setLoading(true);
      try {
        const balance = await provider.getBalance(account);
        setNativeBalance(ethers.utils.formatEther(balance));

        const balances = {};
        for (const token of TOKEN_CONTRACTS) {
          if(token.symbol === "W4T"){
            const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
            const bal = await contract.balanceOf(account);
            balances[token.symbol] = ethers.utils.formatEther(bal);
          } else if(token.symbol === "W4NFT") {
            // For NFTs fetch number of tokens owned
            const contract = new ethers.Contract(token.address, ERC721_ABI, provider);
            const nftBalance = await contract.balanceOf(account);
            const nftIds = [];
            for(let i=0; i<nftBalance; i++){
              const tokenId = await contract.tokenOfOwnerByIndex(account, i);
              nftIds.push(tokenId.toString());
            }
            setNfts(nftIds);
          }
        }
        setTokenBalances(balances);
      } catch (err) {
        setError("Failed to fetch balances");
        console.error(err);
      }
      setLoading(false);
    }
    fetchBalances();
  }, [provider, account]);

  // Token transfer handler (send W4T)
  async function sendTokens(to, amount) {
    if (!signer) {
      setError("Wallet not connected");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const tokenContract = new ethers.Contract(TOKEN_CONTRACTS[0].address, ERC20_ABI, signer);
      const tx = await tokenContract.transfer(to, ethers.utils.parseEther(amount));
      await tx.wait();
      setError("Transaction successful!");
    } catch (err) {
      setError("Transaction failed: " + err.message);
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Web4Asset Wallet</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p><strong>Address:</strong> {account}</p>
          <p><strong>Native Balance:</strong> {nativeBalance} W4T</p>
          <h2>Token Balances</h2>
          <ul>
            {Object.entries(tokenBalances).map(([sym, bal]) => (
              <li key={sym}>{sym}: {bal}</li>
            ))}
          </ul>

          <h2>Send W4T Tokens</h2>
          <SendForm onSend={sendTokens} loading={loading} />

          <h2>Your NFTs (W4NFT)</h2>
          {loading && <p>Loading NFTs...</p>}
          {!loading && nfts.length === 0 && <p>No NFTs found</p>}
          <ul>
            {nfts.map(id => (
              <li key={id}>Token ID: {id}</li>
            ))}
          </ul>
        </>
      )}
      {error && <p style={{color:"red"}}>{error}</p>}
    </div>
  );
}

// Simple form to send tokens
function SendForm({ onSend, loading }) {
  const [to, setTo] = React.useState("");
  const [amount, setAmount] = React.useState("");

  const submit = e => {
    e.preventDefault();
    if (!to || !amount) return;
    onSend(to, amount);
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 20 }}>
      <input
        type="text"
        placeholder="Recipient address"
        value={to}
        onChange={e => setTo(e.target.value)}
        style={{ width: "300px", marginRight: "10px" }}
        disabled={loading}
      />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        style={{ width: "100px", marginRight: "10px" }}
        disabled={loading}
      />
      <button type="submit" disabled={loading}>Send</button>
    </form>
  );
}
