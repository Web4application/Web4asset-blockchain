const { ethers } = require("hardhat");

async function main() {
  const Token = await ethers.getContractFactory("TestToken");
  const token = await Token.deploy();
  await token.deployed();
  console.log("Token deployed to:", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
