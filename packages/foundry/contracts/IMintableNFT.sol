// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IERC721 } from "@openzeppelin/contracts/interfaces/IERC721.sol";

interface IMintableNFT is IERC721 {
    event NFTMinted(address indexed to, uint256 indexed tokenId);

    function mint(address to, uint256 tokenId) external;
    function safeMint(address to, uint256 tokenId) external;
}