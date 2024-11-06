// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAuctionAlpha {
    // ALL THE FUNCTIONS MUST BE EXTERNAL
    event AuctionStarted(uint256 indexed auctionId, uint256 indexed openingTimestamp);
    event AuctionClosed(uint256 indexed auctionId, uint256 indexed closingTimestamp);
    event BidPlaced(address indexed bidder, uint256 indexed auctionId, uint256 bidAmount);
    event WithdrawSuccess(address indexed bidder, uint256 withdrawnedAmount);

    // Is it possible to define the follwing event in the IMintableNFT interface?
    event NFTMinted(address indexed to, uint256 indexed tokenId);

    function placeBid() external payable;

    function withdrawBid(uint256 withdrawAmount) external;

    function startAuction(uint256 startingPrice, uint256 minimumBidIncrement) external;

    function closeAuction() external;
}