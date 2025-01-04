import { gql } from "@apollo/client";

export const GET_BIDS = gql`
  query GetBids($auctionId: BigInt!) {
    bidPlaceds(where: { auctionId: $auctionId }, orderBy: blockTimestamp, orderDirection: desc) {
      id
      bidder
      auctionId
      bidAmount
      blockTimestamp
    }
  }
`;

export const GET_UNSOLD_NFTS = gql`
  query GetUnsoldNFTs {
    unsoldNFTListeds {
      id
      tokenId
      price
      blockNumber
      blockTimestamp
      transactionHash
    }
    unsoldNFTDelisteds {
      id
      tokenId
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;
