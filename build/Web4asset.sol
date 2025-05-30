// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Web4Asset is ERC721 {
    uint256 private _tokenIds;

    constructor() ERC721("Web4Asset", "W4A") {}

    function mint(address to) public returns (uint256) {
        _tokenIds++;
        _mint(to, _tokenIds);
        return _tokenIds;
    }
}
