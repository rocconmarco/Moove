//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { AuctionAlpha } from "../contracts/AuctionAlpha.sol";
import { MooveNFT } from "../contracts/MooveNFT.sol";

contract DeployAuctionAlpha is Script {

  function run(address mooveNFTAddress) external returns(AuctionAlpha) {
    AuctionAlpha auctionAlpha = new AuctionAlpha(mooveNFTAddress);

    return auctionAlpha;
  }
}
