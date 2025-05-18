import { ethers } from "ethers";
import { CONTRACTS, NETWORKS } from "../contracts/config.js";
import FadakaABI from "../contracts/Fadaka.json";

async function initBlockchain() {
  try {
    const provider = new ethers.JsonRpcProvider(NETWORKS.TESTNET);
    const fadakaContract = new ethers.Contract(CONTRACTS.FADAKA, FadakaABI, provider);

    console.log("Blockchain initialized");
    return { fadakaContract };
  } catch (error) {
    console.error("Blockchain initialization error:", error);
  }
}

export { initBlockchain };
