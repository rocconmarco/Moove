//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/AuctionAlpha.sol";
import "./DeployHelpers.s.sol";

contract DeployYourContract is ScaffoldETHDeploy {
  // use `deployer` from `ScaffoldETHDeploy`
  function run() external ScaffoldEthDeployerRunner {
    AuctionAlpha auctionAlpha = new AuctionAlpha(deployer);
    console.logString(
      string.concat(
        "YourContract deployed at: ", vm.toString(address(auctionAlpha))
      )
    );
  }
}
