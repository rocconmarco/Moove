"use client";

import { useState } from "react";
import styles from "./Auctions.module.css";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useReadContract, useReadContracts } from "wagmi";
import BidHistoryTable from "~~/components/BidHistoryTable";
import CountdownTimer from "~~/components/CountdownTimer";
import InfoIcon from "~~/components/InfoIcon";
import NFTImage from "~~/components/NFTImage";
import NFTName from "~~/components/NFTName";
import { auctionAlphaContract, mooveNFTContract } from "~~/contracts/contractsInfo";
import { useGlobalState } from "~~/services/store/store";

const Auctions: NextPage = () => {
  const [userBid, setUserBid] = useState<string>("");
  const [bidError, setBidError] = useState<string | null>(null);

  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const isNativeCurrencyPriceFetching = useGlobalState(state => state.nativeCurrency.isFetching);

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let bidValue = e.target.value;

    if (bidValue.startsWith(".")) {
      bidValue = "0" + bidValue;
    }

    setUserBid(bidValue);

    const parsedBidValue = parseFloat(bidValue);
    const minimumBid = parseFloat((currentHighestBidInEth + minimumBidIncrementInEth).toFixed(12));

    if (bidValue === "") {
      setBidError(null);
    } else if (isNaN(parsedBidValue)) {
      setBidError("Please enter a valid number");
    } else if (parsedBidValue < minimumBid) {
      setBidError(`Bid must be at least ${minimumBidAmount} ETH`);
    } else {
      setBidError(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = e.key;

    const allowedKeys = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      ".",
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
    ];

    if (char === "." && userBid.toString().includes(".")) {
      e.preventDefault();
      return;
    }

    if (!allowedKeys.includes(char)) {
      e.preventDefault();
    }
  };

  const { data: auction } = useReadContract({
    ...auctionAlphaContract,
    functionName: "s_auctions",
    args: [BigInt(0)],
  });

  const { data: highestBid } = useReadContract({
    ...auctionAlphaContract,
    functionName: "s_currentHighestBid", 
    query: {
      refetchInterval: 5000,
    }
  });

  const { data: auctionId } = useReadContract({
    ...auctionAlphaContract,
    functionName: "s_currentAuctionId",
  });

  const { data: nftId } = useReadContract({
    ...auctionAlphaContract,
    functionName: "s_currentNftId",
  });

  const { data: tokenURI } = useReadContract({
    ...mooveNFTContract,
    functionName: "tokenURI",
    args: [BigInt(nftId ?? 0)],
  });

  const startingPrice: string = formatEther(auction?.[4] ?? BigInt(0)).toString();
  const startingPriceInUsd: string = (Number(formatEther(auction?.[4] ?? BigInt(0))) * nativeCurrencyPrice).toFixed(2);
  const minimumBidIncrement: string = formatEther(auction?.[5] ?? BigInt(0)).toString();
  const minimumBidIncrementInEth: number = Number(minimumBidIncrement);
  const minimumBidIncrementInUsd: string = (Number(formatEther(auction?.[5] ?? BigInt(0))) * nativeCurrencyPrice).toFixed(2);
  const currentHighestBid: string = formatEther(highestBid ?? BigInt(0)).toString();
  const currentHighestBidInEth: number = Number(currentHighestBid);
  const currentHighestBidInUsd: string = (Number(formatEther(highestBid ?? BigInt(0))) * nativeCurrencyPrice).toFixed(2);
  const minimumBidAmount: string = formatEther(((highestBid ?? BigInt(0)) + (auction?.[5] ?? BigInt(0))));
  

  return (
    <>
      <div className="relative min-h-screen w-full">
        <div className="relative z-10 flex flex-col items-center justify-center space-x-10 space-y-4 flex-grow pt-8 px-40">
          <h1 className="text-3xl font-bold mb-6">Current auction</h1>
          <div className="h-[350px] w-[800px] flex space-x-10">
            <div>
              <NFTImage tokenURI={tokenURI ?? ""} />
            </div>
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-start justify-start w-[400px]">
                <p className="font-bold text-3xl mb-0">
                  <NFTName tokenURI={tokenURI ?? ""} />
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-xl mt-0 mb-0 tracking-wide">Starting price:</p>
                  <p className="text-2xl mt-0 mb-0 tracking-wide text-lightPurple font-bold">{startingPrice} ETH</p>
                  <p className="text-sm mt-0 mb-0 tracking-wide italic">${startingPriceInUsd}</p>
                  <InfoIcon text="The starting price of the auction. If there are no bids at the end of the auction, this will be the selling price for the NFT." />
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-xl mt-0 mb-0 tracking-wide">Min. bid increment:</p>
                  <p className="text-2xl mt-0 mb-0 tracking-wide text-lightPurple font-bold">
                    {minimumBidIncrement} ETH
                  </p>
                  <p className="text-sm mt-0 mb-0 tracking-wide italic">${minimumBidIncrementInUsd}</p>
                  <div className="">
                    <InfoIcon text="The minimum difference between your bid and the current highest bid." />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-xl mt-0 mb-0 tracking-wide">Current highest bid:</p>
                  <p className="text-2xl mt-0 mb-0 tracking-wide text-lightPurple font-bold">{currentHighestBid} ETH</p>
                  <p className="text-sm mt-0 mb-0 tracking-wide italic">${currentHighestBidInUsd}</p>
                </div>
              </div>

              <div className="flex flex-col items-start justify-center space-y-2 w-[400px]">
                <div className="flex flex-col space-y-0">
                  <div className={`flex items-center space-x-4 relative ${bidError ? `mb-0` : `mb-3`}`}>
                    <input
                      type="text"
                      pattern="^\d*(\.\d+)?$"
                      value={userBid}
                      onChange={handleBidChange}
                      onKeyDown={handleKeyPress}
                      className="peer border border-darkPurple block text-lg appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none h-[50px] w-full rounded bg-transparent px-3 py-[0.32rem] leading-[1.6] focus:outline-none"
                      placeholder={minimumBidAmount}
                    />
                    <p className="text-xl text-lightPurple font-bold">ETH</p>
                    <p className="text-sm mt-0 mb-0 tracking-wide italic">{userBid && `$${((Number(userBid) * nativeCurrencyPrice).toFixed(2))}`}</p>
                  </div>
                  {bidError && <p className="text-red-500 text-sm">{bidError}</p>}
                </div>

                <div className="relative inline-flex group">
                  <div className="absolute transition-all duration-500 opacity-70 -inset-px bg-gradient-to-r from-darkPurpleAlt via-darkPink to-darkPurpleAlt rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
                  <a
                    href="#"
                    title="Place your bid"
                    className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    role="button"
                  >
                    Place your bid
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div>
            <CountdownTimer targetDate={new Date(Number((auction?.[3] ?? BigInt(0)) * BigInt(1000))).toISOString()} />
          </div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center space-x-10 space-y-4 flex-grow pt-8 px-40">
          <div className="w-[800px]">
            <BidHistoryTable auctionId={auctionId ?? BigInt(0)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Auctions;
