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
  error AuctionAlpha__IncorrectPayment();
  error AuctionAlpha__TokenNotAvailable();
  error AuctionAlpha__AllNFTsListed();
  error AuctionAlpha__DirectPaymentNotAllowed();


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
    uint256 tokenId;
    uint256 sellingPrice;
  }

  struct Bid {
    address bidder;
    uint256 amount;
    uint256 timestamp;
  }

  /**
   * Interface that allows AuctionAlpha to access the NFT contract
   * Only the essential function for minting (mint, safeMint) and for checking
   * the total supply are defined in the interface
   */
  IMintableNFT public immutable i_nftContract;

  
  /// Mapping that keeps track of the highest bid for every bidder in all the auctions
  mapping(uint256 auctionId => mapping(address bidder => uint256 highestBid)) public s_listOfHighestBidPerUser;

  /**
   * Mapping that keeps track of every single bid for every auction held
   * Used for retrieving the history of bids for a particular auction
   */
  mapping(uint256 auctionId => Bid[] listOfBids) public s_bidHistory;

  /**
   * Mapping that is updated every time a user gets outbidded by another user
   * It is the amount of ETH that the user can withdraw from the contract
   * The user can decide to use this amount to place other bids 
   */
  mapping(address bidder => uint256 withdrawableAmount) public s_withdrawableAmountPerBidder;

  uint256 public s_currentAuctionId;
  uint256 public s_currentNftId;
  uint256 public s_currentHighestBid;
  address public s_currentWinner;

  uint256 public constant AUCTION_DURATION_DAYS = 30 days;
  uint256 private constant DECIMALS = 18;

  /** Mapping that register the selling price of the unsold NFTs
   * It is set as the nft starting price everytime an auction ends with zero bids
   */
  mapping (uint256 tokenId => uint256 sellingPrice) s_unsoldNFTsSellingPrice ;

  
  /// List of all the unsold NFTs to be fecthed from the front end
  UnsoldNFT[] public s_listOfUnsoldNFTs;
  
  /** Crucial to check if the unsold NFT is for sale or not
   * The check has to be done via a boolean because uint256 values in mappings are inizialized
   * by default at 0, so it is not sufficient to check if the selling price of the unsold NFT
   * is set to 0
   */ 
  mapping(uint256 tokenId => bool listed) private s_isTokenListed;

  /** Helper mapping to track the array index of the unsold NFTs
   * to easily remove items from the array when an unsold NFT has been sold
   */ 
  mapping(uint256 tokenId => uint256 arrayIndex) private s_tokenIdToArrayIndexUnsoldNFTs;

  /**
   * Record of all the auctions
   */
  Auction[] public s_auctions;

  

  constructor(address _nftContract) Ownable(msg.sender) {
    i_nftContract = IMintableNFT(_nftContract);
    s_currentAuctionId = 0;
    s_currentNftId = 0;
    s_currentHighestBid = 0;
    s_currentWinner = address(0);
  }

  /** The contract does not accept direct payment
   * This way we prefer an explicit rather than implicit approach
   * The only way to pay the contract is via the placeBid function
   */ 
  receive() external payable { 
    revert AuctionAlpha__DirectPaymentNotAllowed();
  }

  fallback() external payable {
    revert AuctionAlpha__DirectPaymentNotAllowed();
  }

  /**
   * The function allows a user to place a bid
   * The user will have to place a valid bid, which is a bid that is higher than the current highest bid and
   * has a nominal increment equal or higher than the minimum bid increment.
   * The bid value has to be sent as a transaction value, since this function is marked as payable
   * 
   * A list of checks has been implemented, the function cannot be called if the owner of the contract
   * has not started any auctions, if the auction is closed and there are no new auctions been started,
   * and if the current highest bid has been made from the same sender of the transaction
   * 
   * The function will generate a revert if the value sent is equal to zero, if the amount sent (eventually
   * added with the withdrawable amount of the sender) is less than or equal to the current highest bid, and if
   * actual bid amount is less than the required minimum increment for the bid to be valid
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

    // If it is the first bid, there is no need to update the withdrawable amount for the previous winner
    // since it doesn't exist yet
    if(s_currentWinner != address(0)) {
      s_withdrawableAmountPerBidder[s_currentWinner] += s_currentHighestBid;
    }

    // Updating all the relevant state variables
    s_listOfHighestBidPerUser[s_currentAuctionId][msg.sender] = actualBidAmount;
    s_currentHighestBid = actualBidAmount;
    s_currentWinner = msg.sender;
    s_bidHistory[s_currentAuctionId].push(Bid({
      bidder: msg.sender,
      amount: actualBidAmount,
      timestamp: block.timestamp
    }));

    // Resetting the withdrawable amount for the sender of the transaction
    // The user must use all of its withdrawable amount, as well as additional funds,
    // to outbid the current winner
    s_withdrawableAmountPerBidder[msg.sender] = 0;

    emit BidPlaced(msg.sender, s_currentAuctionId, actualBidAmount);
   }

  /**
   * @param withdrawAmount amount to be withdrawed by the sender
   * It must be greater than zero, and less than or equal to the total withdrawable amount
   * registered in the related mapping for the sender
   * 
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


  /**
   * @param startingPrice base price decided by the owner for the NFT
   * @param minimumBidIncrement minimum difference in price between the previous and the current bid
   * 
   * The owner of the contract starts the auction setting the starting price for the NFT
   * and the minimum bid increment for every bid to be considered valid
   * 
   * It checks whether there is already an auction opened and if there are still NFTs to be listed
   * in the auction.
   */
  function startAuction(uint256 startingPrice, uint256 minimumBidIncrement) public onlyOwner {
    if (s_currentAuctionId > 0 && s_auctions[s_currentAuctionId - 1].isOpen) {
      revert AuctionAlpha__AuctionAlreadyOpened();
    }
    if(s_currentAuctionId == i_nftContract.getMaxSupply()) {
      revert AuctionAlpha__AllNFTsListed();
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
  function closeAuction() public onlyOwner {
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
        tokenId: s_currentNftId,
        sellingPrice: s_auctions[s_currentAuctionId - 1].startingPrice
      });
      s_isTokenListed[s_currentNftId] = true;
      s_listOfUnsoldNFTs.push(newUnsoldNFT);
      s_tokenIdToArrayIndexUnsoldNFTs[s_currentNftId] = s_listOfUnsoldNFTs.length - 1;
      s_unsoldNFTsSellingPrice[s_currentNftId] = s_auctions[s_currentAuctionId - 1].startingPrice;
      emit UnsoldNFTListed(s_currentNftId);
    } else {
      i_nftContract.safeMint(s_auctions[s_currentAuctionId - 1].winner, s_currentNftId);
    }
  }

  function buyUnsoldNFT(uint256 tokenId) public payable {
    if(!s_isTokenListed[tokenId]) {
      revert AuctionAlpha__TokenNotAvailable();
    }
    uint256 unsoldNFTPrice = s_unsoldNFTsSellingPrice[tokenId];
    if(msg.value != unsoldNFTPrice) {
      revert AuctionAlpha__IncorrectPayment();
    }

    // Out of the three mappings involved in this operation
    // We decided to only update this, to save gas
    // As it serves as a gateway to access the other two
    // In the other two mappings the array index and the selling price of already sold NFTs
    // Will maintain their historical value, since they will no longer be accessible after the purchase
    s_isTokenListed[tokenId] = false;

    // Applying the swap & pop tecnique to delete the purchased NFT from the list of unsold NFTs
    // ATTENTION: the order of the array will be changed

    // If the NFT is already the last of the list
    // pop it out of the array
    uint256 indexToRemove = _getArrayIndexOfUnsoldNFT(tokenId);
    if(indexToRemove == s_listOfUnsoldNFTs.length - 1) {
      s_listOfUnsoldNFTs.pop();
    } else {
      // otherwise swap it with the last NFT of the array and update the mapping
      UnsoldNFT memory lastUnsoldNFT = s_listOfUnsoldNFTs[s_listOfUnsoldNFTs.length - 1];
      s_listOfUnsoldNFTs[indexToRemove] = lastUnsoldNFT;
      s_tokenIdToArrayIndexUnsoldNFTs[lastUnsoldNFT.tokenId] = indexToRemove;
      s_listOfUnsoldNFTs.pop();
    }
    i_nftContract.safeMint(msg.sender, tokenId);
  }


  function _isAuctionClosed() internal view returns(bool) {
    return !s_auctions[s_currentAuctionId - 1].isOpen;
  }

  function _getArrayIndexOfUnsoldNFT(uint256 tokenId) internal view returns(uint256) {
    return s_tokenIdToArrayIndexUnsoldNFTs[tokenId];
  }

  function getAuctionById(uint256 auctionId) public view returns(Auction memory) {
    return s_auctions[auctionId];
  }

  function getListOfBids(uint256 auctionId) public view returns(Bid[] memory) {
    return s_bidHistory[auctionId];
  }

  function getWithdrawableAmountByBidderAddress(address bidder) public view returns(uint256) {
    return s_withdrawableAmountPerBidder[bidder];
  }

  function getUnsoldNFTPrice(uint256 tokenId) public view returns(uint256) {
    return s_unsoldNFTsSellingPrice[tokenId];
  }

  function getArrayIndexOfUnsoldNFT(uint256 tokenId) public view returns(uint256) {
    return s_tokenIdToArrayIndexUnsoldNFTs[tokenId];
  }

  function getIsTokenListed(uint256 tokenId) public view returns(bool) {
    return s_isTokenListed[tokenId];
  }

  function getUnsoldNFTsArrayLength() public view returns(uint256) {
    return s_listOfUnsoldNFTs.length;
  }
  
}
