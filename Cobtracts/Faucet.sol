// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Web4AssetToken.sol";

contract Faucet {
    Web4AssetToken public token;
    uint256 public dripAmount = 100 * 10 ** 18;

    constructor(address _tokenAddress) {
        token = Web4AssetToken(_tokenAddress);
    }

    function requestTokens() external {
        require(token.balanceOf(address(this)) >= dripAmount, "Faucet empty");
        token.mint(msg.sender, dripAmount);
    }
}
