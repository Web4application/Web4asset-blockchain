// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeLockedInvestment {
    struct Investment {
        uint256 amount;
        uint256 startTime;
        uint256 lockDuration;
    }

    mapping(address => Investment) public investments;

    function invest(uint256 lockDuration) public payable {
        require(msg.value > 0, "Investment amount must be greater than zero");
        investments[msg.sender] = Investment(msg.value, block.timestamp, lockDuration);
    }

    function withdraw() public {
        Investment storage investment = investments[msg.sender];
        require(block.timestamp >= investment.startTime + investment.lockDuration, "Investment still locked");
        uint256 amount = investment.amount;
        investment.amount = 0;
        payable(msg.sender).transfer(amount);
    }

    function getInvestmentDetails() public view returns (uint256, uint256, uint256) {
        Investment memory investment = investments[msg.sender];
        return (investment.amount, investment.startTime, investment.lockDuration);
    }
}
