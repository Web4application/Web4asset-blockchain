import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { fetchNFTMetadata } from "../utils/nft";
import SendTransactionForm from "./SendTransactionForm";

export default function WalletCard({ wallet, passphrase }) {
  const { address, encryptedPrivateKey, tokens } = wallet;
  const [privateKey, setPrivateKey] = useState(null);
  const [locked, setLocked] = useState(true);
  const [nftMetadataList, setNftMetadataList] = useState([]);

  const provider = new ethers.providers.JsonRpcProvider("https://web4asset.io/rpc");

  // Decrypt private key on unlock
  function unlockWallet() {
    try {
      // Replace with your actual decrypt method using passphrase
      // Here, assuming it's base64 encoded or similar for demo
      // Use your crypto library or method here!
      // This is a placeholder:
      const decryptedKey = atob(encryptedPrivateKey); // Replace with real decrypt!
      setPrivateKey(decryptedKey);
      setLocked(false);
    } catch (e) {
      alert("Failed to decrypt private key. Check passphrase.");
    }
  }

  // Fetch NFT metadata on unlock or tokens change
  useEffect(() => {
    async function loadNFTMetadata() {
      if (locked) {
        setNftMetadataList([]);
        return;
      }

      const nftTokensWithIds = tokens.filter(t => t.tokenIds && t.tokenIds.length > 0);
      let metadataResults = [];

      for (const nftToken of nftTokensWithIds) {
        for (const tokenId of nftToken.tokenIds) {
          const metadata = await fetchNFTMetadata(provider, nftToken.contractAddress, tokenId);
          if (metadata) {
            metadataResults.push({
              contract: nftToken.contractAddress,
              tokenId,
              name: metadata.name || `Token #${tokenId}`,
              description: metadata.description || "",
              image: metadata.image ? metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/") : null,
            });
          }
        }
      }
      setNftMetadataList(metadataResults);
    }

    loadNFTMetadata();
  }, [locked, tokens, provider]);

  return (
    <div style={{ border: "1px solid #ccc", padding: 20, marginBottom: 20 }}>
      <h3>Wallet: {address}</h3>

      {locked ? (
        <button onClick={unlockWallet}>Unlock Wallet</button>
      ) : (
        <>
          <h4>Tokens</h4>
          <ul>
            {tokens.map(({ symbol, balance }) => (
              <li key={symbol}>
                {symbol}: {balance}
              </li>
            ))}
          </ul>

          <SendTransactionForm privateKey={privateKey} tokens={tokens} />

          {nftMetadataList.length > 0 && (
            <>
              <h4>NFT Gallery</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 15, marginTop: 10 }}>
                {nftMetadataList.map(({ tokenId, name, image, description }, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: 8,
                      padding: 10,
                      width: 150,
                      textAlign: "center",
                      background: "#fafafa",
                    }}
                  >
                    {image ? (
                      <img src={image} alt={name} style={{ width: "100%", borderRadius: 4 }} />
                    ) : (
                      <div style={{ height: 150, backgroundColor: "#eee", borderRadius: 4 }} />
                    )}
                    <strong>{name}</strong>
                    <p style={{ fontSize: 12, color: "#555" }}>{description}</p>
                    <small>Token ID: {tokenId}</small>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
