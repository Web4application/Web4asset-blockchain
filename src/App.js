import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

// RPC URL and wallet address configuration
const RPC_URL = "https://web4asset.io/rpc";
const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";

// Sample token configuration
const TOKEN_CONTRACTS = [
  {
    symbol: "W4T",
    address: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
    type: "ERC20"
  },
  {
    symbol: "W4NFT",
    address: "0x123456789abcdef123456789abcdef1234567890",
    type: "ERC721",
    tokenIds: [1, 2, 3] // <-- NFTs owned
  }
];

// ABI definitions for ERC20 and ERC721 tokens
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

const ERC721_ABI = [
  "function tokenURI(uint256 tokenId) view returns (string)"
];

function App() {
  const [nativeBalance, setNativeBalance] = useState("Loading...");
  const [tokenBalances, setTokenBalances] = useState({});
  const [nfts, setNFTs] = useState([]);
  const [balance, setBalance] = useState(0);

  // Function to connect the wallet via MetaMask
  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request account access
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance)); // Format the balance to Ether (or W4T)
    } else {
      alert("Please install MetaMask");
    }
  }

  // Function to load wallet data (native balance, token balances, and NFTs)
  useEffect(() => {
    async function loadWalletData() {
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      const balances = {};
      const nftMetadata = [];

      try {
        const native = await provider.getBalance(walletAddress);
        setNativeBalance(ethers.utils.formatEther(native) + " W4T");

        for (const token of TOKEN_CONTRACTS) {
          const contract = new ethers.Contract(
            token.address,
            token.type === "ERC20" ? ERC20_ABI : ERC721_ABI,
            provider
          );

          if (token.type === "ERC20") {
            const balance = await contract.balanceOf(walletAddress);
            const decimals = await contract.decimals();
            balances[token.symbol] = ethers.utils.formatUnits(balance, decimals);
          }

          if (token.type === "ERC721" && token.tokenIds) {
            for (const tokenId of token.tokenIds) {
              try {
                let uri = await contract.tokenURI(tokenId);
                if (uri.startsWith("ipfs://")) {
                  uri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
                }
                const res = await fetch(uri);
                const meta = await res.json();
                nftMetadata.push({
                  name: meta.name || `Token #${tokenId}`,
                  description: meta.description || "",
                  image: meta.image?.replace("ipfs://", "https://ipfs.io/ipfs/") || null,
                  tokenId
                });
              } catch (e) {
                console.warn(`Error fetching metadata for token ${tokenId}`);
              }
            }
          }
        }

        setTokenBalances(balances);
        setNFTs(nftMetadata);
      } catch (err) {
        console.error(err);
        setNativeBalance("Error");
      }
    }

    loadWalletData();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Web4Asset Wallet</h1>

      {/* MetaMask Wallet Connection */}
      <div>
        <button onClick={connectWallet}>Connect Wallet</button>
        <p>Balance: {balance} W4T</p>
      </div>

      {/* Native Balance */}
      <p><strong>Address:</strong> {walletAddress}</p>
      <p><strong>Native Balance:</strong> {nativeBalance}</p>

      {/* Token Balances */}
      <h2>Token Balances</h2>
      <ul>
        {Object.entries(tokenBalances).map(([symbol, bal]) => (
          <li key={symbol}>{symbol}: {bal}</li>
        ))}
      </ul>

      {/* NFT Gallery */}
      {nfts.length > 0 && (
        <>
          <h2>NFT Gallery</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 15 }}>
            {nfts.map((nft, idx) => (
              <div key={idx} style={{
                width: 160, border: "1px solid #ccc", padding: 10,
                borderRadius: 8, background: "#fafafa"
              }}>
                {nft.image ? (
                  <img src={nft.image} alt={nft.name} style={{ width: "100%", borderRadius: 4 }} />
                ) : <div style={{ height: 150, background: "#eee" }} />}
                <strong>{nft.name}</strong>
                <p style={{ fontSize: 12 }}>{nft.description}</p>
                <small>ID: {nft.tokenId}</small>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
