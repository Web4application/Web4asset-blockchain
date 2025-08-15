// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ERC1967Proxy (constructor-initialized)
 * @notice Minimal proxy that stores implementation at EIP‑1967 slot and delegates all calls.
 * @dev No admin API here—UUPS puts upgrade control in the implementation itself.
 */
contract ERC1967Proxy {
    // keccak256("eip1967.proxy.implementation") - 1
    bytes32 private constant _IMPLEMENTATION_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    constructor(address _logic, bytes memory _data) payable {
        require(_logic.code.length > 0, "impl !contract");
        assembly { sstore(_IMPLEMENTATION_SLOT, _logic) }

        if (_data.length > 0) {
            (bool ok, bytes memory ret) = _logic.delegatecall(_data);
            require(ok, _getRevertMsg(ret));
        }
    }

    // ---- Fallback ----
    receive() external payable { _fallback(); }
    fallback() external payable { _fallback(); }

    function _fallback() internal {
        address impl;
        bytes32 slot = _IMPLEMENTATION_SLOT;
        assembly { impl := sload(slot) }
        assembly {
            calldatacopy(0x00, 0x00, calldatasize())
            let result := delegatecall(gas(), impl, 0x00, calldatasize(), 0x00, 0x00)
            let size := returndatasize()
            returndatacopy(0x00, 0x00, size)
            switch result
            case 0 { revert(0x00, size) }
            default { return(0x00, size) }
        }
    }

    function _getRevertMsg(bytes memory ret) private pure returns (string memory) {
        if (ret.length < 68) return "delegatecall failed";
        assembly { ret := add(ret, 0x04) }
        return abi.decode(ret, (string));
    }
}
