// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicketSales {
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

    function buyTicket(uint256 ticketId) public payable {
        Ticket storage ticket = tickets[ticketId];
        require(msg.value == ticket.price, "Incorrect ticket price");
        require(!ticket.used, "Ticket already used");
        ticket.owner = msg.sender;
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
