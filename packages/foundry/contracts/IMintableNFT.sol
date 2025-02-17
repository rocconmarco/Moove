// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IERC721 } from "@openzeppelin/contracts/interfaces/IERC721.sol";

/**
 * Interface defining the minting functions utilized by AuctionAlpha
 * @author Marco Roccon
 */
interface IMintableNFT is IERC721 {
  event NFTMinted(address indexed to, uint256 indexed tokenId);
  event AuthorizedMinterAdded(address indexed minter);
  event AuthorizedMinterRemoved(address indexed formerMinter);

  function mint(address to, uint256 tokenId) external;

  function safeMint(address to, uint256 tokenId) external;

  function addAuthorizedMinter(
    address minter
  ) external;

  function removeAuthorizedMinter(
    address minter
  ) external;

  function getMaxSupply() external view returns (uint256);
}
