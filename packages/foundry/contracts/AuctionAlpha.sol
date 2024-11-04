//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/console.sol";
import { IAuctionAlpha } from "./IAuctionAlpha.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)

/**
 * A smart contract that manages the auction process for Moove NFTs
 * @author Marco Roccon
 */
contract AuctionAlpha is IAuctionAlpha, Ownable {
  /**
   * Keeps track of all the highest bids for every single auction
   */
  mapping(uint256 auctionId => mapping(address bidder => uint256 highestBid))
    s_listOfBidsPerAuction;

  /**
   * Storage variable that stores the current auction id
   * It allows the bidder to correctly place the bid for the current auction
   * The variable is initialized at 0, so that the first auctionId will be incremented to 1
   */
  uint256 public s_currentAuctionId;
  uint256 public s_currentNftId;
  uint256 public s_currentHighestBid;
  address public temporaryWinner;

  uint256 public constant AUCTION_DURATION_DAYS = 30 days;

  struct Auction {
    uint256 auctionId;
    uint256 nftId;
    uint256 openingTimestamp;
    uint256 closingTimestamp;
    bool isOpen;
    address winner;
  }

  /**
   * Record of all the auctions
   */
  Auction[] public s_auctions;

  error AuctionAlpha__AuctionStillOngoing();
  error AuctionAlpha__AuctionAlreadyOpened();

  constructor() Ownable(msg.sender) {
    s_currentAuctionId = 0;
    s_currentNftId = 0;
    s_currentHighestBid = 0;
  }

  function bid(address bidder, uint256 auctionId, uint256 bidAmount) external { }

  function startAuction() external onlyOwner {
    if (s_currentAuctionId > 0 && s_auctions[s_currentAuctionId - 1].isOpen) {
      revert AuctionAlpha__AuctionAlreadyOpened();
    }
    s_currentAuctionId++;
    s_currentNftId++;
    s_auctions.push(
      Auction(
        s_currentAuctionId,
        s_currentNftId,
        block.timestamp,
        block.timestamp + AUCTION_DURATION_DAYS,
        true,
        address(0)
      )
    );
    emit AuctionStarted(
      s_auctions[s_currentAuctionId - 1].auctionId,
      s_auctions[s_currentAuctionId - 1].openingTimestamp
    );
  }

  function closeAuction() external onlyOwner {
    if (block.timestamp < s_auctions[s_currentAuctionId - 1].closingTimestamp) {
      revert AuctionAlpha__AuctionStillOngoing();
    }
    s_auctions[s_currentAuctionId - 1].isOpen = false;
    s_auctions[s_currentAuctionId - 1].winner = temporaryWinner;

    // The second argument of the event should be the closing timestamp
    // This implies that this function must be called at the exact moment when the auction expires
    // Otherwise the two timestamps could vary
    emit AuctionClosed(s_currentAuctionId, block.timestamp);
  }

  /**
   * Function that allows the contract to receive ETH
   */
  receive() external payable { }
}
