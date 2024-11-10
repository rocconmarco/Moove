// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IMintableNFT } from "./IMintableNFT.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract MooveNFT is ERC721, IMintableNFT, Ownable {

  error MooveNFT__MintingNotAuthorized();
  error MooveNFT__MintingNonExistingToken();
  error MooveNFT__NotAValidAddress();
  error MooveNFT__NotAValidBaseURI();
  error MooveNFT__MaxSupplyCanOnlyBeInremented();

  uint256 public s_tokenCounter;
  // This must be in the form ipfs://<CID>
  string private s_baseURI;
  uint256 private s_maxSupply;

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
    s_maxSupply = 13;
  }

  function mint(address to, uint256 tokenId) external {
    if(to == address(0)) {
      revert MooveNFT__NotAValidAddress();
    }
    if(tokenId == 0 || tokenId > s_maxSupply) {
      revert MooveNFT__MintingNonExistingToken();
    }
    if(s_authorizedMinters[msg.sender]) {
      _mint(to, tokenId);
      s_tokenCounter++;
      emit NFTMinted(to, tokenId);
    } else {
      revert MooveNFT__MintingNotAuthorized();
    }
  }

  function safeMint(address to, uint256 tokenId) external {
    if(to == address(0)) {
      revert MooveNFT__NotAValidAddress();
    }
    if(tokenId == 0 || tokenId > s_maxSupply) {
      revert MooveNFT__MintingNonExistingToken();
    }
    if(s_authorizedMinters[msg.sender]) {
      _safeMint(to, tokenId);
      s_tokenCounter++;
      emit NFTMinted(to, tokenId);
    } else {
      revert MooveNFT__MintingNotAuthorized();
    }
  }

  function addAuthorizedMinter(address minter) public onlyOwner {
    if(minter == address(0)) {
      revert MooveNFT__NotAValidAddress();
    }
    s_authorizedMinters[minter] = true;
  }

  function removeAuthorizedMinter(address minter) public onlyOwner {
    s_authorizedMinters[minter] = false;
  }

  function getMaxSupply() public view returns(uint256) {
    return s_maxSupply;
  }

  function tokenURI(uint256 tokenId) public view override returns(string memory) {
    return string(abi.encodePacked(s_baseURI, '/', Strings.toString(tokenId), '.json'));
  }

  function checkIfAuthorizedMinter(address minter) public view returns(bool) {
    return s_authorizedMinters[minter];
  }
}
