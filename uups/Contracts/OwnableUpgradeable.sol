// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title OwnableUpgradeable
 * @notice Minimal initializer-based ownable mixin for proxies.
 */
abstract contract OwnableUpgradeable {
    address private _owner;
    bool private _ownableInitialized;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == _owner, "Ownable: not owner");
        _;
    }

    function __Ownable_init(address initialOwner) internal {
        require(!_ownableInitialized, "Ownable: already init");
        require(initialOwner != address(0), "Ownable: zero owner");
        _ownableInitialized = true;
        _owner = initialOwner;
        emit OwnershipTransferred(address(0), initialOwner);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Ownable: zero owner");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}
