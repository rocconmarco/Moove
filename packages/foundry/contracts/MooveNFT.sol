// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { IMintableNFT } from "./IMintableNFT.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";


/**
 * A smart contract that manages the minting process of MooveNFT
 * @author Marco Roccon
 * @dev The contract inherits from the ERC721 and Ownable contract by OpenZeppelin
 * @dev The contract communicates with the AuctionAlpha via a custom interface that only implements
 * @dev the required functions, which are mint, safeMint and getMaxSupply
 */
contract MooveNFT is ERC721, IMintableNFT, Ownable {

  error MooveNFT__MintingNotAuthorized();
  error MooveNFT__MintingNonExistingToken();
  error MooveNFT__NotAValidAddress();
  error MooveNFT__NotAValidBaseURI();
  error MooveNFT__MaxSupplyCanOnlyBeInremented();

  uint256 public s_tokenCounter;
  string private s_baseURI;
  uint256 private s_maxSupply;

  /**
   * A mapping of all the addresses authorized to mint NFTs
   * created to avoid unathorized minting of NFTs directly from this contract
   * Users must win the auction to mint the NFT
   * @dev Ideally, only the AuctionAlpha address should be authorized
   * @dev This mapping is created because of the impossibility to pass the AuctionAlpha address while deploying
   * @dev since the AuctionAlpha contract also needs MooveNFT's address to be correctly deployed
   */ 
  mapping (address => bool) private s_authorizedMinters;

  /**
   * This mapping is useful for fetching all the NFTs owned by a particular user
   * Once an NFT is minted, its tokenId will be added to the array associated with
   * the user's address.
   * @dev This mapping is updated everytime a new NFT is minted, and also when
   * the transfer function is called
   */
  mapping (address => uint256[]) private s_ownedNFTsByUser;

  /**
   * This mapping keeps track of the array index of a particular NFT when owned by a user
   * @dev It is useful for avoiding nested for loops when trasferring token and 
   * @dev updating the uint256 array stored within the s_ownedNFTsByUser mapping
   */
  mapping (address => mapping(uint256 => uint256)) private s_arrayIndexByTokenId;



  /**
   * @param baseURI the base URI for Moove NFTs' metadata stored in IPFS, the format of the string should be ipfs://<CID>
   * The ERC721 token is inizialized with the name "MooveNFT" and with the symbol "MOOVE"
   * The owner of the contract is set to be the sender of the deployment transaction
   */
  constructor(string memory baseURI) ERC721("MooveNFT", "MOOVE") Ownable(msg.sender) {
    s_baseURI = baseURI;
    s_tokenCounter = 0;
    s_maxSupply = 13;
  }

  /**
   * @param to recipient address
   * @param tokenId id of the NFT to be minted
   * @dev Implementation of the mint function from the ERC721 standard
   * @dev It checks whether the sender is an authorized address
   * @dev If minted successfully, the token counter will increment
   */
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
      s_ownedNFTsByUser[to].push(tokenId);
      s_arrayIndexByTokenId[to][tokenId] = s_ownedNFTsByUser[to].length;
      emit NFTMinted(to, tokenId);
    } else {
      revert MooveNFT__MintingNotAuthorized();
    }
  }

  /**
   * @param to recipient address
   * @param tokenId id of the NFT to be minted
   * @dev Implementation of the safeMint function from the ERC721 standard
   * @dev It checks whether the sender is an authorized address
   * @dev If minted successfully, the token counter will increment
   * @dev The AuctionAlpha contract utilizes safeMint to mint the NFT to the winner of the auction
   * @dev We prefer to use safeMint to check the receiver's capability to accept NFTs
   */
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
      s_ownedNFTsByUser[to].push(tokenId);
      s_arrayIndexByTokenId[to][tokenId] = s_ownedNFTsByUser[to].length - 1;
      emit NFTMinted(to, tokenId);
    } else {
      revert MooveNFT__MintingNotAuthorized();
    }
  }

  /**
   * Overriding the transferFrom function from ERC721 standard, in order to update
   * the mapping that keeps track of all the NFTs owned by a particular user
   */
  function transferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) {
      super.transferFrom(from, to, tokenId);
      _updateNFTOwnership(from, to, tokenId);
  }

  /**
   * @param minter address to be authorized
   * @dev This function allows the owner of the contract to grant minting rights over the NFT collection
   * @dev to a particular address
   * @dev It updates the mapping of authorized minters
   */
  function addAuthorizedMinter(address minter) public onlyOwner {
    if(minter == address(0)) {
      revert MooveNFT__NotAValidAddress();
    }
    s_authorizedMinters[minter] = true;
  }

    /**
   * @param minter address to be removed from the list of authorized minters
   * @dev This function allows the owner of the contract to revoke minting rights
   * @dev over the NFT collection for a particular address
   * @dev It updates the mapping of authorized minters
   */
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

  function getOwnedNFTsArray(address user) public view returns(uint256[] memory) {
    return s_ownedNFTsByUser[user];
  }

  /**
   * This function updates NFT ownership when the user transfers a particular token to another user
   * @param from address that currently owns the NFT
   * @param to recipient address
   * @param tokenId NFT to be transferred
   * 
   * @dev it updates the mapping s_ownedNFTsByUser, using the swap and pop technique to
   * @dev delete the token from the previous owner and push the tokenId to the array
   * @dev associated with the new owner
   * 
   * @dev it also keeps track of the index at which the tokenId is stored
   * @dev allowing a gas-efficient and constant-time (0(1)) access to the array
   */
  function _updateNFTOwnership(address from, address to, uint256 tokenId) internal {
    uint256 indexToRemove = _getIndexToRemove(from, tokenId);
    if (indexToRemove == s_ownedNFTsByUser[from].length - 1) {
      s_ownedNFTsByUser[from].pop();
    } else {
      uint256 lastTokenId = s_ownedNFTsByUser[from][s_ownedNFTsByUser[from].length - 1];
      s_ownedNFTsByUser[from][indexToRemove] = lastTokenId;
      s_arrayIndexByTokenId[from][lastTokenId] = indexToRemove;
      s_ownedNFTsByUser[from].pop();
    }
    s_ownedNFTsByUser[to].push(tokenId);
    s_arrayIndexByTokenId[to][tokenId] = s_ownedNFTsByUser[to].length - 1;
  }

  function _getIndexToRemove(address from, uint256 tokenId) internal view returns(uint256) {
    return s_arrayIndexByTokenId[from][tokenId];
  }
}
