// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IMintableNFT } from "./IMintableNFT.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract MooveNFT is ERC721, IMintableNFT, Ownable {

  error MooveNFT__MintingNotAuthorized();

  uint256 private s_tokenCounter;

  // This must be in the form ipfs://<CID>
  string private s_baseURI;

  // It is not a constant variable because the owner will have the choice
  // to release other collections in the future
  uint256 public s_maxSupply;

  // A mapping of all the addresses authorized to mint NFTs
  // created to avoid unathorized minting of NFTs directly from this contract
  // Users must win the auction to mint the NFT
  // Ideally, only the AuctionAlpha address should be authorized
  // This mapping is created because of the impossibility to pass the AuctionAlpha address while deploying
  // since the AuctionAlpha contract also needs MooveNFT's address to be correctly deployed
  mapping (address => bool) private s_authorizedMinters;

  constructor(string memory baseURI) ERC721("MooveNFT", "MOOVE") Ownable(msg.sender) {
    s_baseURI = baseURI;
    s_tokenCounter = 0;
  }

  function mint(address to, uint256 tokenId) external {
    if(s_authorizedMinters[msg.sender]) {
      _mint(to, tokenId);
      emit NFTMinted(to, tokenId);
    } else {
      revert MooveNFT__MintingNotAuthorized();
    }
  }

  function safeMint(address to, uint256 tokenId) external {
    if(s_authorizedMinters[msg.sender]) {
      _safeMint(to, tokenId);
      emit NFTMinted(to, tokenId);
    } else {
      revert MooveNFT__MintingNotAuthorized();
    }
  }

  function addAuthorizedMinter(address minter) public onlyOwner {
    s_authorizedMinters[minter] = true;
  }

  function tokenURI(uint256 tokenId) public view override returns(string memory) {
    return string(abi.encodePacked(s_baseURI, '/', Strings.toString(tokenId), '.json'));
  }

  function setMaxSupply(uint256 maxSupply) public onlyOwner {
    s_maxSupply = maxSupply;
  }

  function checkIfAuthorizedMinter(address minter) public view returns(bool) {
    return s_authorizedMinters[minter];
  }
}
