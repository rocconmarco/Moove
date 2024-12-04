//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { MooveNFT } from "../contracts/MooveNFT.sol";

contract DeployMooveNFT is Script {

  function run() external returns(MooveNFT) {
    string memory baseURI = "ipfs://bafybeiaepnzx772p5dc2vxbdm6xllkevw6uxu27ncx54cvw2kuloovazcm";
    vm.startBroadcast();
    MooveNFT mooveNFT = new MooveNFT(baseURI);
    vm.stopBroadcast();

    return mooveNFT;
  }
}
