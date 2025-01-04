import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { AuctionClosed } from "../generated/schema"
import { AuctionClosed as AuctionClosedEvent } from "../generated/AuctionAlpha/AuctionAlpha"
import { handleAuctionClosed } from "../src/auction-alpha"
import { createAuctionClosedEvent } from "./auction-alpha-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let auctionId = BigInt.fromI32(234)
    let actualClosingTimestamp = BigInt.fromI32(234)
    let newAuctionClosedEvent = createAuctionClosedEvent(
      auctionId,
      actualClosingTimestamp
    )
    handleAuctionClosed(newAuctionClosedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AuctionClosed created and stored", () => {
    assert.entityCount("AuctionClosed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AuctionClosed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "auctionId",
      "234"
    )
    assert.fieldEquals(
      "AuctionClosed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "actualClosingTimestamp",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
