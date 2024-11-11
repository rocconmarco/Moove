//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { AuctionAlpha } from "../contracts/AuctionAlpha.sol";
import { MooveNFT } from "../contracts/MooveNFT.sol";

contract DeployAuctionAlpha is Script {
  /**
   * @dev the broadcast starts in DeployScript.s.sol
   * @dev we removed the startBroadcast here to avoid conflicts
   */
  function run(address mooveNFTAddress) external returns(AuctionAlpha) {
    vm.startBroadcast();
    AuctionAlpha auctionAlpha = new AuctionAlpha(mooveNFTAddress);
    vm.stopBroadcast();

    return auctionAlpha;
  }
}
