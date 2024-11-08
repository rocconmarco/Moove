//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/console.sol";
import { IAuctionAlpha } from "./IAuctionAlpha.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IMintableNFT } from "./IMintableNFT.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * A smart contract that manages the auction process for Moove NFTs
 * @author Marco Roccon
 */
contract AuctionAlpha is IAuctionAlpha, Ownable, ReentrancyGuard {
  IMintableNFT public nftContract;

  /**
   * Keeps track of all the bids for every single auction
   */
  mapping(uint256 auctionId => mapping(address bidder => uint256 highestBid)) public s_listOfBidsPerAuction;

  mapping(address bidder => uint256 withdrawableAmount) public s_withdrawableAmountPerBidder;

  /**
   * Storage variable that stores the current auction id
   * It allows the bidder to correctly place the bid for the current auction
   * The variable is initialized at 0, so that the first auctionId will be incremented to 1
   */

  // FARE UNA VARIABILE CON IL NUMERO TOTALE DI OFFERTE?

  uint256 public s_currentAuctionId;
  uint256 public s_currentNftId;
  uint256 public s_currentHighestBid;
  address public s_currentWinner;

  uint256 public constant AUCTION_DURATION_DAYS = 30 days;
  uint256 private constant DECIMALS = 18;

  struct Auction {
    uint256 auctionId;
    uint256 nftId;
    uint256 openingTimestamp;
    uint256 closingTimestamp;
    uint256 startingPrice;
    uint256 minimumBidIncrement;
    bool isOpen;
    address winner;
  }

  struct UnsoldNFT {
    uint256 nftId;
    uint256 sellingPrice;
  }
  // List of all the unsold NFTs to be fecthed from the front end
  UnsoldNFT[] public s_unsoldNFTs;

  /**
   * Record of all the auctions
   */
  Auction[] public s_auctions;

  error AuctionAlpha__AuctionStillOngoing();
  error AuctionAlpha__AuctionAlreadyOpened();
  error AuctionAlpha__BidAmountMustBeHigherThanCurrentHighestBid();
  error AuctionAlpha__BidAmountLessThanMinimumBidIncrement();
  error AuctionAlpha__AuctionClosed();
  error AuctionAlpha__NoAmountToWithdraw();
  error AuctionAlpha__TransferFailed();
  error AuctionAlpha__WithdrawAmountMustBeGreaterThanZero();
  error AuctionAlpha__WithdrawAmountExceedsWithdrawableAmount();
  error AuctionAlpha__AuctionProcessStillNotInizialized();
  error AuctionAlpha__MustSendEther();
  error AuctionAlpha__SenderIsAlreadyTheCurrentWinner();

  constructor(address _nftContract) Ownable(msg.sender) {
    nftContract = IMintableNFT(_nftContract);
    s_currentAuctionId = 0;
    s_currentNftId = 0;
    s_currentHighestBid = 0;
    s_currentWinner = address(0);
  }

  /**
   * The function allows a user to place a bid
   * The user will have to place a valid bid, which is a bid that is higher than the current highest bid and
   * has a nominal increment equal or higher than the minimum bid increment.
   * The bid value has to be sent as a transaction value, since this function is marked as payable
   * 
   */
  function placeBid() public payable nonReentrant {
    if(s_currentAuctionId == 0) {
      revert AuctionAlpha__AuctionProcessStillNotInizialized();
    }
    if(_isAuctionClosed()) {
      revert AuctionAlpha__AuctionClosed();
    }
    if(s_currentWinner == msg.sender) {
      revert AuctionAlpha__SenderIsAlreadyTheCurrentWinner();
    }

    // Can we move this before the first check?
    uint256 actualBidAmount = s_withdrawableAmountPerBidder[msg.sender] + msg.value;

    if(msg.value == 0) {
      revert AuctionAlpha__MustSendEther();
    }
    if(actualBidAmount <= s_currentHighestBid) {
      revert AuctionAlpha__BidAmountMustBeHigherThanCurrentHighestBid();
    }
    if(actualBidAmount - s_currentHighestBid < s_auctions[s_currentAuctionId - 1].minimumBidIncrement) {
      revert AuctionAlpha__BidAmountLessThanMinimumBidIncrement();
    }
    address previousWinner = s_currentWinner;
    uint256 previousHighestBid = s_currentHighestBid;

    // If it is the first bid, there is no need to update the withdrawable amount for the previous winner
    // since it does not exist
    if(previousWinner != address(0)) {
      s_withdrawableAmountPerBidder[previousWinner] += previousHighestBid;
    }
    
    s_listOfBidsPerAuction[s_currentAuctionId][msg.sender] = actualBidAmount;
    s_currentHighestBid = actualBidAmount;
    s_currentWinner = msg.sender;

    s_withdrawableAmountPerBidder[msg.sender] = 0;

    emit BidPlaced(msg.sender, s_currentAuctionId, actualBidAmount);
   }

  /**
   * This function can be called only when the user has been outbidded by another user
   * The user can decide to withdraw all (or part of) the funds or to add other funds and outbid the current winner
   */
  function withdrawBid(uint256 withdrawAmount) public nonReentrant {
    if(withdrawAmount == 0) {
      revert AuctionAlpha__WithdrawAmountMustBeGreaterThanZero();
    }
    if(s_withdrawableAmountPerBidder[msg.sender] == 0) {
      revert AuctionAlpha__NoAmountToWithdraw();
    }
    if(withdrawAmount > s_withdrawableAmountPerBidder[msg.sender]) {
      revert AuctionAlpha__WithdrawAmountExceedsWithdrawableAmount();
    }

    s_withdrawableAmountPerBidder[msg.sender] -= withdrawAmount;

    (bool success,) = msg.sender.call{value: withdrawAmount}("");
    if(!success) {
      revert AuctionAlpha__TransferFailed();
    }

    emit WithdrawSuccess(msg.sender, withdrawAmount);
  }

  function startAuction(uint256 startingPrice, uint256 minimumBidIncrement) external onlyOwner {
    if (s_currentAuctionId > 0 && s_auctions[s_currentAuctionId - 1].isOpen) {
      revert AuctionAlpha__AuctionAlreadyOpened();
    }
    s_currentAuctionId++;
    s_currentNftId++;
    s_currentHighestBid = startingPrice;
    s_auctions.push(
      Auction(
        s_currentAuctionId,
        s_currentNftId,
        block.timestamp,
        block.timestamp + AUCTION_DURATION_DAYS,
        startingPrice,
        minimumBidIncrement,
        true,
        address(0)
      )
    );
    emit AuctionStarted(
      s_auctions[s_currentAuctionId - 1].auctionId,
      s_auctions[s_currentAuctionId - 1].openingTimestamp
    );
  }

  // Follows CEI pattern
  function closeAuction() external onlyOwner {
    if (block.timestamp < s_auctions[s_currentAuctionId - 1].closingTimestamp) {
      revert AuctionAlpha__AuctionStillOngoing();
    }
    s_auctions[s_currentAuctionId - 1].isOpen = false;
    s_auctions[s_currentAuctionId - 1].winner = s_currentWinner;
    s_currentWinner = address(0);
    s_currentHighestBid = 0;

    // The second argument of the event should be the closing timestamp
    // This implies that this function must be called at the exact moment when the auction expires
    // Otherwise the two timestamps could vary
    emit AuctionClosed(s_currentAuctionId, block.timestamp);

    if(s_auctions[s_currentAuctionId - 1].winner == address(0)){
      UnsoldNFT memory newUnsoldNFT = UnsoldNFT({
        nftId: s_currentNftId,
        sellingPrice: s_auctions[s_currentAuctionId - 1].startingPrice
      });
      s_unsoldNFTs.push(newUnsoldNFT);
    } else {
      nftContract.safeMint(s_auctions[s_currentAuctionId - 1].winner, s_currentNftId);
    }
  }

  function getAuctionById(uint256 auctionId) public view returns(Auction memory) {
    return s_auctions[auctionId];
  }

  function getWithdrawableAmountByBidderAddress(address bidder) public view returns(uint256) {
    return s_withdrawableAmountPerBidder[bidder];
  }

  function getUnsoldNFT(uint256 index) public view returns(UnsoldNFT memory) {
    return s_unsoldNFTs[index];
  }

  function _isAuctionClosed() internal view returns(bool) {
    return !s_auctions[s_currentAuctionId - 1].isOpen;
  }

  /**
   * Function that allows the contract to receive ETH
   */
  receive() external payable { }
}
