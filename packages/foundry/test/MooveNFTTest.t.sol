// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { Test } from "forge-std/Test.sol";
import { MooveNFT } from "../contracts/MooveNFT.sol";
import { IMintableNFT } from "../contracts/IMintableNFT.sol";

contract MooveNFTTest is Test {
    MooveNFT public mooveNFT;
    IMintableNFT public iMintableNFT;

    address public constant USER1 = address(1);
    address public constant USER2 = address(2);

    function setUp() public {
        mooveNFT = new MooveNFT("ipfs://bafybeiaepnzx772p5dc2vxbdm6xllkevw6uxu27ncx54cvw2kuloovazcm");
    }

    function testNameAndSymbol() public view {
        assertEq(mooveNFT.name(), "MooveNFT");
        assertEq(mooveNFT.symbol(), "MOOVE");
    }

    function testFailAnauthorizedMinting() public {
        mooveNFT.mint(USER1, 1);
        assertEq(mooveNFT.balanceOf(USER1), 1);
    }

    function testAddAuthorizedMinter() public {
        mooveNFT.addAuthorizedMinter(USER1);
        assertEq(mooveNFT.checkIfAuthorizedMinter(USER1), true);

        vm.prank(USER1);
        mooveNFT.mint(USER1, 1);
        assertEq(mooveNFT.balanceOf(USER1), 1);
    }

    function testTokenCounter() public {
        mooveNFT.addAuthorizedMinter(USER1);
        assertEq(mooveNFT.checkIfAuthorizedMinter(USER1), true);

        vm.prank(USER1);
        mooveNFT.mint(USER1, 1);
        assertEq(mooveNFT.s_tokenCounter(), 1);
    }

    function testTokenURI() public view {
        string memory tokenURI = mooveNFT.tokenURI(1);
        assertEq(tokenURI, "ipfs://bafybeiaepnzx772p5dc2vxbdm6xllkevw6uxu27ncx54cvw2kuloovazcm/1.json");
    }

    function testFailWhenMintingNonExistingToken() public {
        mooveNFT.addAuthorizedMinter(USER1);
        assertEq(mooveNFT.checkIfAuthorizedMinter(USER1), true);

        vm.prank(USER1);
        mooveNFT.mint(USER1, 14);
    }

    function testFailWhenMintingTokenId0() public {
        mooveNFT.addAuthorizedMinter(USER1);
        assertEq(mooveNFT.checkIfAuthorizedMinter(USER1), true);

        vm.prank(USER1);
        mooveNFT.mint(USER1, 0);
    }

    function testShouldFailWhenAuthorizingTheZeroAddress() public {
        vm.expectRevert(MooveNFT.MooveNFT__NotAValidAddress.selector);
        mooveNFT.addAuthorizedMinter(address(0));
    }

    function testRemoveAuthorizedMinter() public {
        mooveNFT.addAuthorizedMinter(USER1);
        assertEq(mooveNFT.checkIfAuthorizedMinter(USER1), true);

        vm.prank(USER1);
        mooveNFT.mint(USER1, 1);
        assertEq(mooveNFT.balanceOf(USER1), 1);

        mooveNFT.removeAuthorizedMinter(USER1);
        assertEq(mooveNFT.checkIfAuthorizedMinter(USER1), false);

        vm.prank(USER1);
        vm.expectRevert(MooveNFT.MooveNFT__MintingNotAuthorized.selector);
        mooveNFT.mint(USER1, 2);
    }

    function testFailWhenMintingAlreadyMintedToken() public {
        mooveNFT.addAuthorizedMinter(USER1);

        vm.prank(USER1);
        mooveNFT.mint(USER1, 1);

        vm.prank(USER1);
        mooveNFT.mint(USER1, 1);
    }

    function testFailWhenMintingAlreadyMintedTokenToDifferentUser() public {
        mooveNFT.addAuthorizedMinter(USER1);
        mooveNFT.addAuthorizedMinter(USER2);

        vm.prank(USER1);
        mooveNFT.mint(USER1, 1);

        vm.prank(USER2);
        mooveNFT.mint(USER2, 1);
    }

    function testMintingDifferentTokensToDifferentUsers() public {
        mooveNFT.addAuthorizedMinter(USER1);
        mooveNFT.addAuthorizedMinter(USER2);

        vm.prank(USER1);
        mooveNFT.mint(USER1, 1);

        vm.prank(USER2);
        mooveNFT.mint(USER2, 2);

        assertEq(mooveNFT.s_tokenCounter(), 2);
        assertEq(mooveNFT.balanceOf(USER1), 1);
        assertEq(mooveNFT.balanceOf(USER2), 1);
    }

    function testSafeMint() public {
        mooveNFT.addAuthorizedMinter(USER1);
        mooveNFT.addAuthorizedMinter(USER2);

        vm.prank(USER1);
        mooveNFT.safeMint(USER1, 1);

        vm.prank(USER2);
        mooveNFT.safeMint(USER2, 2);

        assertEq(mooveNFT.s_tokenCounter(), 2);
        assertEq(mooveNFT.balanceOf(USER1), 1);
        assertEq(mooveNFT.balanceOf(USER2), 1);
    }
}