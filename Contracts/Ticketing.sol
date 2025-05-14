// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ticketing {
    struct Ticket {
        uint256 eventId;
        address owner;
        uint256 price;
        bool used;
    }

    mapping(uint256 => Ticket) public tickets;
    uint256 public ticketCount;

    function createTicket(uint256 eventId, uint256 price) public {
        ticketCount++;
        tickets[ticketCount] = Ticket(eventId, msg.sender, price, false);
    }

    function transferTicket(uint256 ticketId, address newOwner) public {
        Ticket storage ticket = tickets[ticketId];
        require(msg.sender == ticket.owner, "Only owner can transfer ticket");
        ticket.owner = newOwner;
    }

    function useTicket(uint256 ticketId) public {
        Ticket storage ticket = tickets[ticketId];
        require(msg.sender == ticket.owner, "Only owner can use ticket");
        require(!ticket.used, "Ticket already used");
        ticket.used = true;
    }

    function getTicket(uint256 ticketId) public view returns (uint256, address, uint256, bool) {
        Ticket memory ticket = tickets[ticketId];
        return (ticket.eventId, ticket.owner, ticket.price, ticket.used);
    }
}
