import { gql } from "@apollo/client";

export const GET_NFTS_RECEIVED = gql`
  query GetNFTsReceived($address: Bytes!) {
    transfers(where: { to: $address }, orderBy: to, orderDirection: asc) {
      id
      from
      to
      tokenId
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export const GET_NFTS_SENT = gql`
  query GetNFTsSent($address: Bytes!) {
    transfers(where: { from: $address }, orderBy: to, orderDirection: asc) {
      id
      from
      to
      tokenId
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;
