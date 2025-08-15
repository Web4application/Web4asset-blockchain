// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./UUPSUpgradeable.sol";
import "./OwnableUpgradeable.sol";

/**
 * @title AssetChainV1 (UUPS)
 * @notice First version of your logic contract. Keep storage layout stable across versions.
 */
contract AssetChainV1 is UUPSUpgradeable, OwnableUpgradeable {
    // ---- Storage (DO NOT REORDER/REMOVE; only append in V2+) ----
    string public name;
    mapping(address => uint256) public balances;

    bool private _initializedV1;

    event Mint(address indexed to, uint256 amount);

    // initializer instead of constructor
    function initialize(address _owner, string calldata _name) external {
        require(!_initializedV1, "V1: already initialized");
        _initializedV1 = true;

        __Ownable_init(_owner);
        name = _name;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        balances[to] += amount;
        emit Mint(to, amount);
    }

    // ---- UUPS access control ----
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
