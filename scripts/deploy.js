const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with: ${deployer.address}`);

  const Token = await ethers.getContractFactory("Web4AssetToken");
  const token = await Token.deploy();
  await token.deployed();
  console.log(`Token deployed at: ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
