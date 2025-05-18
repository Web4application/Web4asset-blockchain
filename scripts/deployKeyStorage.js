const { ethers } = require("hardhat");

async function main() {
    const KeyStorage = await ethers.getContractFactory("KeyStorage");
    const keyStorage = await KeyStorage.deploy();
    await keyStorage.deployed();
    console.log("KeyStorage deployed to:", keyStorage.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
