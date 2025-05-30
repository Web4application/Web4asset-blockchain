import { ethers } from "ethers";
import config from "../config/config.json";

const provider = new ethers.JsonRpcProvider(config.network.rpcUrl);

export async function getBalance(address) {
  try {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error fetching balance:", error.message);
    return null;
  }
}

export async function getTokenBalance(address, contractAddress, abi) {
  try {
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const balance = await contract.balanceOf(address);
    return ethers.formatUnits(balance, 18);
  } catch (error) {
    console.error("Error fetching token balance:", error.message);
    return null;
  }
}
