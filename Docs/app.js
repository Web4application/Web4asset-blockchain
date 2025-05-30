import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

// Web3 provider
const RPC_URL = "https://web4asset.io/rpc";  // RPC URL for your network
const walletAddress = "0x1234567890abcdef1234567890abcdef12345678"; // Sample wallet address

// Token contract configuration
const TOKEN_CONTRACTS = [
  {
    symbol: "W4T",
    address: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
    type: "ERC20",
  },
  {
    symbol: "W4NFT",
    address: "0x123456789abcdef123456789abcdef1234567890",
    type: "ERC721",
    tokenIds: [1, 2, 3],  // NFTs owned
  }
];

// ABIs for ERC20 and ERC721 contracts
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const ERC721_ABI = [
  "function tokenURI(uint256 tokenId) view returns (string)",
];

export default function App() {
  const [nativeBalance, setNativeBalance] = useState("Loading...");
  const [tokenBalances, setTokenBalances] = useState({});
  const [nfts, setNFTs] = useState([]);
  const [error, setError] = useState(null);

  // Fetch wallet data on component mount
  useEffect(() => {
    const loadWalletData = async () => {
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

          // Fetch ERC20 token balance
          if (token.type === "ERC20") {
            const balance = await contract.balanceOf(walletAddress);
            const decimals = await contract.decimals();
            balances[token.symbol] = ethers.utils.formatUnits(balance, decimals);
          }

          // Fetch ERC721 NFT metadata
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
                  tokenId,
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
        setError("Error loading wallet data.");
      }
    };

    loadWalletData();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Web4Asset Wallet</h1>
      <p><strong>Address:</strong> {walletAddress}</p>
      <p><strong>Native Balance:</strong> {nativeBalance}</p>

      <h2>Token Balances</h2>
      {Object.entries(tokenBalances).length ? (
        <ul>
          {Object.entries(tokenBalances).map(([symbol, balance]) => (
            <li key={symbol}>
              {symbol}: {balance}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tokens found</p>
      )}

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

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
