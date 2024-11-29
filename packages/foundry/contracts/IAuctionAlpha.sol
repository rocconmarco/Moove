// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * Interface defining the core functions of the AuctionAlpha contract
 * @author Marco Roccon
 */
interface IAuctionAlpha {
    event AuctionStarted(uint256 indexed auctionId, uint256 indexed openingTimestamp);
    event AuctionClosed(uint256 indexed auctionId, uint256 indexed actualClosingTimestamp);
    event BidPlaced(address indexed bidder, uint256 indexed auctionId, uint256 bidAmount);
    event WithdrawSuccess(address indexed bidder, uint256 withdrawnedAmount);
    event UnsoldNFTListed(uint256 indexed tokenId);

    function placeBid() external payable;

    function withdrawBid(uint256 withdrawAmount) external;

    function startAuction() external;

    function closeAuction() external;

    function buyUnsoldNFT(uint256 tokenId) external payable;

    function setForwarderAddress(address forwarderAddress) external;

    function setStartingPrice(uint256 startingPrice) external;

    function setMinimumBidIncrement(uint256 minimumBidIncrement) external;
}