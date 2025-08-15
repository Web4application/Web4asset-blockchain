// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./AssetChainV1.sol";

/**
 * @title AssetChainV2 (UUPS)
 * @notice Example upgrade: adds burn + a version getter. APPEND storage ONLY.
 */
contract AssetChainV2 is AssetChainV1 {
    // ---- New storage appended in V2 ----
    string public symbol;

    bool private _initializedV2;

    event Burn(address indexed from, uint256 amount);

    function initializeV2(string calldata _symbol) external {
        require(!_initializedV2, "V2: already initialized");
        _initializedV2 = true;
        symbol = _symbol;
    }

    function burn(uint256 amount) external {
        uint256 bal = balances[msg.sender];
        require(bal >= amount, "V2: insufficient");
        unchecked { balances[msg.sender] = bal - amount; }
        emit Burn(msg.sender, amount);
    }

    function version() external pure returns (string memory) {
        return "AssetChainV2";
    }

    // _authorizeUpgrade inherited (onlyOwner)
}
