"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { useAccount, useBalance, useReadContract, useWriteContract } from "wagmi";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import BidHistoryTable from "~~/components/BidHistoryTable";
import CountdownTimer from "~~/components/CountdownTimer";
import InfoIcon from "~~/components/InfoIcon";
import NFTImage from "~~/components/NFTImage";
import NFTName from "~~/components/NFTName";
import { auctionAlphaContract, mooveNFTContract } from "~~/contracts/contractsInfo";
import { useGlobalState } from "~~/services/store/store";
import { ZERO_ADDRESS } from "~~/utils/scaffold-eth/common";

const Auctions: NextPage = () => {
  const [userBid, setUserBid] = useState<string>("");
  const [bidError, setBidError] = useState<string | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [actualBid, setActualBid] = useState<string>("");
  const [actualBidMessage, setActualBidMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);

  const currentAccount = useAccount();
  const { address } = useAccount();
  const { data: walletBalance, isLoading } = useBalance({
    address,
  });

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let bidValue = e.target.value;

    if (bidValue.startsWith(".")) {
      bidValue = "0" + bidValue;
    }

    setUserBid(bidValue);

    const parsedBidValue = parseFloat(bidValue);
    const bidValueInWei = parseEther(bidValue);
    const differenceBetweenBidAndBalance = balance && bidValueInWei - balance;
    const minimumBid = parseFloat((currentHighestBidInEth + minimumBidIncrementInEth).toFixed(12));
    const availableFunds = (walletBalance?.value ?? 0n) + (balance ?? 0n);

    console.log("Wallet balance: ", walletBalance?.value);
    console.log("Moove balance: ", balance);
    console.log("Available funds: ", availableFunds);

    if (balance) {
      setActualBid(formatEther(differenceBetweenBidAndBalance ?? 0n));
      setActualBidMessage(`You only need to send ${formatEther(differenceBetweenBidAndBalance ?? 0n)} ETH`);
    }

    if (bidValue === "") {
      setBidError(null);
      setActualBidMessage(null);
    } else if (!currentAccount.address) {
      setBidError("Connect wallet to place your bid");
    } else if (currentAccount.address === currentWinner) {
      setBidError("You are already the highest bidder");
    } else if (isNaN(parsedBidValue)) {
      setBidError("Please enter a valid number");
    } else if (parsedBidValue < minimumBid) {
      setBidError(`Bid must be at least ${minimumBidAmount} ETH`);
    } else if (bidValueInWei >= (availableFunds ?? 0n)) {
      setBidError(`Insufficient funds`);
    } else if (!currentAccount.address) {
      setBidError("Connect wallet to place bids");
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

  const { data: currentAuctionId } = useReadContract({
    ...auctionAlphaContract,
    functionName: "s_currentAuctionId",
    query: {
      refetchInterval: 5000,
    },
  });

  const { data: auction } = useReadContract({
    ...auctionAlphaContract,
    functionName: "s_auctions",
    args: currentAuctionId ? [BigInt(Number(currentAuctionId) - 1)] : undefined,
    query: {
      enabled: Boolean(currentAuctionId),
      refetchInterval: 5000,
    },
  });

  const { data: highestBid } = useReadContract({
    ...auctionAlphaContract,
    functionName: "s_currentHighestBid",
    query: {
      refetchInterval: 5000,
    },
  });

  const { data: auctionId } = useReadContract({
    ...auctionAlphaContract,
    functionName: "s_currentAuctionId",
    query: {
      refetchInterval: 5000,
    },
  });

  const { data: nftId } = useReadContract({
    ...auctionAlphaContract,
    functionName: "s_currentNftId",
    query: {
      refetchInterval: 5000,
    },
  });

  const { data: tokenURI } = useReadContract({
    ...mooveNFTContract,
    functionName: "tokenURI",
    args: [BigInt(nftId ?? 0)],
    query: {
      refetchInterval: 5000,
    },
  });

  const { data: currentWinner } = useReadContract({
    ...auctionAlphaContract,
    functionName: "s_currentWinner",
    query: {
      refetchInterval: 5000,
    },
  });

  const { data: userBalance } = useReadContract({
    ...auctionAlphaContract,
    functionName: "s_withdrawableAmountPerBidder",
    args: [currentAccount.address ?? ZERO_ADDRESS],
    query: {
      refetchInterval: 5000,
    },
  });

  const { writeContract, isSuccess } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      setUserBid("");
      setBidError(null);
      setSuccessMessage(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    setBalance(userBalance ?? null);
  }, [userBalance]);

  const handlePlaceBid = () => {
    writeContract({
      ...auctionAlphaContract,
      functionName: "placeBid",
      value: balance ? parseEther(actualBid) : parseEther(userBid),
    });
  };

  const startingPrice: string = formatEther(auction?.[4] ?? BigInt(0)).toString();
  const startingPriceInUsd: string = (Number(formatEther(auction?.[4] ?? BigInt(0))) * nativeCurrencyPrice).toFixed(2);
  const minimumBidIncrement: string = formatEther(auction?.[5] ?? BigInt(0)).toString();
  const minimumBidIncrementInEth: number = Number(minimumBidIncrement);
  const minimumBidIncrementInUsd: string = (
    Number(formatEther(auction?.[5] ?? BigInt(0))) * nativeCurrencyPrice
  ).toFixed(2);
  const currentHighestBid: string = formatEther(highestBid ?? BigInt(0)).toString();
  const currentHighestBidInEth: number = Number(currentHighestBid);
  const currentHighestBidInUsd: string = (Number(formatEther(highestBid ?? BigInt(0))) * nativeCurrencyPrice).toFixed(
    2,
  );
  const minimumBidAmount: string = formatEther((highestBid ?? BigInt(0)) + (auction?.[5] ?? BigInt(0)));

  return (
    <>
      <div className="relative min-h-screen w-full">
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4 flex-grow pt-8 px-40">
          <h1 className="text-3xl font-bold mb-6 w-[100vw] text-center">Current auction</h1>
          <div className="h-[650px] w-[95vw] md:h-[350px] md:w-[800px] flex flex-col items-center md:flex-row md:space-x-10">
            <div>
              <NFTImage tokenURI={tokenURI ?? ""} />
            </div>
            <div className="flex flex-col items-center md:items-start justify-between w-[95vw] h-full">
              <div className="flex items-start justify-center md:justify-start w-[400px]">
                <p className="font-bold text-2xl md:text-3xl mb-0">
                  <NFTName tokenURI={tokenURI ?? ""} />
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-lg md:text-xl mt-0 mb-0 tracking-wide">Starting price:</p>
                  <p className="text-xl md:text-2xl mt-0 mb-0 tracking-wide text-lightPurple font-bold">
                    {startingPrice} ETH
                  </p>
                  <p className="hidden md:block text-sm mt-0 mb-0 tracking-wide italic">${startingPriceInUsd}</p>
                  <div className="hidden md:block">
                    <InfoIcon text="The starting price of the auction. If there are no bids at the end of the auction, this will be the selling price for the NFT." />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-lg md:text-xl mt-0 mb-0 tracking-wide">Min. bid increment:</p>
                  <p className="text-xl md:text-2xl mt-0 mb-0 tracking-wide text-lightPurple font-bold">
                    {minimumBidIncrement} ETH
                  </p>
                  <p className="hidden md:block text-sm mt-0 mb-0 tracking-wide italic">${minimumBidIncrementInUsd}</p>
                  <div className="hidden md:block">
                    <InfoIcon text="The minimum difference between your bid and the current highest bid." />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-lg md:text-xl mt-0 mb-0 tracking-wide">Current highest bid:</p>
                  <p className="text-xl md:text-2xl mt-0 mb-0 tracking-wide text-lightPurple font-bold">
                    {currentHighestBid} ETH
                  </p>
                  <p className="hidden md:block text-sm mt-0 mb-0 tracking-wide italic">${currentHighestBidInUsd}</p>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-start justify-center space-y-2 w-[95vw] md:w-[400px]">
                <div className="flex flex-col space-y-0">
                  <div
                    className={`flex items-center space-x-4 relative ${
                      bidError || (actualBidMessage && userBid && !bidError) || isSuccess ? `mb-0` : `mb-3`
                    }`}
                  >
                    <input
                      type="text"
                      pattern="^\d*(\.\d+)?$"
                      value={userBid}
                      onChange={handleBidChange}
                      onKeyDown={handleKeyPress}
                      className="peer border border-darkPurple block text-base md:text-lg appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none h-[45px] md:h-[50px] w-full rounded bg-transparent px-3 py-[0.32rem] leading-[1.6] focus:outline-none"
                      placeholder={minimumBidAmount}
                    />
                    <p className="text-xl md:text-2xl text-lightPurple font-bold">ETH</p>
                    <p className="hidden md:block text-sm mt-0 mb-0 tracking-wide italic">
                      {userBid && `$${(Number(userBid) * nativeCurrencyPrice).toFixed(2)}`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 z-50">
                    {bidError && <p className="text-red-500 text-sm my-0">{bidError}</p>}
                    {bidError === "Insufficient funds" && (
                      <InfoIcon text="This message may appear even though the amount is lower than the total balance due to approximation." />
                    )}
                  </div>

                  {actualBidMessage && userBid && !bidError && (
                    <div className="flex items-center space-x-2">
                      <p className="text-green-500 text-sm my-0">{actualBidMessage}</p>
                      <InfoIcon
                        text={`Your current Moove balance is ${formatEther(
                          balance ?? BigInt(0),
                        )} ETH. You will only need to add the difference to place the intended bid. `}
                      />
                    </div>
                  )}

                  {isSuccess && successMessage && (
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        <p className="text-green-500 text-sm my-0 mr-1">Bid placed correctly</p>
                        <CheckCircleIcon className="my-0" color="#22c55e" width={20} height={20} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative inline-flex group">
                  <div
                    className={clsx(
                      "absolute rounded-xl blur-lg z-0 transition-all",
                      bidError === null &&
                        userBid !== "" &&
                        currentAccount.address &&
                        currentAccount.address !== currentWinner
                        ? "opacity-70 -inset-px bg-gradient-to-r from-darkPurpleAlt via-darkPink to-darkPurpleAlt group-hover:opacity-100 group-hover:-inset-1 duration-500 animate-tilt"
                        : "opacity-0",
                    )}
                  ></div>

                  <button
                    title="Place your bid"
                    className={clsx(
                      "relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl outline-none z-10 active:bg-gray-700",
                      {
                        "opacity-50 cursor-not-allowed":
                          bidError !== null ||
                          userBid === "" ||
                          !currentAccount.address ||
                          currentAccount.address === currentWinner,
                        "hover:bg-gray-800 hover:scale-105":
                          bidError === null &&
                          userBid !== "" &&
                          currentAccount.address &&
                          currentAccount.address !== currentWinner,
                      },
                    )}
                    disabled={
                      bidError !== null ||
                      userBid === "" ||
                      !currentAccount.address ||
                      currentAccount.address === currentWinner
                    }
                    onClick={handlePlaceBid}
                  >
                    Place your bid
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <CountdownTimer targetDate={new Date(Number((auction?.[3] ?? BigInt(0)) * BigInt(1000))).toISOString()} />
          </div>
        </div>
        <div className="hidden relative z-10 md:flex md:flex-col items-center justify-center space-x-10 space-y-4 flex-grow pt-8 px-40">
          <div className="w-[800px]">
            <BidHistoryTable auctionId={auctionId ?? BigInt(0)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Auctions;
