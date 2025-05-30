const Oracle = artifacts.require("Oracle");
const SupplyChainAutomation = artifacts.require("SupplyChainAutomation");

module.exports = async function(deployer, network, accounts) {
    const deployerAccount = accounts[0];

    // Deploy Oracle contract
    await deployer.deploy(Oracle, { from: deployerAccount });
    const oracle = await Oracle.deployed();

    // Deploy SupplyChainAutomation with Oracle's address
    await deployer.deploy(SupplyChainAutomation, oracle.address, { from: deployerAccount });
};
