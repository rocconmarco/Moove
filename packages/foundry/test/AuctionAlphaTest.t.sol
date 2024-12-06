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

    //////////////////////////////////////////////////
    //////////// INIZIALIZATION SECTION //////////////
    //////////////////////////////////////////////////

    function testVariableInizialization() public view {
        assertEq(auctionAlpha.s_currentAuctionId(), 0);
        assertEq(auctionAlpha.s_currentHighestBid(), 0);
        assertEq(auctionAlpha.s_currentNftId(), 0);
        assertEq(auctionAlpha.s_currentWinner(), address(0));
    }

    ////////////////////////////////////////////////////
    //////////// START AUCTION SECTION /////////////////
    ////////////////////////////////////////////////////

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

    ///////////////////////////////////////////////
    ///////////// PLACE BID SECTION ///////////////
    ///////////////////////////////////////////////

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

    function testShouldNotAllowToPlaceBidWhenAuctionStillNotInizialized() public {
        vm.prank(USER1);
        vm.expectRevert(AuctionAlpha.AuctionAlpha__AuctionProcessStillNotInizialized.selector);
        auctionAlpha.placeBid();
    }

    function testShouldNotAllowToPlaceBidWithZeroEth() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 initialBalance = 10000000000000000000;

        vm.expectRevert(AuctionAlpha.AuctionAlpha__MustSendEther.selector);
        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: 0}();
    }

    function testShouldNotAllowToPlaceBidWhenAuctionClosed() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 currentAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory currentAuction = auctionAlpha.getAuctionById(currentAuctionId - 1);

        vm.warp(currentAuction.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        uint256 initialBalance = 10000000000000000000;
        uint256 user1Bid = 2000000000000000000;

        vm.expectRevert(AuctionAlpha.AuctionAlpha__AuctionClosed.selector);
        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: user1Bid}();
    }

    function testShouldNotAllowToPlaceBidWithAmountLowerThanCurrentHighestBid() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 initialBalance = 10000000000000000000;
        uint256 currentHighestBid = auctionAlpha.s_currentHighestBid();

        vm.expectRevert(AuctionAlpha.AuctionAlpha__BidAmountMustBeHigherThanCurrentHighestBid.selector);
        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: currentHighestBid - 1}();
    }

    function testShouldNotAllowToPlaceBidWithIncorrectIncrement() public {
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 initialBalance = 10000000000000000000;
        uint256 currentHighestBid = auctionAlpha.s_currentHighestBid();

        vm.expectRevert(AuctionAlpha.AuctionAlpha__BidAmountIncrementLessThanMinimumBidIncrement.selector);
        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: currentHighestBid + 1}();
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

    function testPlaceBidNonPayable() public {
        // Open the first auction
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        mooveNFT.addAuthorizedMinter(address(auctionAlpha));

        // First auction list of bids
        uint256 initialBalance = 10000000000000000000;
        uint256 user1FirstBid = 2000000000000000000;
        uint256 user1SecondBid = 1000000000000000000;
        uint256 user2Bid = 2500000000000000000;

        // A series of bids that sees USER1 as the winner, with a total expense of 3ETH
        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: user1FirstBid}();

        hoax(USER2, initialBalance);
        auctionAlpha.placeBid{value: user2Bid}();

        vm.prank(USER1);
        auctionAlpha.placeBid{value: user1SecondBid}();

        uint256 firstAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory firstAuction = auctionAlpha.getAuctionById(firstAuctionId - 1);

        vm.warp(firstAuction.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        // USER1 received its NFT, USER2 has a withdrawable balance of 2.5ETH

        uint256 withdrawableAmountForUSER2EndFirstAuction = auctionAlpha.getWithdrawableAmountByBidderAddress(USER2);

        // The second auction is inizialized
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        // Second auction's bid from USER2
        // The amount should be lower than the withdrawable amount for USER2
        uint256 secondAuctionBidFromUSER2 = 2000000000000000000;

        vm.prank(USER2);
        auctionAlpha.placeBidNonPayable(secondAuctionBidFromUSER2);

        assertEq(auctionAlpha.s_currentHighestBid(), secondAuctionBidFromUSER2);
        assertEq(auctionAlpha.getWithdrawableAmountByBidderAddress(USER2), withdrawableAmountForUSER2EndFirstAuction - secondAuctionBidFromUSER2);
        assertEq(auctionAlpha.s_currentWinner(), USER2);
    }

    function testShouldNotAllowToCallPayablePlaceBidFunctionWhenSufficientOnPlatformBalance() public {
        // Open the first auction
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        mooveNFT.addAuthorizedMinter(address(auctionAlpha));

        // First auction list of bids
        uint256 initialBalance = 10000000000000000000;
        uint256 user1FirstBid = 2000000000000000000;
        uint256 user1SecondBid = 1000000000000000000;
        uint256 user2Bid = 2500000000000000000;

        // A series of bids that sees USER1 as the winner, with a total expense of 3ETH
        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: user1FirstBid}();

        hoax(USER2, initialBalance);
        auctionAlpha.placeBid{value: user2Bid}();

        vm.prank(USER1);
        auctionAlpha.placeBid{value: user1SecondBid}();

        uint256 firstAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory firstAuction = auctionAlpha.getAuctionById(firstAuctionId - 1);

        vm.warp(firstAuction.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        // USER1 received its NFT, USER2 has a withdrawable balance of 2.5ETH

        // The second auction is inizialized
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        // Second auction's bid from USER2
        // The amount should be lower than the withdrawable amount for USER2
        uint256 secondAuctionBidFromUSER2 = 2000000000000000000;

        // The user will try to call the payable placeBid function
        // It should revert, since USER2 has sufficient funds to place the bid
        // without having to send any ETH
        vm.expectRevert(AuctionAlpha.AuctionAlpha__NoNeedToSendEth.selector);
        vm.prank(USER2);
        auctionAlpha.placeBid{value: secondAuctionBidFromUSER2}();
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

    ///////////////////////////////////////////////
    //////////// WITHDRAW BID SECTION /////////////
    ///////////////////////////////////////////////

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

    ////////////////////////////////////////////////
    //////////// CLOSE AUCTION SECTION /////////////
    ////////////////////////////////////////////////

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

    ///////////////////////////////////////////////
    ///////// BUY UNSOLD NFT SECTION //////////////
    ///////////////////////////////////////////////

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

    function testBuyUnsoldNFTWithOnPlatformBalance() public {
        // Open the first auction
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        mooveNFT.addAuthorizedMinter(address(auctionAlpha));

        uint256 initialBalance = 10000000000000000000;
        uint256 user1FirstBid = 2000000000000000000;
        uint256 user1SecondBid = 1000000000000000000;
        uint256 user2Bid = 2500000000000000000;

        // A series of bids that sees USER1 as the winner, with a total expense of 3ETH
        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: user1FirstBid}();

        hoax(USER2, initialBalance);
        auctionAlpha.placeBid{value: user2Bid}();

        vm.prank(USER1);
        auctionAlpha.placeBid{value: user1SecondBid}();

        uint256 firstAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory firstAuction = auctionAlpha.getAuctionById(firstAuctionId - 1);

        vm.warp(firstAuction.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        // USER1 received its NFT, USER2 has a withdrawable balance of 2.5ETH

        uint256 withdrawableAmountForUSER2 = auctionAlpha.getWithdrawableAmountByBidderAddress(USER2);

        // The second auction is inizialized
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 secondAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory secondAuction = auctionAlpha.getAuctionById(secondAuctionId - 1);

        vm.warp(secondAuction.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        // The auction has closed with zero bids
        // USER2 wants to buy the unsold NFT with its on platform balance

        uint256 unsoldNFTPrice = auctionAlpha.getUnsoldNFTPrice(2);

        vm.prank(USER2);
        auctionAlpha.buyUnsoldNFTNonPayable(2);

        assertEq(mooveNFT.balanceOf(address(USER2)), 1);
        assertEq(auctionAlpha.getWithdrawableAmountByBidderAddress(USER2), withdrawableAmountForUSER2 - unsoldNFTPrice);
    }

    function testFailWhenBuyUnsoldNFTWithOnPlatformBalanceAndOnPlatformBalanceEqualsZero() public {
        // Open the first auction
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        mooveNFT.addAuthorizedMinter(address(auctionAlpha));

        uint256 initialBalance = 10000000000000000000;
        uint256 user1Bid = 2000000000000000000;
        uint256 user2Bid = 2500000000000000000;

        // Two consecutive bids that sees USER2 as the winner, with a total expense of 2.5ETH
        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: user1Bid}();

        hoax(USER2, initialBalance);
        auctionAlpha.placeBid{value: user2Bid}();

        uint256 firstAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory firstAuction = auctionAlpha.getAuctionById(firstAuctionId - 1);

        vm.warp(firstAuction.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        // USER2 received its NFT, USER1 has a withdrawable balance of 2ETH

        // The second auction is inizialized
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 secondAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory secondAuction = auctionAlpha.getAuctionById(secondAuctionId - 1);

        vm.warp(secondAuction.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        // The auction has closed with zero bids
        // USER2 wants to buy the unsold NFT with its on platform balance
        // This is a mistake, since USER2 has no on platform balance
        // The transaction should revert

        vm.prank(USER2);
        auctionAlpha.buyUnsoldNFTNonPayable(2);
    }

    function testBuyUnsoldNFTWithBothOnPlatformBalanceAndSendingETH() public {
        // Open the first auction
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        mooveNFT.addAuthorizedMinter(address(auctionAlpha));

        uint256 initialBalance = 10000000000000000000;
        uint256 user1FirstBid = 2000000000000000000;
        uint256 user1SecondBid = 1000000000000000000;
        uint256 user2Bid = 2500000000000000000;

        // A series of bids that sees USER1 as the winner, with a total expense of 3ETH
        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: user1FirstBid}();

        hoax(USER2, initialBalance);
        auctionAlpha.placeBid{value: user2Bid}();

        vm.prank(USER1);
        auctionAlpha.placeBid{value: user1SecondBid}();

        uint256 firstAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory firstAuction = auctionAlpha.getAuctionById(firstAuctionId - 1);

        vm.warp(firstAuction.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        // USER1 received its NFT, USER2 has a withdrawable balance of 2.5ETH

        uint256 withdrawableAmountForUSER2 = auctionAlpha.getWithdrawableAmountByBidderAddress(USER2);

        // Change starting price to test whether the user is allowed to purchase an unsold NFT
        // with both its on platform balance and sending additional ETH

        auctionAlpha.setStartingPrice(3000000000000000000);

        // The second auction is inizialized
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 secondAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory secondAuction = auctionAlpha.getAuctionById(secondAuctionId - 1);

        vm.warp(secondAuction.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        // The auction has closed with zero bids
        // USER2 wants to buy the unsold NFT with both on platform balance and sending ETH

        uint256 unsoldNFTPrice = auctionAlpha.getUnsoldNFTPrice(2);
        uint256 amountToSend = unsoldNFTPrice - withdrawableAmountForUSER2; 

        vm.prank(USER2);
        auctionAlpha.buyUnsoldNFT{value: amountToSend}(2);

        assertEq(mooveNFT.balanceOf(address(USER2)), 1);
        assertEq(auctionAlpha.getWithdrawableAmountByBidderAddress(USER2), 0);
    }

    function testShouldFailWhenBuyingUnsoldNFTWithPayableFunctionAndHavingEnoughOnPlatformFunds() public {
        // Open the first auction
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        mooveNFT.addAuthorizedMinter(address(auctionAlpha));

        uint256 initialBalance = 10000000000000000000;
        uint256 user1FirstBid = 2000000000000000000;
        uint256 user1SecondBid = 1000000000000000000;
        uint256 user2Bid = 2500000000000000000;

        // A series of bids that sees USER1 as the winner, with a total expense of 3ETH
        hoax(USER1, initialBalance);
        auctionAlpha.placeBid{value: user1FirstBid}();

        hoax(USER2, initialBalance);
        auctionAlpha.placeBid{value: user2Bid}();

        vm.prank(USER1);
        auctionAlpha.placeBid{value: user1SecondBid}();

        uint256 firstAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory firstAuction = auctionAlpha.getAuctionById(firstAuctionId - 1);

        vm.warp(firstAuction.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        // USER1 received its NFT, USER2 has a withdrawable balance of 2.5ETH

        // The second auction is inizialized
        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 secondAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory secondAuction = auctionAlpha.getAuctionById(secondAuctionId - 1);

        vm.warp(secondAuction.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        // The auction has closed with zero bids
        // USER2 wants to buy the unsold NFT calling the payable function even though
        // it has enough on platform funds to complete the purchase
        // This behavior should not be allowed

        vm.expectRevert(AuctionAlpha.AuctionAlpha__NoNeedToSendEth.selector);
        vm.prank(USER2);
        auctionAlpha.buyUnsoldNFT{value: 1000000000000000000}(2);
    }

    function testShouldNotAllowToBuyUnsoldNFTWhenSendingIncorrectAmount() public {
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

    function testShouldNotAllowToBuyNonListedUnsoldNFT() public {
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

    ////////////////////////////////////////////////////
    /////////// SETTER FUNCTIONS SECTION ///////////////
    ////////////////////////////////////////////////////

    function testSetStartingPriceAndSetMinimumBidIncrement() public {
        uint256 defaultStartingPrice = auctionAlpha.s_startingPrice();
        uint256 defaultMinimumBidIncrement = auctionAlpha.s_minimumBidIncrement();

        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();
        mooveNFT.addAuthorizedMinter(address(auctionAlpha));

        uint256 firstAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory firstAuction = auctionAlpha.getAuctionById(firstAuctionId - 1);

        assertEq(firstAuction.startingPrice, defaultStartingPrice);
        assertEq(firstAuction.minimumBidIncrement, defaultMinimumBidIncrement);

        // The owner decides to double both the starting price and the minimum bid increment
        uint256 newStartingPrice = 20000000000000000;
        uint256 newMinimumBidIncrement = 10000000000000000;

        auctionAlpha.setStartingPrice(newStartingPrice);
        auctionAlpha.setMinimumBidIncrement(newMinimumBidIncrement);

        vm.warp(firstAuction.openingTimestamp + 30 days);
        vm.prank(forwarderAddress);
        auctionAlpha.closeAuction();

        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();

        uint256 secondAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory secondAuction = auctionAlpha.getAuctionById(secondAuctionId - 1);

        assertEq(secondAuction.startingPrice, newStartingPrice);
        assertEq(secondAuction.minimumBidIncrement, newMinimumBidIncrement);
    }

    function testFailSetStartingPriceWhenNotOwner() public {
        uint256 defaultStartingPrice = auctionAlpha.s_startingPrice();
        uint256 defaultMinimumBidIncrement = auctionAlpha.s_minimumBidIncrement();

        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();
        mooveNFT.addAuthorizedMinter(address(auctionAlpha));

        uint256 firstAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory firstAuction = auctionAlpha.getAuctionById(firstAuctionId - 1);

        assertEq(firstAuction.startingPrice, defaultStartingPrice);
        assertEq(firstAuction.minimumBidIncrement, defaultMinimumBidIncrement);

        // The owner decides to double both the starting price and the minimum bid increment
        uint256 newStartingPrice = 20000000000000000;

        vm.prank(USER1);
        auctionAlpha.setStartingPrice(newStartingPrice);
    }

    function testFailSetMinimumBidIncrementWhenNotOwner() public {
        uint256 defaultStartingPrice = auctionAlpha.s_startingPrice();
        uint256 defaultMinimumBidIncrement = auctionAlpha.s_minimumBidIncrement();

        vm.prank(forwarderAddress);
        auctionAlpha.startAuction();
        mooveNFT.addAuthorizedMinter(address(auctionAlpha));

        uint256 firstAuctionId = auctionAlpha.s_currentAuctionId();
        AuctionAlpha.Auction memory firstAuction = auctionAlpha.getAuctionById(firstAuctionId - 1);

        assertEq(firstAuction.startingPrice, defaultStartingPrice);
        assertEq(firstAuction.minimumBidIncrement, defaultMinimumBidIncrement);

        // The owner decides to double both the starting price and the minimum bid increment
        uint256 newMinimumBidIncrement = 100000000000000000;

        vm.prank(USER1);
        auctionAlpha.setMinimumBidIncrement(newMinimumBidIncrement);
    }

    //////////////////////////////////////////////////
    ///////////////// OTHER TESTS ////////////////////
    //////////////////////////////////////////////////

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