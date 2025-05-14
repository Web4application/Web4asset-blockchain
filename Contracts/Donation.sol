// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Donation {
    struct DonationDetails {
        address donor;
        uint256 amount;
        string message;
    }

    mapping(uint256 => DonationDetails) public donations;
    uint256 public donationCount;

    event DonationReceived(address indexed donor, uint256 amount, string message);

    function donate(string memory message) public payable {
        require(msg.value > 0, "Donation amount must be greater than zero");
        donationCount++;
        donations[donationCount] = DonationDetails(msg.sender, msg.value, message);
        emit DonationReceived(msg.sender, msg.value, message);
    }

    function getDonation(uint256 donationId) public view returns (address, uint256, string memory) {
        DonationDetails memory donation = donations[donationId];
        return (donation.donor, donation.amount, donation.message);
    }
}
