// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KeyStorage {
    string private key;

    function setKey(string memory _key) public {
        key = _key;
    }

    function getKey() public view returns (string memory) {
        return key;
    }
}
