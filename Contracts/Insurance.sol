// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Web4assetInsurance {
    struct Policy {
        address policyHolder;
        uint256 premium;
        uint256 coverageAmount;
        uint256 startTime;
        uint256 duration;
        bool claimed;
    }

    mapping(address => Policy) public policies;

    function purchasePolicy(uint256 premium, uint256 coverageAmount, uint256 duration) public payable {
        require(msg.value == premium, "Incorrect premium amount");
        policies[msg.sender] = Policy(msg.sender, premium, coverageAmount, block.timestamp, duration, false);
    }

    function claimInsurance() public {
        Policy storage policy = policies[msg.sender];
        require(!policy.claimed, "Insurance already claimed");
        require(block.timestamp < policy.startTime + policy.duration, "Policy expired");
        policy.claimed = true;
        payable(msg.sender).transfer(policy.coverageAmount);
    }
}
