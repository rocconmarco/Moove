import {
  AuctionClosed as AuctionClosedEvent,
  AuctionStarted as AuctionStartedEvent,
  BidPlaced as BidPlacedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  UnsoldNFTDelisted as UnsoldNFTDelistedEvent,
  UnsoldNFTListed as UnsoldNFTListedEvent,
  WithdrawSuccess as WithdrawSuccessEvent
} from "../generated/AuctionAlpha/AuctionAlpha"
import {
  AuctionClosed,
  AuctionStarted,
  BidPlaced,
  OwnershipTransferred,
  UnsoldNFTDelisted,
  UnsoldNFTListed,
  WithdrawSuccess
} from "../generated/schema"

export function handleAuctionClosed(event: AuctionClosedEvent): void {
  let entity = new AuctionClosed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.auctionId = event.params.auctionId
  entity.actualClosingTimestamp = event.params.actualClosingTimestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAuctionStarted(event: AuctionStartedEvent): void {
  let entity = new AuctionStarted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.auctionId = event.params.auctionId
  entity.openingTimestamp = event.params.openingTimestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBidPlaced(event: BidPlacedEvent): void {
  let entity = new BidPlaced(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.bidder = event.params.bidder
  entity.auctionId = event.params.auctionId
  entity.bidAmount = event.params.bidAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnsoldNFTDelisted(event: UnsoldNFTDelistedEvent): void {
  let entity = new UnsoldNFTDelisted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnsoldNFTListed(event: UnsoldNFTListedEvent): void {
  let entity = new UnsoldNFTListed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.price = event.params.price

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawSuccess(event: WithdrawSuccessEvent): void {
  let entity = new WithdrawSuccess(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.bidder = event.params.bidder
  entity.withdrawnedAmount = event.params.withdrawnedAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
