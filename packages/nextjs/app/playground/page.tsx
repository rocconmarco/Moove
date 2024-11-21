"use client";

import { NextPage } from "next";
import { formatEther } from "viem";
import { useContractRead } from "wagmi";
import { useContractReads } from "wagmi";
import { auctionAlphaContract, mooveNFTContract } from "~~/contracts/contractsInfo";

const Playground: NextPage = () => {
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...mooveNFTContract,
        functionName: "name",
      },
      {
        ...mooveNFTContract,
        functionName: "symbol",
      },
    ],
  });

  const { data: auction } = useContractRead({
    ...auctionAlphaContract,
    functionName: "s_auctions",
    args: [BigInt(0)],
  });

  return (
    <>
        <p>Il mio token si chiama: {data?.[0]?.result?.toString()}</p>
        <p>Il symbol del mio token è: {data?.[1]?.result?.toString()}</p>
        <p>Starting price: {formatEther(auction?.[4] ?? BigInt(0)).toString()} ETH</p>
        <p>Minimum bid increment: {formatEther(auction?.[5] ?? BigInt(0)).toString()} ETH</p>
    </>
  );
};

export default Playground;
