export const AuctionAlphaAbi = [
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "_nftContract",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "fallback",
      "stateMutability": "payable"
    },
    {
      "type": "receive",
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "AUCTION_DURATION_DAYS",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "buyUnsoldNFT",
      "inputs": [
        {
          "name": "tokenId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "closeAuction",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getArrayIndexOfUnsoldNFT",
      "inputs": [
        {
          "name": "tokenId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getAuctionById",
      "inputs": [
        {
          "name": "auctionId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple",
          "internalType": "struct AuctionAlpha.Auction",
          "components": [
            {
              "name": "auctionId",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "nftId",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "openingTimestamp",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "closingTimestamp",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "startingPrice",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "minimumBidIncrement",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "isOpen",
              "type": "bool",
              "internalType": "bool"
            },
            {
              "name": "winner",
              "type": "address",
              "internalType": "address"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getIsTokenListed",
      "inputs": [
        {
          "name": "tokenId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getListOfBids",
      "inputs": [
        {
          "name": "auctionId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct AuctionAlpha.Bid[]",
          "components": [
            {
              "name": "bidder",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "amount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "timestamp",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getUnsoldNFTPrice",
      "inputs": [
        {
          "name": "tokenId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getUnsoldNFTsArrayLength",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getWithdrawableAmountByBidderAddress",
      "inputs": [
        {
          "name": "bidder",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "i_nftContract",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract IMintableNFT"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "placeBid",
      "inputs": [],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "renounceOwnership",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "s_auctions",
      "inputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "auctionId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "nftId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "openingTimestamp",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "closingTimestamp",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "startingPrice",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "minimumBidIncrement",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "isOpen",
          "type": "bool",
          "internalType": "bool"
        },
        {
          "name": "winner",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "s_bidHistory",
      "inputs": [
        {
          "name": "auctionId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "bidder",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "timestamp",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "s_currentAuctionId",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "s_currentHighestBid",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "s_currentNftId",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "s_currentWinner",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "s_listOfHighestBidPerUser",
      "inputs": [
        {
          "name": "auctionId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "bidder",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "highestBid",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "s_listOfUnsoldNFTs",
      "inputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "tokenId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "sellingPrice",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "s_withdrawableAmountPerBidder",
      "inputs": [
        {
          "name": "bidder",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "withdrawableAmount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "startAuction",
      "inputs": [
        {
          "name": "startingPrice",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "minimumBidIncrement",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transferOwnership",
      "inputs": [
        {
          "name": "newOwner",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "withdrawBid",
      "inputs": [
        {
          "name": "withdrawAmount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "AuctionClosed",
      "inputs": [
        {
          "name": "auctionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "closingTimestamp",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "AuctionStarted",
      "inputs": [
        {
          "name": "auctionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "openingTimestamp",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "BidPlaced",
      "inputs": [
        {
          "name": "bidder",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "auctionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "bidAmount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "OwnershipTransferred",
      "inputs": [
        {
          "name": "previousOwner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "newOwner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "UnsoldNFTListed",
      "inputs": [
        {
          "name": "tokenId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "WithdrawSuccess",
      "inputs": [
        {
          "name": "bidder",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "withdrawnedAmount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "AuctionAlpha__AllNFTsListed",
      "inputs": []
    },
    {
      "type": "error",
      "name": "AuctionAlpha__AuctionAlreadyOpened",
      "inputs": []
    },
    {
      "type": "error",
      "name": "AuctionAlpha__AuctionClosed",
      "inputs": []
    },
    {
      "type": "error",
      "name": "AuctionAlpha__AuctionProcessStillNotInizialized",
      "inputs": []
    },
    {
      "type": "error",
      "name": "AuctionAlpha__AuctionStillOngoing",
      "inputs": []
    },
    {
      "type": "error",
      "name": "AuctionAlpha__BidAmountLessThanMinimumBidIncrement",
      "inputs": []
    },
    {
      "type": "error",
      "name": "AuctionAlpha__BidAmountMustBeHigherThanCurrentHighestBid",
      "inputs": []
    },
    {
      "type": "error",
      "name": "AuctionAlpha__DirectPaymentNotAllowed",
      "inputs": []
    },
    {
      "type": "error",
      "name": "AuctionAlpha__IncorrectPayment",
      "inputs": []
    },
    {
      "type": "error",
      "name": "AuctionAlpha__MustSendEther",
      "inputs": []
    },
    {
      "type": "error",
      "name": "AuctionAlpha__NoAmountToWithdraw",
      "inputs": []
    },
    {
      "type": "error",
      "name": "AuctionAlpha__SenderIsAlreadyTheCurrentWinner",
      "inputs": []
    },
    {
      "type": "error",
      "name": "AuctionAlpha__TokenNotAvailable",
      "inputs": []
    },
    {
      "type": "error",
      "name": "AuctionAlpha__TransferFailed",
      "inputs": []
    },
    {
      "type": "error",
      "name": "AuctionAlpha__WithdrawAmountExceedsWithdrawableAmount",
      "inputs": []
    },
    {
      "type": "error",
      "name": "AuctionAlpha__WithdrawAmountMustBeGreaterThanZero",
      "inputs": []
    },
    {
      "type": "error",
      "name": "OwnableInvalidOwner",
      "inputs": [
        {
          "name": "owner",
          "type": "address",
          "internalType": "address"
        }
      ]
    },
    {
      "type": "error",
      "name": "OwnableUnauthorizedAccount",
      "inputs": [
        {
          "name": "account",
          "type": "address",
          "internalType": "address"
        }
      ]
    },
    {
      "type": "error",
      "name": "ReentrancyGuardReentrantCall",
      "inputs": []
    }
  ] as const