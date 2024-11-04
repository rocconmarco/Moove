// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAuctionAlpha {
    // ALL THE FUNCTIONS MUST BE EXTERNAL
    event AuctionStarted(uint256 indexed auctionId, uint256 indexed openingTimestamp);
    event AuctionClosed(uint256 indexed auctionId, uint256 indexed closingTimestamp);
    event BidPlaced(address indexed bidder, uint256 indexed auctionId, uint256 bidAmount);

    function bid(address bidder, uint256 auctionId, uint256 bidAmount) external;

    function startAuction() external;

    function closeAuction() external;
}