// src/utils/nft.js
import { ethers } from "ethers";

const ERC721_ABI = [
  "function tokenURI(uint256 tokenId) view returns (string)",
];

export async function fetchNFTMetadata(provider, contractAddress, tokenId) {
  try {
    const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
    let tokenUri = await contract.tokenURI(tokenId);

    // Support ipfs:// URIs by replacing with public gateway
    if (tokenUri.startsWith("ipfs://")) {
      tokenUri = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
    }

    const response = await fetch(tokenUri);
    if (!response.ok) throw new Error("Failed to fetch metadata");

    const metadata = await response.json();
    return metadata;
  } catch (error) {
    console.error(`Error fetching metadata for token ${tokenId} of contract ${contractAddress}`, error);
    return null;
  }
}
