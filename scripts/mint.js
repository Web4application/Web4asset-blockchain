const { ethers } = require("hardhat");

async function main() {
  const tokenAddress = "YOUR_DEPLOYED_TOKEN_ADDRESS";
  const recipient = "0x1234567890abcdef1234567890abcdef12345678";
  const amount = ethers.parseUnits("5000", 18);

  const token = await ethers.getContractAt("Web4AssetToken", tokenAddress);
  const tx = await token.mint(recipient, amount);
  await tx.wait();

  console.log(`Minted ${amount} W4T to ${recipient}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
