//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/console.sol";
import { IAuctionAlpha } from "./IAuctionAlpha.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IMintableNFT } from "./IMintableNFT.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { AutomationCompatibleInterface } from "@chainlink/contracts/v0.8/automation/AutomationCompatible.sol";

/**
 * A smart contract that manages the auction process for Moove NFTs
 * @author Marco Roccon
 * @dev the contract follows the code structure suggested by Cyfrin Updraft
 * @dev functions follow the CEI pattern to avoid potential security risks
 */
contract AuctionAlpha is IAuctionAlpha, Ownable, ReentrancyGuard, AutomationCompatibleInterface {
  error AuctionAlpha__AuctionStillOngoing();
  error AuctionAlpha__AuctionAlreadyOpened();
  error AuctionAlpha__BidAmountMustBeHigherThanCurrentHighestBid();
  error AuctionAlpha__BidAmountIncrementLessThanMinimumBidIncrement();
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
  error AuctionAlpha__SenderMustBeForwarderAddress();
  error AuctionAlpha__StartingPriceMustBeGreaterThanZero();
  error AuctionAlpha__MinimumBidIncrementMustBeGreaterThanZero();
  error AuctionAlpha__ForwarderAddressMustNotBeAddressZero();
  error AuctionAlpha__NotEnoughFundsAvailableOnPlatform();
  error AuctionAlpha__NoNeedToSendEth();


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

  /**
   * @dev startingPrice and minimumBidIncrement has been made public and modifiable
   * @dev only by the owner of the contract. The reason for that is that we wanted to grant
   * @dev a minimum of control to the owner of the contract to contrast potential spikes in ETH price,
   * @dev which could result in unreasonable values for both of the variables that could lead
   * @dev to a lost of interest in the auctions by the users due to high prices
   */
  uint256 public s_startingPrice;
  uint256 public s_minimumBidIncrement;

  uint256 public constant AUCTION_DURATION_DAYS = 30 days;
  uint256 private constant DECIMALS = 18;

  /**
   * Mapping that register the selling price of the unsold NFTs
   * It is set as the nft starting price everytime an auction ends with zero bids
   */
  mapping(uint256 tokenId => uint256 sellingPrice) s_unsoldNFTsSellingPrice;

  /// List of all the unsold NFTs to be fecthed from the front end
  UnsoldNFT[] public s_listOfUnsoldNFTs;

  /**
   * It checks if the unsold NFT is for sale or not
   * The check has to be done via a boolean because uint256 values in mappings are inizialized
   * by default at 0, so it is not sufficient to check if the selling price of the unsold NFT
   * is set to 0
   */
  mapping(uint256 tokenId => bool listed) private s_isTokenListed;

  /**
   * Helper mapping to track the array index of the unsold NFTs
   * to easily remove items from the array when an unsold NFT has been sold
   */
  mapping(uint256 tokenId => uint256 arrayIndex) private s_tokenIdToArrayIndexUnsoldNFTs;

  /**
   * Record of all the auctions
   */
  Auction[] public s_auctions;

  /**
   * The Forwarder contract address responsible for performing the upkeep
   * This address is automatically created when registering the upkeep on Chainlink automation
   * It will be the msg.sender that will call startAuction and closeAuction functions
   * when the checkUpkeep returns true, that is when the AUCTION_DURATION_DAYS have passed
   */
  address public s_forwarderAddress;

  modifier onlyForwarder() {
    if (msg.sender != s_forwarderAddress) {
      revert AuctionAlpha__SenderMustBeForwarderAddress();
    }
    _;
  }

  /**
   * @param _nftContract address of MooveNFT.sol
   * The constructor takes as the only parameter the contract address of MooveNFT.sol
   * The owner of the contract is set via the Ownable.sol contract provided by OpenZeppelin
   * All the state variables are set to their default value
   */
  constructor(address _nftContract) Ownable(msg.sender) {
    i_nftContract = IMintableNFT(_nftContract);
    s_currentAuctionId = 0;
    s_currentNftId = 0;
    s_currentHighestBid = 0;
    s_currentWinner = address(0);

    // Default values in order to be sure that no auction is initialized with zero values
    s_startingPrice = 10000000000000000;
    s_minimumBidIncrement = 5000000000000000;
  }

  /**
   * The contract does not accept direct payment
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
   * Checks the conditions for the Forwarder contract to call the performUpkeep function
   * If there are no auctions opened, it returns true, whereas if there is already an auction ongoing
   * it checks whether the current timestamp is greater or equal than the calculated closing timestamp
   * stored onchain. In the latter case it will return true and the automation is allowed
   */
  function checkUpkeep(bytes calldata) external view override returns (bool, bytes memory) {
    if (s_currentAuctionId == 0) {
      return (true, bytes(""));
    } else {
      bool upkeepNeeded = (block.timestamp >= s_auctions[s_currentAuctionId - 1].closingTimestamp);
      return (upkeepNeeded, bytes(""));
    }
  }

  /**
   * The function to be called by the Forwarder contract authorized by the owner of AuctionAlpha.
   * As the best practices suggest, we run the same checks as in the checkUpkeep function
   * for safety reasons. In case there are no auctions opened, it will only start a new auction.
   * In case there is already an ongoing auction, it will check if the current block timestamp
   * is lower than the calculated closing timestamp stored onchain, and if it's not the case
   * it will close the current auction and simultaneosly open a new one
   */
  function performUpkeep(bytes calldata) external override onlyForwarder {
    if (s_currentAuctionId == 0) {
      startAuction();
      return;
    }
    if (block.timestamp < s_auctions[s_currentAuctionId - 1].closingTimestamp) {
      revert AuctionAlpha__AuctionStillOngoing();
    }
    closeAuction();
    startAuction();
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
    if (s_currentAuctionId == 0) {
      revert AuctionAlpha__AuctionProcessStillNotInizialized();
    }
    if (_isAuctionClosed()) {
      revert AuctionAlpha__AuctionClosed();
    }
    if (s_currentWinner == msg.sender) {
      revert AuctionAlpha__SenderIsAlreadyTheCurrentWinner();
    }

    uint256 availableFunds = s_withdrawableAmountPerBidder[msg.sender];

    if (availableFunds >= s_currentHighestBid + s_auctions[s_currentAuctionId - 1].minimumBidIncrement) {
      revert AuctionAlpha__NoNeedToSendEth();
    }

    if (msg.value == 0) {
      revert AuctionAlpha__MustSendEther();
    }

    uint256 actualBidAmount =
      s_withdrawableAmountPerBidder[msg.sender] + msg.value;

    if (actualBidAmount <= s_currentHighestBid) {
      revert AuctionAlpha__BidAmountMustBeHigherThanCurrentHighestBid();
    }
    if (
      actualBidAmount - s_currentHighestBid
        < s_auctions[s_currentAuctionId - 1].minimumBidIncrement
    ) {
      revert AuctionAlpha__BidAmountIncrementLessThanMinimumBidIncrement();
    }

    // If it is the first bid, there is no need to update the withdrawable amount for the current winner
    // since it doesn't exist yet, otherwise the function will take the current highest bid value and assign it
    // to the current winner in the withdrawable amount mapping, then we are ready to register the new bidder as the
    // current winner, with the amount sent with the transaction as the current highest bid
    if (s_currentWinner != address(0)) {
      s_withdrawableAmountPerBidder[s_currentWinner] += s_currentHighestBid;
    }

    // Updating all the state variables and pushing a new Bid element in the array stored inside the bidHistory mapping
    s_listOfHighestBidPerUser[s_currentAuctionId][msg.sender] = actualBidAmount;
    s_currentHighestBid = actualBidAmount;
    s_currentWinner = msg.sender;
    s_bidHistory[s_currentAuctionId].push(
      Bid({
        bidder: msg.sender,
        amount: actualBidAmount,
        timestamp: block.timestamp
      })
    );

    // Resetting the withdrawable amount for the sender of the transaction
    // The user must use all of its withdrawable amount, as well as additional funds,
    // to outbid the current winner
    s_withdrawableAmountPerBidder[msg.sender] = 0;

    emit BidPlaced(msg.sender, s_currentAuctionId, actualBidAmount);
  }

  function placeBidNonPayable(uint256 bid) public {
    if (s_currentAuctionId == 0) {
      revert AuctionAlpha__AuctionProcessStillNotInizialized();
    }
    if (_isAuctionClosed()) {
      revert AuctionAlpha__AuctionClosed();
    }
    if (s_currentWinner == msg.sender) {
      revert AuctionAlpha__SenderIsAlreadyTheCurrentWinner();
    }

    uint256 availableFunds = s_withdrawableAmountPerBidder[msg.sender];

    if (availableFunds < bid) {
      revert AuctionAlpha__NotEnoughFundsAvailableOnPlatform();
    }

    if (bid <= s_currentHighestBid) {
      revert AuctionAlpha__BidAmountMustBeHigherThanCurrentHighestBid();
    }
    if (
      bid - s_currentHighestBid
        < s_auctions[s_currentAuctionId - 1].minimumBidIncrement
    ) {
      revert AuctionAlpha__BidAmountIncrementLessThanMinimumBidIncrement();
    }

    // If it is the first bid, there is no need to update the withdrawable amount for the current winner
    // since it doesn't exist yet, otherwise the function will take the current highest bid value and assign it
    // to the current winner in the withdrawable amount mapping, then we are ready to register the new bidder as the
    // current winner, with the amount sent with the transaction as the current highest bid
    if (s_currentWinner != address(0)) {
      s_withdrawableAmountPerBidder[s_currentWinner] += s_currentHighestBid;
    }

    // Updating all the state variables and pushing a new Bid element in the array stored inside the bidHistory mapping
    s_listOfHighestBidPerUser[s_currentAuctionId][msg.sender] = bid;
    s_currentHighestBid = bid;
    s_currentWinner = msg.sender;
    s_bidHistory[s_currentAuctionId].push(
      Bid({
        bidder: msg.sender,
        amount: bid,
        timestamp: block.timestamp
      })
    );
    
    // Deducting the bid amount from the withdrawable amount of the user
    s_withdrawableAmountPerBidder[msg.sender]-= bid;

    emit BidPlaced(msg.sender, s_currentAuctionId, bid);
  }

  /**
   * @param withdrawAmount amount to be withdrawed by the sender
   * It must be greater than zero, and less than or equal to the total withdrawable amount
   * registered in the related mapping for the sender
   *
   * This function can be called only when the user has been outbidded by another user,
   * and, as a result, as some funds in the withdrawableAmountPerBidder mapping.
   * The user can decide to withdraw all (or part of) the funds or to add other funds and outbid the current winner
   */
  function withdrawBid(uint256 withdrawAmount) public nonReentrant {
    if (withdrawAmount == 0) {
      revert AuctionAlpha__WithdrawAmountMustBeGreaterThanZero();
    }
    if (s_withdrawableAmountPerBidder[msg.sender] == 0) {
      revert AuctionAlpha__NoAmountToWithdraw();
    }
    if (withdrawAmount > s_withdrawableAmountPerBidder[msg.sender]) {
      revert AuctionAlpha__WithdrawAmountExceedsWithdrawableAmount();
    }

    s_withdrawableAmountPerBidder[msg.sender] -= withdrawAmount;

    (bool success,) = msg.sender.call{ value: withdrawAmount }("");
    if (!success) {
      revert AuctionAlpha__TransferFailed();
    }

    emit WithdrawSuccess(msg.sender, withdrawAmount);
  }

  /**
   * The function that starts the auction. It must be called by the Forwarder contract
   * provided by Chainlink automation and authorized by the owner.
   *
   * The function checks whether there already is an auction opened and if there are still NFTs to be listed
   * in the auction.
   *
   * All the state variables are updated with the new values
   * @notice the state variables can store the value of one auction at a time
   * @notice the state variables are made for an easier interaction with all the relevant information of the auction
   * @notice there must be only one open auction at a time
   *
   * Once the auction is created it is registered as an Auction instance in the auctions array
   */
  function startAuction() public onlyForwarder {
    if (s_currentAuctionId > 0 && s_auctions[s_currentAuctionId - 1].isOpen) {
      revert AuctionAlpha__AuctionAlreadyOpened();
    }
    if (s_currentAuctionId == i_nftContract.getMaxSupply()) {
      revert AuctionAlpha__AllNFTsListed();
    }
    s_currentAuctionId++;
    s_currentNftId++;
    s_currentHighestBid = s_startingPrice;
    s_auctions.push(
      Auction(
        s_currentAuctionId,
        s_currentNftId,
        block.timestamp,
        block.timestamp + AUCTION_DURATION_DAYS,
        s_startingPrice,
        s_minimumBidIncrement,
        true,
        address(0)
      )
    );
    emit AuctionStarted(
      s_auctions[s_currentAuctionId - 1].auctionId,
      s_auctions[s_currentAuctionId - 1].openingTimestamp
    );
  }

  /**
   * This function allows the owner of the contract to close the auction
   * @notice the term "close" is used for an easier understanding of the finality of the function
   * @notice it should be understood as "finalize", as the auction is per se closed
   * @notice when the closing timestamp has been reached, since no other bids will be allowed
   * @notice therefore, this function will register the auction as closed and assign the NFT
   *
   * With regard to the NFT, there are two possible outcomes
   * If the NFT has received at least one valid bid,
   * it will be minted to the winner of the auction.
   * Otherwise, the function will check if the winner is still set to address 0,
   * which will mean that no valid bids has been received during the period of the auction
   * This way, a new UnsoldNFT instance will be created and pushed to the list of unsold NFTs
   * @notice the selling price of the unsold NFT will equal
   * @notice the starting price set by the owner when starting the auction
   */
  function closeAuction() public onlyForwarder {
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

    if (s_auctions[s_currentAuctionId - 1].winner == address(0)) {
      UnsoldNFT memory newUnsoldNFT = UnsoldNFT({
        tokenId: s_currentNftId,
        sellingPrice: s_auctions[s_currentAuctionId - 1].startingPrice
      });
      s_isTokenListed[s_currentNftId] = true;
      s_listOfUnsoldNFTs.push(newUnsoldNFT);
      s_tokenIdToArrayIndexUnsoldNFTs[s_currentNftId] =
        s_listOfUnsoldNFTs.length - 1;
      s_unsoldNFTsSellingPrice[s_currentNftId] =
        s_auctions[s_currentAuctionId - 1].startingPrice;
      emit UnsoldNFTListed(s_currentNftId);
    } else {
      i_nftContract.safeMint(
        s_auctions[s_currentAuctionId - 1].winner, s_currentNftId
      );
    }
  }

  /**
   * @param tokenId id of the unsold NFT to be purchased
   * The function will check if the token is marked as listed in the isTokenListed mapping
   * The value sent by the buyer in the transaction must be EXACTLY equal to the selling price
   * Otherwise the function will revert for incorrect payment
   */
  function buyUnsoldNFT(uint256 tokenId) public payable nonReentrant {
    if (!s_isTokenListed[tokenId]) {
      revert AuctionAlpha__TokenNotAvailable();
    }
    uint256 unsoldNFTPrice = s_unsoldNFTsSellingPrice[tokenId];
    uint256 availableFunds = s_withdrawableAmountPerBidder[msg.sender];

    // The user should call the non payable function to avoid wasting funds
    if (availableFunds >= unsoldNFTPrice) {
      revert AuctionAlpha__NoNeedToSendEth();
    }

    uint256 amountEqualToTokenPrice = availableFunds + msg.value;
    if (amountEqualToTokenPrice != unsoldNFTPrice) {
      revert AuctionAlpha__IncorrectPayment();
    }

    // The token will be delisted from the mapping, it will be impossible
    // for a second user to purchase the same token, since it will not pass
    // the first check of this function
    s_isTokenListed[tokenId] = false;

    // Resetting the withdrawable amount for the sender of the transaction
    // The user must use all of its withdrawable amount, as well as additional funds,
    // to purchase the intended unsold NFT
    s_withdrawableAmountPerBidder[msg.sender] = 0;

    // Applying the swap & pop tecnique to delete the purchased NFT from the list of unsold NFTs
    // ATTENTION: the order of the array will be changed
    uint256 indexToRemove = _getArrayIndexOfUnsoldNFT(tokenId);
    if (indexToRemove == s_listOfUnsoldNFTs.length - 1) {
      s_listOfUnsoldNFTs.pop();
    } else {
      UnsoldNFT memory lastUnsoldNFT = s_listOfUnsoldNFTs[s_listOfUnsoldNFTs.length - 1];
      s_listOfUnsoldNFTs[indexToRemove] = lastUnsoldNFT;
      s_tokenIdToArrayIndexUnsoldNFTs[lastUnsoldNFT.tokenId] = indexToRemove;
      s_listOfUnsoldNFTs.pop();
    }
    i_nftContract.safeMint(msg.sender, tokenId);
  }

  /**
   * This function is called when the user wants to buy an unsold NFT
   * and its withdrawable amount is sufficient to cover the expense
   * In this case there is no need to call a payable function
   */
  function buyUnsoldNFTNonPayable(uint256 tokenId) public {
    if (!s_isTokenListed[tokenId]) {
      revert AuctionAlpha__TokenNotAvailable();
    }
    uint256 unsoldNFTPrice = s_unsoldNFTsSellingPrice[tokenId];
    uint256 availableFunds = s_withdrawableAmountPerBidder[msg.sender];

    if (unsoldNFTPrice > availableFunds) {
      revert AuctionAlpha__NotEnoughFundsAvailableOnPlatform();
    }

    // The token will be delisted from the mapping, it will be impossible
    // for a second user to purchase the same token, since it will not pass
    // the first check of this function
    s_isTokenListed[tokenId] = false;

    // Deducting the unsold NFT price from the withdrawable amount of the user
    s_withdrawableAmountPerBidder[msg.sender] -= unsoldNFTPrice;

    // Applying the swap & pop tecnique to delete the purchased NFT from the list of unsold NFTs
    // ATTENTION: the order of the array will be changed
    uint256 indexToRemove = _getArrayIndexOfUnsoldNFT(tokenId);
    if (indexToRemove == s_listOfUnsoldNFTs.length - 1) {
      s_listOfUnsoldNFTs.pop();
    } else {
      UnsoldNFT memory lastUnsoldNFT = s_listOfUnsoldNFTs[s_listOfUnsoldNFTs.length - 1];
      s_listOfUnsoldNFTs[indexToRemove] = lastUnsoldNFT;
      s_tokenIdToArrayIndexUnsoldNFTs[lastUnsoldNFT.tokenId] = indexToRemove;
      s_listOfUnsoldNFTs.pop();
    }
    i_nftContract.safeMint(msg.sender, tokenId);
  }

  /**
   * @param forwarderAddress address of the Forwarder contract provided by Chainlink automation
   * The owner of the contract must set the forwarder address in order to allow
   * the Chainlink Automation Network to perform the upkeep when the custom logic conditions defined
   * inside the checkUpkeep function are met
   */
  function setForwarderAddress(address forwarderAddress) public onlyOwner {
    if (forwarderAddress == address(0)) {
      revert AuctionAlpha__ForwarderAddressMustNotBeAddressZero();
    }
    s_forwarderAddress = forwarderAddress;
  }

  /**
   * @param startingPrice the intended starting price of the auction decided by the owner
   */
  function setStartingPrice(uint256 startingPrice) public onlyOwner {
    if(startingPrice == 0) {
      revert AuctionAlpha__StartingPriceMustBeGreaterThanZero();
    }
    s_startingPrice = startingPrice;
  }

  /**
   * @param minimumBidIncrement the minimum increment for every new bid to be considered valid
   */
  function setMinimumBidIncrement(uint256 minimumBidIncrement) public onlyOwner {
    if(minimumBidIncrement == 0) {
      revert AuctionAlpha__MinimumBidIncrementMustBeGreaterThanZero();
    }
    s_minimumBidIncrement = minimumBidIncrement;
  }

  function _isAuctionClosed() internal view returns (bool) {
    return !s_auctions[s_currentAuctionId - 1].isOpen;
  }

  function _getArrayIndexOfUnsoldNFT(uint256 tokenId) internal view returns (uint256) {
    return s_tokenIdToArrayIndexUnsoldNFTs[tokenId];
  }

  function getAuctionById(uint256 auctionId) public view returns (Auction memory) {
    return s_auctions[auctionId];
  }

  function getListOfBids(uint256 auctionId) public view returns (Bid[] memory) {
    return s_bidHistory[auctionId];
  }

  function getWithdrawableAmountByBidderAddress(address bidder) public view returns (uint256) {
    return s_withdrawableAmountPerBidder[bidder];
  }

  function getUnsoldNFTPrice(uint256 tokenId) public view returns (uint256) {
    return s_unsoldNFTsSellingPrice[tokenId];
  }

  function getArrayIndexOfUnsoldNFT(uint256 tokenId) public view returns (uint256) {
    return s_tokenIdToArrayIndexUnsoldNFTs[tokenId];
  }

  function getIsTokenListed(uint256 tokenId) public view returns (bool) {
    return s_isTokenListed[tokenId];
  }

  function getUnsoldNFTsArrayLength() public view returns (uint256) {
    return s_listOfUnsoldNFTs.length;
  }

  function getUnsoldNFTsArray() public view returns (UnsoldNFT[] memory) {
    return s_listOfUnsoldNFTs;
  }
}
