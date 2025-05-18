const { ethers } = require("hardhat");

async function main() {
  const tokenAddress = "YOUR_DEPLOYED_TOKEN_ADDRESS";
  const Faucet = await ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy(tokenAddress);
  await faucet.deployed();
  console.log(`Faucet deployed at: ${faucet.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
