/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  11155111: {
    MooveNFT: {
      address: "0x9B61C6524a8e3935c425FD6EF9d07f52319891e8",
      abi: [
        {
          inputs: [{ internalType: "string", name: "baseURI", type: "string" }],
          stateMutability: "nonpayable",
          type: "constructor"
        },
        {
          inputs: [
            { internalType: "address", name: "sender", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" },
            { internalType: "address", name: "owner", type: "address" }
          ],
          name: "ERC721IncorrectOwner",
          type: "error"
        },
        {
          inputs: [
            { internalType: "address", name: "operator", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" }
          ],
          name: "ERC721InsufficientApproval",
          type: "error"
        },
        {
          inputs: [{ internalType: "address", name: "approver", type: "address" }],
          name: "ERC721InvalidApprover",
          type: "error"
        },
        {
          inputs: [{ internalType: "address", name: "operator", type: "address" }],
          name: "ERC721InvalidOperator",
          type: "error"
        },
        {
          inputs: [{ internalType: "address", name: "owner", type: "address" }],
          name: "ERC721InvalidOwner",
          type: "error"
        },
        {
          inputs: [{ internalType: "address", name: "receiver", type: "address" }],
          name: "ERC721InvalidReceiver",
          type: "error"
        },
        {
          inputs: [{ internalType: "address", name: "sender", type: "address" }],
          name: "ERC721InvalidSender",
          type: "error"
        },
        {
          inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
          name: "ERC721NonexistentToken",
          type: "error"
        },
        {
          inputs: [],
          name: "MooveNFT__MaxSupplyCanOnlyBeInremented",
          type: "error"
        },
        {
          inputs: [],
          name: "MooveNFT__MintingNonExistingToken",
          type: "error"
        },
        {
          inputs: [],
          name: "MooveNFT__MintingNotAuthorized",
          type: "error"
        },
        {
          inputs: [],
          name: "MooveNFT__NotAValidAddress",
          type: "error"
        },
        {
          inputs: [],
          name: "MooveNFT__NotAValidBaseURI",
          type: "error"
        },
        {
          inputs: [{ internalType: "address", name: "owner", type: "address" }],
          name: "OwnableInvalidOwner",
          type: "error"
        },
      {
          inputs: [{ internalType: "address", name: "account", type: "address" }],
          name: "OwnableUnauthorizedAccount",
          type: "error"
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, internalType: "address", name: "owner", type: "address" },
            { indexed: true, internalType: "address", name: "approved", type: "address" },
            { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" }
          ],
          name: "Approval",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, internalType: "address", name: "owner", type: "address" },
            { indexed: true, internalType: "address", name: "operator", type: "address" },
            { indexed: false, internalType: "bool", name: "approved", type: "bool" }
          ],
          name: "ApprovalForAll",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, internalType: "address", name: "to", type: "address" },
            { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" }
          ],
          name: "NFTMinted",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
            { indexed: true, internalType: "address", name: "newOwner", type: "address" }
          ],
          name: "OwnershipTransferred",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, internalType: "address", name: "from", type: "address" },
            { indexed: true, internalType: "address", name: "to", type: "address" },
            { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" }
          ],
          name: "Transfer",
          type: "event"
        },
      {
          inputs: [{ internalType: "address", name: "minter", type: "address" }],
          name: "addAuthorizedMinter",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" }
          ],
          name: "approve",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [{ internalType: "address", name: "owner", type: "address" }],
          name: "balanceOf",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [{ internalType: "address", name: "minter", type: "address" }],
          name: "checkIfAuthorizedMinter",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
          name: "getApproved",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [],
          name: "getMaxSupply",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "operator", type: "address" }
          ],
          name: "isApprovedForAll",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" }
          ],
          name: "mint",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [],
          name: "name",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [],
          name: "owner",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
          name: "ownerOf",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [{ internalType: "address", name: "minter", type: "address" }],
          name: "removeAuthorizedMinter",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [],
          name: "renounceOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [],
          name: "s_tokenCounter",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" }
          ],
          name: "safeMint",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
      {
          inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" },
            { internalType: "bytes", name: "data", type: "bytes" }
          ],
          name: "safeTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [
            { internalType: "address", name: "operator", type: "address" },
            { internalType: "bool", name: "approved", type: "bool" }
          ],
          name: "setApprovalForAll",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
          name: "supportsInterface",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
          name: "tokenURI",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" }
          ],
          name: "transferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        }
      ],
      inheritedFunctions: {},
    },
    AuctionAlpha: {
      address: "0xb5ECDdCe676394b4B2d9E12232717d9D54fcacc1",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_nftContract",
              type: "address"
            }
          ],
          stateMutability: "nonpayable",
          type: "constructor"
        },
        {
          inputs: [],
          name: "AuctionAlpha__AllNFTsListed",
          type: "error"
        },
        {
          inputs: [],
          name: "AuctionAlpha__AuctionAlreadyOpened",
          type: "error"
        },
        {
          inputs: [],
          name: "AuctionAlpha__AuctionClosed",
          type: "error"
        },
        {
          inputs: [],
          name: "AuctionAlpha__AuctionProcessStillNotInizialized",
          type: "error"
        },
        {
          inputs: [],
          name: "AuctionAlpha__AuctionStillOngoing",
          type: "error"
        },
        {
          inputs: [],
          name: "AuctionAlpha__BidAmountLessThanMinimumBidIncrement",
          type: "error"
        },
        {
          inputs: [],
          name: "AuctionAlpha__BidAmountMustBeHigherThanCurrentHighestBid",
          type: "error"
        },
        {
          inputs: [],
          name: "AuctionAlpha__DirectPaymentNotAllowed",
          type: "error"
        },
        {
          inputs: [],
          name: "AuctionAlpha__IncorrectPayment",
          type: "error"
        },
        {
          inputs: [],
          name: "AuctionAlpha__MustSendEther",
          type: "error"
        },
        {
          inputs: [],
          name: "AuctionAlpha__NoAmountToWithdraw",
          type: "error"
        },
        {
          inputs: [],
          name: "AuctionAlpha__SenderIsAlreadyTheCurrentWinner",
          type: "error"
        },
        {
          inputs: [],
          name: "AuctionAlpha__TokenNotAvailable",
          type: "error"
        },
        {
          inputs: [],
          name: "AuctionAlpha__TransferFailed",
          type: "error"
        },
        {
          inputs: [],
          name: "AuctionAlpha__WithdrawAmountExceedsWithdrawableAmount",
          type: "error"
        },
        {
          inputs: [],
          name: "AuctionAlpha__WithdrawAmountMustBeGreaterThanZero",
          type: "error"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address"
            }
          ],
          name: "OwnableInvalidOwner",
          type: "error"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address"
            }
          ],
          name: "OwnableUnauthorizedAccount",
          type: "error"
        },
        {
          inputs: [],
          name: "ReentrancyGuardReentrantCall",
          type: "error"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "auctionId",
              type: "uint256"
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "closingTimestamp",
              type: "uint256"
            }
          ],
          name: "AuctionClosed",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "auctionId",
              type: "uint256"
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "openingTimestamp",
              type: "uint256"
            }
          ],
          name: "AuctionStarted",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "bidder",
              type: "address"
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "auctionId",
              type: "uint256"
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "bidAmount",
              type: "uint256"
            }
          ],
          name: "BidPlaced",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "previousOwner",
              type: "address"
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address"
            }
          ],
          name: "OwnershipTransferred",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256"
            }
          ],
          name: "UnsoldNFTListed",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "bidder",
              type: "address"
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "withdrawnedAmount",
              type: "uint256"
            }
          ],
          name: "WithdrawSuccess",
          type: "event"
        },
        {
          stateMutability: "payable",
          type: "fallback"
        },
        {
          inputs: [],
          name: "AUCTION_DURATION_DAYS",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256"
            }
          ],
          name: "buyUnsoldNFT",
          outputs: [],
          stateMutability: "payable",
          type: "function"
        },
        {
          inputs: [],
          name: "closeAuction",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256"
            }
          ],
          name: "getArrayIndexOfUnsoldNFT",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "auctionId",
              type: "uint256"
            }
          ],
          name: "getAuctionById",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "auctionId",
                  type: "uint256"
                },
                {
                  internalType: "uint256",
                  name: "nftId",
                  type: "uint256"
                },
                {
                  internalType: "uint256",
                  name: "openingTimestamp",
                  type: "uint256"
                },
                {
                  internalType: "uint256",
                  name: "closingTimestamp",
                  type: "uint256"
                },
                {
                  internalType: "uint256",
                  name: "startingPrice",
                  type: "uint256"
                },
                {
                  internalType: "uint256",
                  name: "minimumBidIncrement",
                  type: "uint256"
                },
                {
                  internalType: "bool",
                  name: "isOpen",
                  type: "bool"
                },
                {
                  internalType: "address",
                  name: "winner",
                  type: "address"
                }
              ],
              internalType: "struct AuctionAlpha.Auction",
              name: "",
              type: "tuple"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256"
            }
          ],
          name: "getIsTokenListed",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "auctionId",
              type: "uint256"
            }
          ],
          name: "getListOfBids",
          outputs: [
            {
              components: [
                {
                  internalType: "address",
                  name: "bidder",
                  type: "address"
                },
                {
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256"
                },
                {
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256"
                }
              ],
              internalType: "struct AuctionAlpha.Bid[]",
              name: "",
              type: "tuple[]"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256"
            }
          ],
          name: "getUnsoldNFTPrice",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [],
          name: "getUnsoldNFTsArrayLength",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "bidder",
              type: "address"
            }
          ],
          name: "getWithdrawableAmountByBidderAddress",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [],
          name: "i_nftContract",
          outputs: [
            {
              internalType: "contract IMintableNFT",
              name: "",
              type: "address"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [],
          name: "placeBid",
          outputs: [],
          stateMutability: "payable",
          type: "function"
        },
        {
          inputs: [],
          name: "renounceOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256"
            }
          ],
          name: "s_auctions",
          outputs: [
            {
              internalType: "uint256",
              name: "auctionId",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "nftId",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "openingTimestamp",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "closingTimestamp",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "startingPrice",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "minimumBidIncrement",
              type: "uint256"
            },
            {
              internalType: "bool",
              name: "isOpen",
              type: "bool"
            },
            {
              internalType: "address",
              name: "winner",
              type: "address"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "auctionId",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256"
            }
          ],
          name: "s_bidHistory",
          outputs: [
            {
              internalType: "address",
              name: "bidder",
              type: "address"
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [],
          name: "s_currentAuctionId",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [],
          name: "s_currentHighestBid",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [],
          name: "s_currentNftId",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [],
          name: "s_currentWinner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "auctionId",
              type: "uint256"
            },
            {
              internalType: "address",
              name: "bidder",
              type: "address"
            }
          ],
          name: "s_listOfHighestBidPerUser",
          outputs: [
            {
              internalType: "uint256",
              name: "highestBid",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256"
            }
          ],
          name: "s_listOfUnsoldNFTs",
          outputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "sellingPrice",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "bidder",
              type: "address"
            }
          ],
          name: "s_withdrawableAmountPerBidder",
          outputs: [
            {
              internalType: "uint256",
              name: "withdrawableAmount",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "startingPrice",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "minimumBidIncrement",
              type: "uint256"
            }
          ],
          name: "startAuction",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newOwner",
              type: "address"
            }
          ],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "withdrawAmount",
              type: "uint256"
            }
          ],
          name: "withdrawBid",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          stateMutability: "payable",
          type: "receive"
        }
      ]
    }
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
