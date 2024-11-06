// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IMintableNFT } from "./IMintableNFT.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract MooveNFT is ERC721, IMintableNFT, Ownable {
  uint256 private s_tokenCounter;

  // This must be in the form ipfs://<CID>
  string private s_baseURI;

  // It is not a constant variable because the owner will have the choice
  // to release other collections in the future
  uint256 public s_maxSupply;

  constructor(string memory baseURI) ERC721("MooveNFT", "MOOVE") Ownable(msg.sender) {
    s_baseURI = baseURI;
    s_tokenCounter = 0;
  }

  function mint(address to, uint256 tokenId) external {
    _mint(to, tokenId);
  }

    function safeMint(address to, uint256 tokenId) external {
    _safeMint(to, tokenId);
  }

  function tokenURI(uint256 tokenId) public view override returns(string memory) {
    return string(abi.encodePacked(s_baseURI, '/', Strings.toString(tokenId), '.json'));
  }

  function setMaxSupply(uint256 maxSupply) public onlyOwner {
    s_maxSupply = maxSupply;
  }
}
