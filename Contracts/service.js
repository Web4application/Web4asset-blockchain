import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const donationAddress = "0x..."; // Address of the deployed Donation contract
const donationABI = [ /* ABI of the Donation contract */ ];
const donationContract = new ethers.Contract(donationAddress, donationABI, signer);

export async function donate(amount, message) {
  const tx = await donationContract.donate(message, { value: ethers.utils.parseEther(amount) });
  await tx.wait();
}

export async function getDonation(donationId) {
  return await donationContract.getDonation(donationId);
}

// Repeat for other contracts
