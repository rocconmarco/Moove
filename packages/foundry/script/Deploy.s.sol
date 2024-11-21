//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import { DeployMooveNFT } from "./DeployMooveNFT.s.sol";
import { DeployAuctionAlpha } from "./DeployAuctionAlpha.s.sol";

contract DeployScript is ScaffoldETHDeploy {
  function run() external {
    DeployMooveNFT deployMooveNFT = new DeployMooveNFT();
    address mooveNFTAddress = address(deployMooveNFT.run());

    DeployAuctionAlpha deployAuctionAlpha = new DeployAuctionAlpha();
    deployAuctionAlpha.run(mooveNFTAddress);

  }
}