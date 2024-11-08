// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { Test } from "forge-std/Test.sol";
import { MooveNFT } from "../contracts/MooveNFT.sol";
import { IMintableNFT } from "../contracts/IMintableNFT.sol";

contract MooveNFTTest is Test {
    MooveNFT public mooveNFT;
    IMintableNFT public iMintableNFT;

    function setUp() public {
        mooveNFT = new MooveNFT("ipfs://bafybeiaepnzx772p5dc2vxbdm6xllkevw6uxu27ncx54cvw2kuloovazcm");
    }

    function testNameAndSymbol() public view {
        assertEq(mooveNFT.name(), "MooveNFT");
        assertEq(mooveNFT.symbol(), "MOOVE");
    }

    function testFailAnauthorizedMinting() public {
        mooveNFT.mint(address(1), 1);
        assertEq(mooveNFT.balanceOf(address(1)), 1);
    }

    function testAddAuthorizedMinter() public {
        mooveNFT.addAuthorizedMinter(address(1));
        assertEq(mooveNFT.checkIfAuthorizedMinter(address(1)), true);

        vm.prank(address(1));
        mooveNFT.mint(address(1), 1);
        assertEq(mooveNFT.balanceOf(address(1)), 1);
    }
}