// migrations/1_deploy_contracts.js
const Oracle = artifacts.require("Oracle");
const SupplyChainAutomation = artifacts.require("SupplyChainAutomation");

module.exports = async function(deployer) {
    // Deploy the Oracle contract first
    await deployer.deploy(Oracle, { from: web3.eth.accounts[0] });
    const oracle = await Oracle.deployed();

    // Deploy the SupplyChainAutomation contract with the Oracle address
    await deployer.deploy(SupplyChainAutomation, oracle.address, { from: web3.eth.accounts[0] });
};
