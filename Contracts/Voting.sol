// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public voters;
    uint256 public candidateCount;

    function addCandidate(string memory name) public {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, name, 0);
    }

    function vote(uint256 candidateId) public {
        require(!voters[msg.sender], "Already voted");
        require(candidateId > 0 && candidateId <= candidateCount, "Invalid candidate ID");
        candidates[candidateId].voteCount++;
        voters[msg.sender] = true;
    }

    function getCandidate(uint256 candidateId) public view returns (string memory, uint256) {
        require(candidateId > 0 && candidateId <= candidateCount, "Invalid candidate ID");
        Candidate memory candidate = candidates[candidateId];
        return (candidate.name, candidate.voteCount);
    }
}
