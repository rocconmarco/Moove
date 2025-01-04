import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  AuctionClosed,
  AuctionStarted,
  BidPlaced,
  OwnershipTransferred,
  UnsoldNFTDelisted,
  UnsoldNFTListed,
  WithdrawSuccess
} from "../generated/AuctionAlpha/AuctionAlpha"

export function createAuctionClosedEvent(
  auctionId: BigInt,
  actualClosingTimestamp: BigInt
): AuctionClosed {
  let auctionClosedEvent = changetype<AuctionClosed>(newMockEvent())

  auctionClosedEvent.parameters = new Array()

  auctionClosedEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )
  auctionClosedEvent.parameters.push(
    new ethereum.EventParam(
      "actualClosingTimestamp",
      ethereum.Value.fromUnsignedBigInt(actualClosingTimestamp)
    )
  )

  return auctionClosedEvent
}

export function createAuctionStartedEvent(
  auctionId: BigInt,
  openingTimestamp: BigInt
): AuctionStarted {
  let auctionStartedEvent = changetype<AuctionStarted>(newMockEvent())

  auctionStartedEvent.parameters = new Array()

  auctionStartedEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )
  auctionStartedEvent.parameters.push(
    new ethereum.EventParam(
      "openingTimestamp",
      ethereum.Value.fromUnsignedBigInt(openingTimestamp)
    )
  )

  return auctionStartedEvent
}

export function createBidPlacedEvent(
  bidder: Address,
  auctionId: BigInt,
  bidAmount: BigInt
): BidPlaced {
  let bidPlacedEvent = changetype<BidPlaced>(newMockEvent())

  bidPlacedEvent.parameters = new Array()

  bidPlacedEvent.parameters.push(
    new ethereum.EventParam("bidder", ethereum.Value.fromAddress(bidder))
  )
  bidPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )
  bidPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "bidAmount",
      ethereum.Value.fromUnsignedBigInt(bidAmount)
    )
  )

  return bidPlacedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createUnsoldNFTDelistedEvent(
  tokenId: BigInt
): UnsoldNFTDelisted {
  let unsoldNftDelistedEvent = changetype<UnsoldNFTDelisted>(newMockEvent())

  unsoldNftDelistedEvent.parameters = new Array()

  unsoldNftDelistedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return unsoldNftDelistedEvent
}

export function createUnsoldNFTListedEvent(
  tokenId: BigInt,
  price: BigInt
): UnsoldNFTListed {
  let unsoldNftListedEvent = changetype<UnsoldNFTListed>(newMockEvent())

  unsoldNftListedEvent.parameters = new Array()

  unsoldNftListedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  unsoldNftListedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return unsoldNftListedEvent
}

export function createWithdrawSuccessEvent(
  bidder: Address,
  withdrawnedAmount: BigInt
): WithdrawSuccess {
  let withdrawSuccessEvent = changetype<WithdrawSuccess>(newMockEvent())

  withdrawSuccessEvent.parameters = new Array()

  withdrawSuccessEvent.parameters.push(
    new ethereum.EventParam("bidder", ethereum.Value.fromAddress(bidder))
  )
  withdrawSuccessEvent.parameters.push(
    new ethereum.EventParam(
      "withdrawnedAmount",
      ethereum.Value.fromUnsignedBigInt(withdrawnedAmount)
    )
  )

  return withdrawSuccessEvent
}
