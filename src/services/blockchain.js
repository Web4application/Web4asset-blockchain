import { ethers } from "ethers";
import ERC20_ABI from "../abis/ERC20.json";
import Faucet_ABI from "../abis/Faucet.json";
import config from "../config/config.json";

const provider = new ethers.JsonRpcProvider(config.network.rpcUrl);

export async function getTokenBalance(address, contractAddress) {
  try {
    const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
    const balance = await contract.balanceOf(address);
    return ethers.formatUnits(balance, 18);
  } catch (error) {
    console.error("Error fetching balance:", error.message);
    return "0";
  }
}

export async function requestTokens() {
  try {
    const faucetContract = new ethers.Contract(config.faucetContract, Faucet_ABI, provider.getSigner());
    const tx = await faucetContract.requestTokens();
    await tx.wait();
  } catch (error) {
    console.error("Faucet request failed:", error.message);
  }
}
