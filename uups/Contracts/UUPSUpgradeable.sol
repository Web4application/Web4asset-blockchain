// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title UUPSUpgradeable
 * @notice Drop-in base to make an implementation UUPS-upgradeable.
 * @dev Implementation must provide _authorizeUpgrade() access control (e.g., onlyOwner).
 *      proxiableUUID returns the EIP-1967 slot and must revert when called through a proxy.
 */
abstract contract UUPSUpgradeable {
    // keccak256("eip1967.proxy.implementation") - 1
    bytes32 internal constant _IMPLEMENTATION_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    event Upgraded(address indexed implementation);

    modifier onlyProxy() {
        // Must be called via delegatecall AND must be the active implementation
        require(address(this) != _self(), "UUPS: must be called via proxy");
        require(_getImplementation() == _self(), "UUPS: not active implementation");
        _;
    }

    modifier notDelegated() {
        require(address(this) == _self(), "UUPS: must not be called via delegatecall");
        _;
    }

    // ---- UUPS core ----

    function proxiableUUID() external view notDelegated returns (bytes32) {
        return _IMPLEMENTATION_SLOT;
    }

    function upgradeTo(address newImplementation) external onlyProxy {
        _authorizeUpgrade(newImplementation);
        _upgradeTo(newImplementation);
    }

    function upgradeToAndCall(address newImplementation, bytes calldata data)
        external
        payable
        onlyProxy
    {
        _authorizeUpgrade(newImplementation);
        _upgradeTo(newImplementation);
        (bool ok, bytes memory ret) = newImplementation.delegatecall(data);
        require(ok, _getRevertMsg(ret));
    }

    // ---- hooks you must implement ----
    function _authorizeUpgrade(address newImplementation) internal virtual;

    // ---- internals ----
    function _upgradeTo(address newImplementation) internal {
        require(newImplementation.code.length > 0, "UUPS: impl !contract");
        address current = _getImplementation();
        require(newImplementation != current, "UUPS: same impl");
        _setImplementation(newImplementation);
        emit Upgraded(newImplementation);
    }

    function _getImplementation() internal view returns (address impl) {
        bytes32 slot = _IMPLEMENTATION_SLOT;
        assembly { impl := sload(slot) }
    }

    function _setImplementation(address newImpl) internal {
        bytes32 slot = _IMPLEMENTATION_SLOT;
        assembly { sstore(slot, newImpl) }
    }

    function _self() private view returns (address) {
        return address(this);
    }

    function _getRevertMsg(bytes memory ret) private pure returns (string memory) {
        if (ret.length < 68) return "delegatecall failed";
        assembly { ret := add(ret, 0x04) }
        return abi.decode(ret, (string));
    }
}
