// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Web4assetEscrow {
    struct Escrow {
        address buyer;
        address seller;
        uint256 amount;
        bool released;
    }

    mapping(uint256 => Escrow) public escrows;
    uint256 public escrowCount;

    function createEscrow(address seller) public payable {
        escrowCount++;
        escrows[escrowCount] = Escrow(msg.sender, seller, msg.value, false);
    }

    function releaseFunds(uint256 escrowId) public {
        Escrow storage escrow = escrows[escrowId];
        require(msg.sender == escrow.buyer, "Only buyer can release funds");
        require(!escrow.released, "Funds already released");
        escrow.released = true;
        payable(escrow.seller).transfer(escrow.amount);
    }
}
