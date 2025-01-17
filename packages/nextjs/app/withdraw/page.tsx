"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { auctionAlphaContract } from "~~/contracts/contractsInfo";
import { ZERO_ADDRESS } from "~~/utils/scaffold-eth/common";
import Link from "next/link";

const Withdraw: NextPage = () => {
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

  const currentAccount = useAccount();

  const handleMaxAmount = () => {
    setWithdrawAmount(formatEther(userBalance ?? 0n));
  };

  const { writeContract, isSuccess, isError, error } = useWriteContract();

  const handleWithdraw = () => {
    writeContract({
      ...auctionAlphaContract,
      functionName: "withdrawBid",
      args: [parseEther(withdrawAmount)],
    });
  };

  const handleWithdrawAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let withdrawAmount = e.target.value;

    if (withdrawAmount.startsWith(".")) {
      withdrawAmount = "0" + withdrawAmount;
    }

    setWithdrawAmount(withdrawAmount);
    console.log("Withdraw amount: ", withdrawAmount);

    console.log("Withdraw error: ", withdrawError);

    const parsedWithdrawAmount = parseFloat(withdrawAmount);
    const parsedUserBalance = Number(formatEther(userBalance ?? 0n));

    console.log("Parsed withdraw amount: ", parsedWithdrawAmount);
    console.log("Parsed user balance: ", parsedUserBalance);

    if (withdrawAmount === "") {
      setWithdrawError(null);
    } else if (!currentAccount.address) {
      setWithdrawError("Connect wallet to withdraw funds");
    } else if (isNaN(parsedWithdrawAmount)) {
      setWithdrawError("Please enter a valid number");
    } else if (parsedWithdrawAmount === 0) {
      setWithdrawError("Amount must be greater than 0");
    } else if (parsedUserBalance === 0) {
      setWithdrawError("No funds to withdraw");
    } else if (parsedWithdrawAmount > parsedUserBalance) {
      setWithdrawError(`Amount cannot exceed ${formatEther(userBalance ?? 0n)} ETH`);
    } else {
      setWithdrawError(null);
    }
  };

  const { data: userBalance } = useReadContract({
    ...auctionAlphaContract,
    functionName: "s_withdrawableAmountPerBidder",
    args: [currentAccount.address ?? ZERO_ADDRESS],
    query: {
      refetchInterval: 5000,
    },
  });

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

    if (char === "." && withdrawAmount.toString().includes(".")) {
      e.preventDefault();
      return;
    }

    if (!allowedKeys.includes(char)) {
      e.preventDefault();
    }
  };

  const handleCloseModal = () => {
    setShowSuccessMessage(false);
    setShowErrorMessage(false);
  };

  useEffect(() => {
    document.body.style.overflow = showSuccessMessage || showErrorMessage ? "hidden" : "auto";
  }, [showSuccessMessage, showErrorMessage]);

  useEffect(() => {
    if (isSuccess) {
      setShowSuccessMessage(true);
      setShowErrorMessage(false);
      setWithdrawAmount("");
      setWithdrawError(null);
    }
    if (isError) {
      setShowErrorMessage(true);
      setShowSuccessMessage(false);
    }
  }, [isSuccess, isError]);

  return (
    <>
      <div className="relative min-h-screen w-full">
        <div className="relative z-10 flex flex-col items-center justify-center space-x-10 space-y-4 flex-grow pt-8 px-40">
          <div className="flex flex-col items-center justify-center w-[100vw]">
            <div className="flex flex-col items-center justify-center space-y-0">
              <h1 className="text-3xl font-bold">Withdraw funds</h1>
            </div>
            <div className="flex flex-col items-center justify-center space-y-0">
              <p className="text-xl md:text-2xl font-bold text-pink mt-10">MOOVE Balance:</p>
              <span className="block text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-gray-600 drop-shadow-[0_10px_8px_rgba(0,0,0,0.8)] pb-2">
                {formatEther(userBalance ?? 0n)} ETH
              </span>
            </div>
            <div className={`${userBalance !== BigInt(0) && `ml-[57px]`} flex items-center mt-4`}>
              <input
                type="text"
                pattern="^\d*(\.\d+)?$"
                value={withdrawAmount}
                onChange={handleWithdrawAmountChange}
                onKeyDown={handleKeyPress}
                className="peer border border-darkPurple block text-base md:text-lg appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none h-[45px] md:h-[50px] w-full rounded bg-transparent px-3 py-[0.32rem] leading-[1.6] focus:outline-none"
              />
              <button
                onClick={handleMaxAmount}
                className={clsx(
                  "py-1.5 px-2.5 rounded-2xl ml-2 transition-all",
                  userBalance !== BigInt(0) ? "hover:bg-secondary" : "hidden",
                )}
                disabled={userBalance === BigInt(0)}
              >
                MAX
              </button>
            </div>
            {withdrawError && <p className="text-red-500 text-sm my-1">{withdrawError}</p>}
            {(showSuccessMessage || showErrorMessage) && (
            <div className="fixed inset-0 z-50 backdrop-blur-xl bg-black bg-opacity-0">
              <div
                className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-xl shadow-lg z-50 
                  ${
                    showSuccessMessage
                      ? "bg-gradient-to-t from-green-700 to-black text-white min-w-[350px] max-w-[350px] sm:min-w-[440px] sm:max-w-[440px]"
                      : "bg-gradient-to-t from-red-900 to-black text-white min-w-[350px] max-w-[350px] sm:min-w-[420px] sm:max-w-[420px]"
                  }`}
              >
                <div className="flex items-center">
                  {showSuccessMessage ? (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="my-0" color="white" width={30} height={30} />
                        <p className="text-lg sm:text-xl font-bold">Withdrawal success! 🎉</p>
                      </div>
                      <p className="text-lg sm:text-xl text-center text-pretty">
                        The page will automatically update in a few moments.
                      </p>
                      <div className="flex justify-center gap-4 mt-3 mb-3">
                        <div className="relative inline-flex group">
                          <Link
                            title="Go to My NFTs"
                            href="/auctions"
                            className="relative inline-flex items-center justify-center px-8 py-4 text-sm sm:text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl outline-none z-10 active:bg-gray-700 hover:bg-gray-800 hover:scale-105"
                          >
                            Back to auctions
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
                        Error message: {`${error?.message.split(".")[0]}.` || "Unknown error"}
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
            <div className="relative inline-flex group mt-6">
              <div
                className={clsx(
                  "absolute rounded-xl blur-lg z-0 transition-all",
                  withdrawError === null &&
                    withdrawAmount !== "" &&
                    currentAccount.address &&
                    parseFloat(withdrawAmount) <= Number(formatEther(userBalance ?? 0n))
                    ? "opacity-70 -inset-px bg-gradient-to-r from-darkPurpleAlt via-darkPink to-darkPurpleAlt group-hover:opacity-100 group-hover:-inset-1 duration-500 animate-tilt"
                    : "opacity-0",
                )}
              ></div>

              <button
                title="Withdraw"
                className={clsx(
                  "relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl outline-none z-10 active:bg-gray-700",
                  {
                    "opacity-50 cursor-not-allowed":
                      withdrawError !== null ||
                      withdrawAmount === "" ||
                      !currentAccount.address ||
                      parseFloat(withdrawAmount) > Number(formatEther(userBalance ?? 0n)),
                    "hover:bg-gray-800 hover:scale-105":
                      withdrawError === null &&
                      withdrawAmount !== "" &&
                      currentAccount.address &&
                      parseFloat(withdrawAmount) <= Number(formatEther(userBalance ?? 0n)),
                  },
                )}
                disabled={
                  withdrawError !== null ||
                  withdrawAmount === "" ||
                  !currentAccount.address ||
                  parseFloat(withdrawAmount) > Number(formatEther(userBalance ?? 0n))
                }
                onClick={handleWithdraw}
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Withdraw;
