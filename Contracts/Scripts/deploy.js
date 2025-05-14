async function main() {
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Donation = await ethers.getContractFactory("Donation");
  const donation = await Donation.deploy();
  console.log("Donation contract deployed to:", donation.address);

  // Repeat for other contracts
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
