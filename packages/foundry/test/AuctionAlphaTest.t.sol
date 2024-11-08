// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { Test } from "forge-std/Test.sol";
import { console } from "forge-std/console.sol";
import { AuctionAlpha } from "../contracts/AuctionAlpha.sol";
import { IAuctionAlpha } from "../contracts/IAuctionAlpha.sol";
import { MooveNFT } from "../contracts/MooveNFT.sol";
import { IMintableNFT } from "../contracts/IMintableNFT.sol";

contract AuctionAlphaTest is Test {
    AuctionAlpha public auctionAlpha;
    IAuctionAlpha public iAuctionAlpha;
    MooveNFT public mooveNFT;
    IMintableNFT public iMintableNFT;

    address public constant USER1 = address(1);
    address public constant USER2 = address(2);


    function setUp() public {
        mooveNFT = new MooveNFT("ipfs://bafybeiaepnzx772p5dc2vxbdm6xllkevw6uxu27ncx54cvw2kuloovazcm");
        auctionAlpha = new AuctionAlpha(address(mooveNFT));
    }

    function testVariableInizialization() public view {
        assertEq(auctionAlpha.s_currentAuctionId(), 0);
        assertEq(auctionAlpha.s_currentHighestBid(), 0);
        assertEq(auctionAlpha.s_currentNftId(), 0);
        assertEq(auctionAlpha.s_currentWinner(), address(0));
    }

    function testShouldNotAllowToPlaceBidWhenAuctionStillNotInizialized() public {
        vm.prank(USER1);
        vm.expectRevert(AuctionAlpha.AuctionAlpha__AuctionProcessStillNotInizialized.selector);
        auctionAlpha.placeBid();
    }

    function testShouldRevertIfAmountToWithdrawEqualsZero() public {
        vm.prank(USER1);
        vm.expectRevert(AuctionAlpha.AuctionAlpha__WithdrawAmountMustBeGreaterThanZero.selector);
        auctionAlpha.withdrawBid(0);
    }

    function testShouldNotAllowToWitdrawIfNoAmountToWithdraw() public {
        vm.prank(USER1);
        vm.expectRevert(AuctionAlpha.AuctionAlpha__NoAmountToWithdraw.selector);
        auctionAlpha.withdrawBid(1);
    }

    function testStartAuction() public {
        // Setting the starting price at 1ETH, and the minimum bid increment at 0.5ETH
        auctionAlpha.startAuction(1000000000000000000, 500000000000000000);

        uint256 currentAuctionId = auctionAlpha.s_currentAuctionId();
        assertEq(currentAuctionId, 1);

        AuctionAlpha.Auction memory auction = auctionAlpha.getAuctionById(currentAuctionId - 1);
        uint256 expectedOpeningTimestamp = block.timestamp;
        uint256 expectedClosingTimestamp = block.timestamp + 30 days;
        
        assertEq(auction.auctionId, 1);
        assertEq(auction.nftId, 1);
        assertEq(auction.openingTimestamp, expectedOpeningTimestamp);
        assertEq(auction.closingTimestamp, expectedClosingTimestamp);
        assertEq(auction.startingPrice, 1000000000000000000);
        assertEq(auction.minimumBidIncrement, 500000000000000000);
        assertEq(auction.isOpen, true);
        assertEq(auction.winner, address(0));
    }

    function testShouldNotLetStartingNewAuctionWhenAlreadyOpened() public {
        auctionAlpha.startAuction(1000000000000000000, 500000000000000000);

        vm.expectRevert(AuctionAlpha.AuctionAlpha__AuctionAlreadyOpened.selector);
        auctionAlpha.startAuction(1000000000000000000, 500000000000000000);
    }

    function testFailWhenNonOwnerStartsAuction() public {
        vm.prank(USER1);
        auctionAlpha.startAuction(1000000000000000000, 500000000000000000);
    }

    function testPlaceBid() public {
        auctionAlpha.startAuction(1000000000000000000, 500000000000000000);

        // Giving the user 10ETH and bidding 2ETH for the current auction
        hoax(USER1, 10000000000000000000);
        auctionAlpha.placeBid{value: 2000000000000000000}();

        assertEq(auctionAlpha.s_currentHighestBid(), 2000000000000000000);
    }

    function testMultipleBidsFromTheSameUser() public {
        auctionAlpha.startAuction(1000000000000000000, 500000000000000000);

        // Giving the user 10ETH and bidding 2ETH for the current auction
        hoax(USER1, 10000000000000000000);
        auctionAlpha.placeBid{value: 2000000000000000000}();

        // Trying to send the same bid twice
        hoax(USER1, 10000000000000000000);
        vm.expectRevert(AuctionAlpha.AuctionAlpha__SenderIsAlreadyTheCurrentWinner.selector);
        auctionAlpha.placeBid{value: 2000000000000000000}();
    }

    function testMultipleBidsFromDifferentUsers() public {
        auctionAlpha.startAuction(1000000000000000000, 500000000000000000);

        hoax(USER1, 10000000000000000000);
        auctionAlpha.placeBid{value: 2000000000000000000}();

        hoax(USER2, 10000000000000000000);
        auctionAlpha.placeBid{value: 2500000000000000000}();

        assertEq(auctionAlpha.s_currentHighestBid(), 2500000000000000000);
        assertEq(auctionAlpha.s_currentWinner(), address(USER2));
    }

    function testWithdrawableAmountCorrectlySetAfterBeingOutbidded() public {
        auctionAlpha.startAuction(1000000000000000000, 500000000000000000);

        hoax(USER1, 10000000000000000000);
        auctionAlpha.placeBid{value: 2000000000000000000}();

        hoax(USER2, 10000000000000000000);
        auctionAlpha.placeBid{value: 2500000000000000000}();

        uint256 withdrawableAmountForUser1 = auctionAlpha.getWithdrawableAmountByBidderAddress(address(USER1));

        assertEq(withdrawableAmountForUser1, 2000000000000000000);
    }

    function testWithdrawBid() public {
        auctionAlpha.startAuction(1000000000000000000, 500000000000000000);

        uint256 initialBalance = 10000000000000000000;
        uint256 user1Bid = 2000000000000000000;
        uint256 user2Bid = 2500000000000000000;

        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: user1Bid}();

        assertEq(address(USER1).balance, initialBalance - user1Bid);

        hoax(USER2, initialBalance);
        auctionAlpha.placeBid{value: user2Bid}();

        assertEq(address(USER2).balance, initialBalance - user2Bid);

        vm.prank(USER1);
        auctionAlpha.withdrawBid(user1Bid);

        assertEq(address(USER1).balance, initialBalance);

        uint256 withdrawableAmountForUser1 = auctionAlpha.getWithdrawableAmountByBidderAddress(address(USER1));

        assertEq(withdrawableAmountForUser1, 0);
    }

    function testShouldNotAllowToWithdrawAmountHigherThanWithdrawableAmount() public {
        auctionAlpha.startAuction(1000000000000000000, 500000000000000000);

        uint256 initialBalance = 10000000000000000000;
        uint256 user1Bid = 2000000000000000000;
        uint256 user2Bid = 2500000000000000000;

        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: user1Bid}();

        assertEq(address(USER1).balance, initialBalance - user1Bid);

        hoax(USER2, initialBalance);
        auctionAlpha.placeBid{value: user2Bid}();

        assertEq(address(USER2).balance, initialBalance - user2Bid);

        vm.prank(USER1);
        vm.expectRevert(AuctionAlpha.AuctionAlpha__WithdrawAmountExceedsWithdrawableAmount.selector);
        auctionAlpha.withdrawBid(user1Bid + 1);
    }

    function testSecondBidFromTheSameUser() public {
        auctionAlpha.startAuction(1000000000000000000, 500000000000000000);

        hoax(USER1, 10000000000000000000);
        auctionAlpha.placeBid{value: 2000000000000000000}();

        hoax(USER2, 10000000000000000000);
        auctionAlpha.placeBid{value: 2500000000000000000}();

        vm.prank(USER1);
        auctionAlpha.placeBid{value: 1000000000000000000}();

        assertEq(auctionAlpha.s_currentHighestBid(), 3000000000000000000);
        assertEq(auctionAlpha.getWithdrawableAmountByBidderAddress(address(USER1)), 0);
    }

    function testShouldNotAllowToCloseAuctionBeforeTime() public {
        auctionAlpha.startAuction(1000000000000000000, 500000000000000000);

        vm.expectRevert(AuctionAlpha.AuctionAlpha__AuctionStillOngoing.selector);
        auctionAlpha.closeAuction();
    }

    function testCloseAuction() public {
        auctionAlpha.startAuction(1000000000000000000, 500000000000000000);

        hoax(USER1, 10000000000000000000);
        auctionAlpha.placeBid{value: 2000000000000000000}();

        uint256 currentAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory auctionBeforeClosing = auctionAlpha.getAuctionById(currentAuctionId - 1);

        vm.warp(auctionBeforeClosing.openingTimestamp + 30 days);
        auctionAlpha.closeAuction();

        AuctionAlpha.Auction memory auctionAfterClosing = auctionAlpha.getAuctionById(currentAuctionId - 1);

        assertEq(auctionAfterClosing.isOpen, false);
        assertEq(mooveNFT.balanceOf(address(USER1)), 1);
    }

    function testCloseAuctionWithoutWinner() public {
        auctionAlpha.startAuction(1000000000000000000, 500000000000000000);

        uint256 currentAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory auctionBeforeClosing = auctionAlpha.getAuctionById(currentAuctionId - 1);

        vm.warp(auctionBeforeClosing.openingTimestamp + 30 days);
        auctionAlpha.closeAuction();

        AuctionAlpha.Auction memory auctionAfterClosing = auctionAlpha.getAuctionById(currentAuctionId - 1);
        AuctionAlpha.UnsoldNFT memory unsoldNFT = auctionAlpha.getUnsoldNFT(0);

        assertEq(auctionAfterClosing.isOpen, false);
        assertEq(unsoldNFT.nftId, 1);
        assertEq(unsoldNFT.sellingPrice, auctionAfterClosing.startingPrice);
    }
}