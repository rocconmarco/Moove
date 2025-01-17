"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import clsx from "clsx";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount, useBalance, useReadContract, useWriteContract } from "wagmi";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import NFTName from "~~/components/NFTName";
import UnsoldNFTImage from "~~/components/UnsoldNFTImage";
import { auctionAlphaContract } from "~~/contracts/contractsInfo";
import { auctionAlphaClient } from "~~/utils/client/apollo-clients";
import { GET_UNSOLD_NFTS } from "~~/utils/queries/auctionAlpha";
import { ZERO_ADDRESS } from "~~/utils/scaffold-eth/common";

interface UnsoldNFT {
  id: string;
  tokenId: bigint;
  price: bigint;
  blockNumber: bigint;
  blockTimestamp: bigint;
  transactionHash: string;
}

interface DelistedNFT {
  id: string;
  tokenId: bigint;
  blockNumber: bigint;
  blockTimestamp: bigint;
  transactionHash: string;
}

const Buy: NextPage = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const baseURI = "ipfs://bafybeiaepnzx772p5dc2vxbdm6xllkevw6uxu27ncx54cvw2kuloovazcm";

  const { address } = useAccount();
  const { data: walletBalance } = useBalance({
    address,
  });

  const { data: userBalance } = useReadContract({
    ...auctionAlphaContract,
    functionName: "s_withdrawableAmountPerBidder",
    args: [address ?? ZERO_ADDRESS],
    query: {
      refetchInterval: 5000,
    },
  });

  const availableFunds = (walletBalance?.value ?? 0n) + (userBalance ?? 0n);

  const { writeContract, isSuccess, isError, error: writeContractError } = useWriteContract();

  const handleBuy = (amount: bigint, tokenId: bigint) => {
    writeContract({
      ...auctionAlphaContract,
      functionName: "buyUnsoldNFT",
      args: [tokenId],
      value: amount,
    });
  };

  const handleBuyNonPayable = (tokenId: bigint) => {
    writeContract({
      ...auctionAlphaContract,
      functionName: "buyUnsoldNFTNonPayable",
      args: [tokenId],
    });
  };

  const handleBuyButtonClick = (sellingPrice: bigint, tokenId: bigint) => {
    if (isMooveBalanceEnough(sellingPrice)) {
      handleBuyNonPayable(tokenId);
    } else {
      handleBuy(sellingPrice, tokenId);
    }
  };

  const isMooveBalanceEnough = (sellingPrice: bigint): boolean => {
    return (userBalance ?? 0n) >= sellingPrice;
  };

  const handleCloseModal = () => {
    setShowSuccessMessage(false);
    setShowErrorMessage(false);

    window.location.reload();
  };

  useEffect(() => {
    document.body.style.overflow = showSuccessMessage || showErrorMessage ? "hidden" : "auto";
  }, [showSuccessMessage, showErrorMessage]);

  useEffect(() => {
    if (isSuccess) {
      setShowSuccessMessage(true);
      setShowErrorMessage(false);
    }
    if (isError) {
      setShowErrorMessage(true);
      setShowSuccessMessage(false);
    }
  }, [isSuccess, isError]);

  const {
    data,
    loading,
    error: queryError,
  } = useQuery(GET_UNSOLD_NFTS, {
    client: auctionAlphaClient,
    pollInterval: 5000,
  });

  const unsoldNFTsListed = data?.unsoldNFTListeds ?? [];
  const unsoldNFTsDelisted = new Set(data?.unsoldNFTDelisteds?.map((nft: DelistedNFT) => nft.tokenId.toString()) ?? []);

  const unsoldNFTs = unsoldNFTsListed.filter((nft: UnsoldNFT) => !unsoldNFTsDelisted.has(nft.tokenId.toString()));

  if (loading) {
    return (
      <div className="relative min-h-screen w-full">
        <div className="relative z-10 flex flex-col items-center justify-center w-screen flex-grow pt-8 px-40">
          <div className="flex flex-col items-center justify-center space-y-0 w-[100vw]">
            <h1 className="text-3xl font-bold">Unsold NFTs</h1>
            <p className="px-8 text-center">
              List of NFTs that received no offers in past auctions and are now available at their starting price.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center h-[50vh] w-screen">
            <div className="text-center text-white my-8">Loading Unsold NFTs...</div>
          </div>
        </div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="relative min-h-screen w-full">
        <div className="relative z-10 flex flex-col items-center justify-center w-screen flex-grow pt-8 px-40">
          <div className="flex flex-col items-center justify-center space-y-0 w-[100vw]">
            <h1 className="text-3xl font-bold">Unsold NFTs</h1>
            <p className="px-8 text-center">
              List of NFTs that received no offers in past auctions and are now available at their starting price.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center h-[50vh] w-screen">
            <div className="text-center text-white my-8">{queryError.message}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-screen w-full">
        <div className="relative z-10 flex flex-col items-center justify-center w-screen flex-grow pt-8 px-40">
          <div className="flex flex-col items-center justify-center space-y-0 w-[100vw]">
            <h1 className="text-3xl font-bold">Unsold NFTs</h1>
            <p className="px-8 text-center">
              List of NFTs that received no offers in past auctions and are now available at their starting price.
            </p>
          </div>

          {(showSuccessMessage || showErrorMessage) && (
            <div className="fixed inset-0 z-50 backdrop-blur-xl bg-black bg-opacity-0">
              <div
                className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-xl shadow-lg z-50 
                  ${
                    showSuccessMessage
                      ? "bg-gradient-to-t from-green-700 to-black text-white min-w-[90%] sm:min-w-[500px] max-w-[500px]"
                      : "bg-gradient-to-t from-red-900 to-black text-white min-w-[350px] max-w-[350px] sm:min-w-[420px] sm:max-w-[420px]"
                  }`}
              >
                <div className="flex items-center">
                  {showSuccessMessage ? (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="my-0" color="white" width={30} height={30} />
                        <p className="text-lg sm:text-xl font-bold">Transaction completed! 🎉</p>
                      </div>
                      <p className="text-lg sm:text-xl text-center text-pretty">
                        Congratulations, you are now the proud owner of a unique MOOVE NFT.
                      </p>
                      <p className="text-lg sm:text-xl text-center text-pretty">
                        Welcome to the future of sustainable mobility.
                      </p>
                      <div className="flex justify-center gap-4 mt-3 mb-3">
                        <div className="relative inline-flex group">
                          <Link
                            title="Go to My NFTs"
                            href="/mynfts"
                            className="relative inline-flex items-center justify-center px-8 py-4 text-sm sm:text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl outline-none z-10 active:bg-gray-700 hover:bg-gray-800 hover:scale-105"
                          >
                            Go to My NFTs
                          </Link>
                        </div>
                        <div className="relative inline-flex group">
                          <button
                            title="Close"
                            className="relative inline-flex items-center justify-center px-8 py-4 text-sm sm:text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl outline-none z-10 active:bg-gray-700 hover:bg-gray-800 hover:scale-105"
                            onClick={handleCloseModal}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <ExclamationCircleIcon className="my-0" color="white" width={30} height={30} />
                        <p className="text-lg sm:text-xl font-bold">Transaction failed. Please try again.</p>
                      </div>
                      <p className="text-lg sm:text-xl text-wrap text-center">
                        Error message: {`${writeContractError?.message.split(".")[0]}.` || "Unknown error"}
                      </p>
                      <div className="flex justify-center gap-4 mt-3 mb-3">
                        <div className="relative inline-flex group">
                          <button
                            title="Close"
                            className="relative inline-flex items-center justify-center px-8 py-4 text-sm sm:text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl outline-none z-10 active:bg-gray-700 hover:bg-gray-800 hover:scale-105"
                            onClick={handleCloseModal}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {unsoldNFTs?.length == 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] w-screen">
              <div className="text-center text-white my-8">No unsold NFTs available</div>
              <div className="relative inline-flex group">
                <div
                  className="
                        absolute rounded-xl blur-lg z-0 transition-all 
                        opacity-70 -inset-px bg-gradient-to-r 
                       from-darkPurpleAlt via-darkPink to-darkPurpleAlt 
                        group-hover:opacity-100 group-hover:-inset-1 
                        duration-500 animate-tilt
                      "
                ></div>

                <Link
                  title="Back to auctions"
                  href="/auctions"
                  className="
                        relative inline-flex items-center justify-center 
                        px-8 py-4 text-lg font-bold text-white 
                        transition-all duration-200 bg-gray-900 
                        font-pj rounded-xl outline-none z-10 
                       active:bg-gray-700 hover:bg-gray-800 hover:scale-105
                      "
                >
                  Back to auctions
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-[108px] gap-x-4 gap-y-10 mt-8 w-screen">
              {unsoldNFTs?.map((item: UnsoldNFT) => (
                <div className="flex flex-col items-center" key={item.tokenId}>
                  <UnsoldNFTImage tokenURI={`${baseURI}/${item.tokenId}.json`} />
                  <div className="flex items-center justify-between space-y-4 gap-4 w-[250px]">
                    <div className="space-y-0 flex flex-col items-start justify-center">
                      <p className="font-bold text-xl md:text-2xl mb-0">
                        <NFTName tokenURI={`${baseURI}/${item.tokenId}.json`} />
                      </p>
                      <span className="text-lg tracking-wide font-bold text-lightPurple">
                        {formatEther(item.price)} ETH
                      </span>
                    </div>
                    <div className="relative inline-flex group">
                      <div
                        className={clsx(
                          "absolute rounded-xl blur-lg z-0 transition-all",
                          availableFunds >= item.price
                            ? "opacity-70 -inset-px bg-gradient-to-r from-darkPurpleAlt via-darkPink to-darkPurpleAlt group-hover:opacity-100 group-hover:-inset-1 duration-500 animate-tilt"
                            : "opacity-0",
                        )}
                      ></div>

                      <button
                        title={availableFunds < item.price ? "Insufficient funds" : "Buy"}
                        className={clsx(
                          "relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl outline-none z-10 active:bg-gray-700",
                          {
                            "opacity-50 cursor-not-allowed": availableFunds < item.price,
                            "hover:bg-gray-800 hover:scale-105": availableFunds >= item.price,
                          },
                        )}
                        disabled={availableFunds < item.price}
                        onClick={() => handleBuyButtonClick(item.price, item.tokenId)}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Buy;
