// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Oracle {
    uint256 private data;

    event DataUpdated(uint256 newData);

    function updateData(uint256 _data) external {
        data = _data;
        emit DataUpdated(_data);
    }

    function getData() external view returns (uint256) {
        return data;
    }
}
