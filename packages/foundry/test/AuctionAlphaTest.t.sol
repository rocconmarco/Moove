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

    address public USER1 = makeAddr("user1");
    address public USER2 = makeAddr("user2");
    address public forwarderAddress = makeAddr("forwarder");

    function setUp() public {
        mooveNFT = new MooveNFT("ipfs://bafybeiaepnzx772p5dc2vxbdm6xllkevw6uxu27ncx54cvw2kuloovazcm");
        auctionAlpha = new AuctionAlpha(address(mooveNFT));

        auctionAlpha.setForwarderAddress(forwarderAddress);
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
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 currentAuctionId = auctionAlpha.s_currentAuctionId();
        assertEq(currentAuctionId, 1);

        AuctionAlpha.Auction memory auction = auctionAlpha.getAuctionById(currentAuctionId - 1);
        uint256 expectedOpeningTimestamp = block.timestamp;
        uint256 expectedClosingTimestamp = block.timestamp + 30 days;
        
        assertEq(auction.auctionId, 1);
        assertEq(auction.nftId, 1);
        assertEq(auction.openingTimestamp, expectedOpeningTimestamp);
        assertEq(auction.closingTimestamp, expectedClosingTimestamp);
        assertEq(auction.isOpen, true);
        assertEq(auction.winner, address(0));
    }

    function testShouldNotLetStartingNewAuctionWhenAlreadyOpened() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        vm.expectRevert(AuctionAlpha.AuctionAlpha__AuctionAlreadyOpened.selector);
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();
    }

    function testFailWhenNonForwarderStartsAuction() public {
        vm.prank(USER1);
        auctionAlpha.startAuction();
    }

    function testPlaceBid() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 initialBalance = 10000000000000000000;
        uint256 user1Bid = 2000000000000000000;

        // Giving the user 10ETH and bidding 2ETH for the current auction
        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: user1Bid}();

        uint256 currentAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Bid[] memory listOfBids = auctionAlpha.getListOfBids(currentAuctionId);

        assertEq(auctionAlpha.s_currentHighestBid(), user1Bid);
        assertEq(listOfBids.length, 1);
        assertEq(listOfBids[0].bidder, address(USER1));
        assertEq(listOfBids[0].amount, user1Bid);
        assertEq(listOfBids[0].timestamp, block.timestamp);
    }

    function testMultipleBidsFromTheSameUser() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 initialBalance = 10000000000000000000;
        uint256 user1Bid = 2000000000000000000;

        // Giving the user 10ETH and bidding 2ETH for the current auction
        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: user1Bid}();

        // Trying to send the same bid twice
        hoax(USER1, initialBalance);
        vm.expectRevert(AuctionAlpha.AuctionAlpha__SenderIsAlreadyTheCurrentWinner.selector);
        auctionAlpha.placeBid{value: user1Bid}();
    }

    function testMultipleBidsFromDifferentUsers() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 initialBalance = 10000000000000000000;
        uint256 user1Bid = 2000000000000000000;
        uint256 user2Bid = 2500000000000000000;

        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: user1Bid}();

        hoax(USER2, initialBalance);
        auctionAlpha.placeBid{value: user2Bid}();

        uint256 currentAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Bid[] memory listOfBids = auctionAlpha.getListOfBids(currentAuctionId);

        assertEq(auctionAlpha.s_currentHighestBid(), user2Bid);
        assertEq(auctionAlpha.s_currentWinner(), address(USER2));
        assertEq(listOfBids.length, 2);
        assertEq(listOfBids[0].bidder, address(USER1));
        assertEq(listOfBids[1].bidder, address(USER2));
        assertEq(listOfBids[0].amount, user1Bid);
        assertEq(listOfBids[1].amount, user2Bid);
        assertEq(listOfBids[0].timestamp, block.timestamp);
        assertEq(listOfBids[1].timestamp, block.timestamp);
    }

    function testWithdrawableAmountCorrectlySetAfterBeingOutbidded() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 initialBalance = 10000000000000000000;
        uint256 user1Bid = 2000000000000000000;
        uint256 user2Bid = 2500000000000000000;

        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: user1Bid}();

        hoax(USER2, initialBalance);
        auctionAlpha.placeBid{value: user2Bid}();

        uint256 withdrawableAmountForUser1 = auctionAlpha.getWithdrawableAmountByBidderAddress(address(USER1));

        assertEq(withdrawableAmountForUser1, user1Bid);
    }

    function testWithdrawBid() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

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
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

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
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 initialBalance = 10000000000000000000;
        uint256 user1FirstBid = 2000000000000000000;
        uint256 user1SecondBid = 1000000000000000000;
        uint256 user2Bid = 2500000000000000000;

        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: user1FirstBid}();

        hoax(USER2, initialBalance);
        auctionAlpha.placeBid{value: user2Bid}();

        uint256 withdrawableAmountUser1 = auctionAlpha.getWithdrawableAmountByBidderAddress(address(USER1));

        vm.prank(USER1);
        auctionAlpha.placeBid{value: user1SecondBid}();

        assertEq(auctionAlpha.s_currentHighestBid(), withdrawableAmountUser1 + user1SecondBid);
        assertEq(auctionAlpha.getWithdrawableAmountByBidderAddress(address(USER1)), 0);
    }

    function testShouldNotAllowToCloseAuctionBeforeTime() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        vm.expectRevert(AuctionAlpha.AuctionAlpha__AuctionStillOngoing.selector);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();
    }

    function testCloseAuction() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();
        // This line is necessary to allow the AuctionAlpha contract to mint the NFT to the auction's winner
        mooveNFT.addAuthorizedMinter(address(auctionAlpha));

        uint256 initialBalance = 10000000000000000000;
        uint256 user1Bid = 2000000000000000000;

        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: user1Bid}();

        uint256 currentAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory auctionBeforeClosing = auctionAlpha.getAuctionById(currentAuctionId - 1);

        vm.warp(auctionBeforeClosing.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        AuctionAlpha.Auction memory auctionAfterClosing = auctionAlpha.getAuctionById(currentAuctionId - 1);

        assertEq(auctionAfterClosing.isOpen, false);
        assertEq(mooveNFT.balanceOf(address(USER1)), 1);
    }

    function testCloseAuctionWithoutWinner() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 currentAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory auctionBeforeClosing = auctionAlpha.getAuctionById(currentAuctionId - 1);

        vm.warp(auctionBeforeClosing.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        AuctionAlpha.Auction memory auctionAfterClosing = auctionAlpha.getAuctionById(currentAuctionId - 1);
        uint256 unsoldNFTPrice = auctionAlpha.getUnsoldNFTPrice(auctionAfterClosing.nftId);
        uint256 unsoldNFTArrayIndex = auctionAlpha.getArrayIndexOfUnsoldNFT(auctionAfterClosing.nftId);
        bool unsoldNFTIsListed = auctionAlpha.getIsTokenListed(auctionAfterClosing.nftId);


        assertEq(auctionAfterClosing.isOpen, false);
        assertEq(unsoldNFTPrice, auctionAfterClosing.startingPrice);
        assertEq(unsoldNFTArrayIndex, 0);
        assertEq(unsoldNFTIsListed, true);
    }

    function testBuyUnsoldNFT() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();
        mooveNFT.addAuthorizedMinter(address(auctionAlpha));

        uint256 currentAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory auctionBeforeClosing = auctionAlpha.getAuctionById(currentAuctionId - 1);

        vm.warp(auctionBeforeClosing.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        uint256 initialBalance = 10000000000000000000;
        uint256 tokenPrice = auctionAlpha.s_startingPrice();

        hoax(USER1, initialBalance);
        auctionAlpha.buyUnsoldNFT{value: tokenPrice}(1);

        assertEq(mooveNFT.balanceOf(address(USER1)), 1);
    }

    function testShouldNotAllowToPurchaseUnsoldNFTWhenSendingIncorrectAmount() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();
        mooveNFT.addAuthorizedMinter(address(auctionAlpha));

        uint256 currentAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory auctionBeforeClosing = auctionAlpha.getAuctionById(currentAuctionId - 1);

        vm.warp(auctionBeforeClosing.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        uint256 initialBalance = 10000000000000000000;
        uint256 tokenPrice = auctionAlpha.s_startingPrice();

        hoax(USER1, initialBalance);
        vm.expectRevert(AuctionAlpha.AuctionAlpha__IncorrectPayment.selector);
        auctionAlpha.buyUnsoldNFT{value: tokenPrice + 1}(1);
    }

    function testShouldNotAllowToPurchaseNonListedUnsoldNFT() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();
        mooveNFT.addAuthorizedMinter(address(auctionAlpha));

        uint256 currentAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory auctionBeforeClosing = auctionAlpha.getAuctionById(currentAuctionId - 1);

        vm.warp(auctionBeforeClosing.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        uint256 initialBalance = 10000000000000000000;
        uint256 tokenPrice = auctionAlpha.s_startingPrice();

        hoax(USER1, initialBalance);
        vm.expectRevert(AuctionAlpha.AuctionAlpha__TokenNotAvailable.selector);
        auctionAlpha.buyUnsoldNFT{value: tokenPrice}(2);
    }

    function testShouldCorrectlyRemoveSoldNFT() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();
        mooveNFT.addAuthorizedMinter(address(auctionAlpha));

        uint256 currentAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory auctionBeforeClosing = auctionAlpha.getAuctionById(currentAuctionId - 1);

        vm.warp(auctionBeforeClosing.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        uint256 initialBalance = 10000000000000000000;
        uint256 tokenPrice = auctionAlpha.s_startingPrice();

        hoax(USER1, initialBalance);
        auctionAlpha.buyUnsoldNFT{value: tokenPrice}(1);

        AuctionAlpha.Auction memory auctionAfterClosing = auctionAlpha.getAuctionById(currentAuctionId - 1);
        bool unsoldNFTIsListed = auctionAlpha.getIsTokenListed(auctionAfterClosing.nftId);

        assertEq(unsoldNFTIsListed, false);
        assertEq(auctionAlpha.getUnsoldNFTsArrayLength(), 0);
    }

    function testMultipleUnsoldNFTs() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();
        mooveNFT.addAuthorizedMinter(address(auctionAlpha));

        uint256 firstAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory firstAuction = auctionAlpha.getAuctionById(firstAuctionId - 1);

        vm.warp(firstAuction.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 secondAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory secondAuction = auctionAlpha.getAuctionById(secondAuctionId - 1);

        vm.warp(secondAuction.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        assertEq(auctionAlpha.getUnsoldNFTsArrayLength(), 2);
    }

    function testBuyingMultipleUnsoldNFTs() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();
        mooveNFT.addAuthorizedMinter(address(auctionAlpha));

        uint256 firstAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory firstAuction = auctionAlpha.getAuctionById(firstAuctionId - 1);

        vm.warp(firstAuction.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 secondAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory secondAuction = auctionAlpha.getAuctionById(secondAuctionId - 1);

        vm.warp(secondAuction.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        uint256 initialBalance = 10000000000000000000;
        uint256 tokenPrice = auctionAlpha.s_startingPrice();

        hoax(USER1, initialBalance);
        auctionAlpha.buyUnsoldNFT{value: tokenPrice}(1);

        vm.prank(USER1);
        auctionAlpha.buyUnsoldNFT{value: tokenPrice}(2);

        assertEq(mooveNFT.balanceOf(address(USER1)), 2);
        assertEq(auctionAlpha.getUnsoldNFTsArrayLength(), 0);
    }

    function testBuyingAlreadySoldUnsoldNFTs() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();
        mooveNFT.addAuthorizedMinter(address(auctionAlpha));

        uint256 firstAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory firstAuction = auctionAlpha.getAuctionById(firstAuctionId - 1);

        vm.warp(firstAuction.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 secondAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory secondAuction = auctionAlpha.getAuctionById(secondAuctionId - 1);

        vm.warp(secondAuction.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        uint256 initialBalance = 10000000000000000000;
        uint256 tokenPrice = auctionAlpha.s_startingPrice();

        hoax(USER1, initialBalance);
        auctionAlpha.buyUnsoldNFT{value: tokenPrice}(1);

        vm.expectRevert(AuctionAlpha.AuctionAlpha__TokenNotAvailable.selector);
        vm.prank(USER1);
        auctionAlpha.buyUnsoldNFT{value: tokenPrice}(1);
    }

    /**
     * This test is a combination between testCloseAuction from AuctionAlphaTest and 
     * testUpdateOwnedNFTArrayWhenTransferring from MooveNFTTest. It is aimed at checking
     * the correct update of s_ownedNFTsByUser, a mapping that keeps track of the NFT ownership
     * when minting a new NFT and when transferring the token between users
     */
    function testMappingUpdateWhenTransferringToken() public {
        // The first part is the same as testCloseAuction
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        mooveNFT.addAuthorizedMinter(address(auctionAlpha));

        uint256 initialBalance = 10000000000000000000;
        uint256 user1Bid = 2000000000000000000;

        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: user1Bid}();

        uint256 currentAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory auctionBeforeClosing = auctionAlpha.getAuctionById(currentAuctionId - 1);

        vm.warp(auctionBeforeClosing.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        AuctionAlpha.Auction memory auctionAfterClosing = auctionAlpha.getAuctionById(currentAuctionId - 1);

        assertEq(auctionAfterClosing.isOpen, false);
        assertEq(mooveNFT.balanceOf(address(USER1)), 1);
        // End of the testCloseAuction part

        // The following part is the same as testUpdateOwnedNFTArrayWhenTransferring
        uint256[] memory user1OwnedNFTsArrayBeforeTransfer = mooveNFT.getOwnedNFTsArray(USER1);
        uint256[] memory user2OwnedNFTsArrayBeforeTransfer = mooveNFT.getOwnedNFTsArray(USER2);

        assertEq(user2OwnedNFTsArrayBeforeTransfer.length, 0);
        assertEq(user1OwnedNFTsArrayBeforeTransfer.length, 1);
        assertEq(user1OwnedNFTsArrayBeforeTransfer[0], 1);

        assertEq(mooveNFT.balanceOf(USER1), 1);
        assertEq(mooveNFT.balanceOf(USER2), 0);

        vm.prank(USER1);
        mooveNFT.safeTransferFrom(USER1, USER2, 1);
        
        uint256[] memory user1OwnedNFTsArrayAfterTransfer = mooveNFT.getOwnedNFTsArray(USER1);
        uint256[] memory user2OwnedNFTsArrayAfterTransfer = mooveNFT.getOwnedNFTsArray(USER2);

        assertEq(user1OwnedNFTsArrayAfterTransfer.length, 0);
        assertEq(user2OwnedNFTsArrayAfterTransfer.length, 1);
        assertEq(user2OwnedNFTsArrayAfterTransfer[0], 1);
        // End of the testUpdateOwnedNFTArrayWhenTransferring part

        assertEq(mooveNFT.balanceOf(USER1), 0);
        assertEq(mooveNFT.balanceOf(USER2), 1);
    }
}