// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InvestmentFund {
    struct Investment {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => Investment) public investments;
    uint256 public totalInvested;

    event InvestmentMade(address indexed investor, uint256 amount);
    event Withdrawal(address indexed investor, uint256 amount);

    function invest() public payable {
        require(msg.value > 0, "Investment amount must be greater than zero");
        investments[msg.sender] = Investment(msg.value, block.timestamp);
        totalInvested += msg.value;
        emit InvestmentMade(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public {
        Investment storage investment = investments[msg.sender];
        require(amount <= investment.amount, "Insufficient investment balance");
        investment.amount -= amount;
        totalInvested -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    function getInvestment() public view returns (uint256, uint256) {
        Investment memory investment = investments[msg.sender];
        return (investment.amount, investment.timestamp);
    }
}
