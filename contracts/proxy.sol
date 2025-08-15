// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title TransparentUpgradeableProxy (EIP-1967)
 * @notice Modern, minimal, auditable proxy:
 *         - Uses fixed EIP-1967 storage slots (no collisions)
 *         - Transparent pattern: admin can call admin functions; users get delegated logic
 *         - Upgrade with {upgradeTo} / {upgradeToAndCall}
 *         - Optional initializer call in constructor
 *
 * @dev Admin WARNING:
 *      Admin-only functions are available only to the current admin address.
 *      Non-admins always hit the fallback and get delegated to the implementation.
 */
contract TransparentUpgradeableProxy {
    // keccak256("eip1967.proxy.implementation") - 1
    bytes32 private constant _IMPLEMENTATION_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    // keccak256("eip1967.proxy.admin") - 1
    bytes32 private constant _ADMIN_SLOT =
        0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;

    event Upgraded(address indexed implementation);
    event AdminChanged(address previousAdmin, address newAdmin);

    constructor(address _logic, address _admin, bytes memory _data) payable {
        require(_logic != address(0), "impl=0");
        require(_admin != address(0), "admin=0");
        _setImplementation(_logic);
        _setAdmin(_admin);

        // Optional initializer via delegatecall
        if (_data.length > 0) {
            (bool ok, bytes memory ret) = _logic.delegatecall(_data);
            require(ok, _getRevertMsg(ret));
        }
    }

    // ======== Admin view (only when called by admin; users hit fallback) ========

    modifier ifAdmin() {
        if (msg.sender == _getAdmin()) {
            _;
        } else {
            _fallback();
        }
    }

    function admin() external ifAdmin returns (address) {
        return _getAdmin();
    }

    function implementation() external ifAdmin returns (address) {
        return _getImplementation();
    }

    function changeAdmin(address newAdmin) external ifAdmin {
        require(newAdmin != address(0), "newAdmin=0");
        emit AdminChanged(_getAdmin(), newAdmin);
        _setAdmin(newAdmin);
    }

    function upgradeTo(address newImplementation) external ifAdmin {
        _upgradeTo(newImplementation);
    }

    function upgradeToAndCall(address newImplementation, bytes calldata data)
        external
        payable
        ifAdmin
    {
        _upgradeTo(newImplementation);
        (bool ok, bytes memory ret) = newImplementation.delegatecall(data);
        require(ok, _getRevertMsg(ret));
    }

    // ========================= Fallback / Receive ==============================

    receive() external payable {
        _fallback();
    }

    fallback() external payable {
        _fallback();
    }

    function _fallback() internal {
        _delegate(_getImplementation());
    }

    // ======================= Internal: Delegate utils ==========================

    function _delegate(address impl) internal {
        assembly {
            // Copy calldata
            calldatacopy(0x00, 0x00, calldatasize())
            // Delegatecall to impl
            let result := delegatecall(gas(), impl, 0x00, calldatasize(), 0x00, 0x00)
            // Copy returndata
            let size := returndatasize()
            returndatacopy(0x00, 0x00, size)
            // Return or revert
            switch result
            case 0 { revert(0x00, size) }
            default { return(0x00, size) }
        }
    }

    // ======================= Internal: EIP-1967 slots ==========================

    function _getImplementation() internal view returns (address impl) {
        bytes32 slot = _IMPLEMENTATION_SLOT;
        assembly {
            impl := sload(slot)
        }
        require(impl != address(0), "impl unset");
    }

    function _setImplementation(address newImpl) internal {
        require(newImpl.code.length > 0, "impl !contract");
        bytes32 slot = _IMPLEMENTATION_SLOT;
        assembly {
            sstore(slot, newImpl)
        }
    }

    function _upgradeTo(address newImpl) internal {
        address current = _getImplementation();
        require(newImpl != current, "same impl");
        _setImplementation(newImpl);
        emit Upgraded(newImpl);
    }

    function _getAdmin() internal view returns (address adm) {
        bytes32 slot = _ADMIN_SLOT;
        assembly {
            adm := sload(slot)
        }
        require(adm != address(0), "admin unset");
    }

    function _setAdmin(address newAdmin) internal {
        bytes32 slot = _ADMIN_SLOT;
        assembly {
            sstore(slot, newAdmin)
        }
    }

    // ======================== Internal: revert reason ==========================

    function _getRevertMsg(bytes memory ret) private pure returns (string memory) {
        if (ret.length < 68) return "delegatecall failed";
        assembly {
            ret := add(ret, 0x04)
        }
        return abi.decode(ret, (string));
    }
}
