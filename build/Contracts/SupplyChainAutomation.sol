// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Oracle.sol";

contract SupplyChainAutomation {
    Oracle private oracle;

    event ActionTriggered(uint256 data);

    constructor(address oracleAddress) {
        oracle = Oracle(oracleAddress);
    }

    function triggerActionIfNeeded() external {
        uint256 oracleData = oracle.getData();
        // Your automation logic; for example:
        if (oracleData > 100) {
            emit ActionTriggered(oracleData);
            // ... add automation steps here
        }
    }
}
