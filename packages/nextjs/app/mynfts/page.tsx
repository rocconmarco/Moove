"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useReadContract } from "wagmi";
import MyNFTImage from "~~/components/MyNFTImage";
import NFTName from "~~/components/NFTName";
import { mooveNFTContract } from "~~/contracts/contractsInfo";
import { ZERO_ADDRESS } from "~~/utils/scaffold-eth/common";

const MyNFTs: NextPage = () => {
  const baseURI = "ipfs://bafybeiaepnzx772p5dc2vxbdm6xllkevw6uxu27ncx54cvw2kuloovazcm";

  const { address } = useAccount();

  const { data: ownedNft } = useReadContract({
    ...mooveNFTContract,
    functionName: "getOwnedNFTsArray",
    args: [address ?? ZERO_ADDRESS],
  });

  return (
    <>
      <div className="relative min-h-screen w-full">
        <div className="relative z-10 flex flex-col items-center justify-center w-screen flex-grow pt-8 px-40">
          <div className="flex flex-col items-center justify-center space-y-0 w-[100vw]">
            <h1 className="text-3xl font-bold">My NFTs</h1>
            <p className="px-8 text-center">All your NFTs, in one single place.</p>
          </div>

          {!address && (
            <div className="flex flex-col items-center justify-center h-[50vh] w-screen">
              <div className="text-center text-white my-8">Connect your wallet to see your collection</div>
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
          )}

          {address && ownedNft?.length == 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] w-screen">
              <div className="text-center text-white my-8">Your NFT collection is currently empty</div>
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
              {ownedNft?.map(item => (
                <div className="flex flex-col items-center" key={item}>
                  <MyNFTImage tokenURI={`${baseURI}/${item}.json`} />
                  <div className="flex items-center justify-center space-y-4 gap-4 w-[250px]">
                    <div className="space-y-0 flex flex-col items-start justify-center">
                      <p className="font-bold text-xl md:text-2xl mb-0">
                        <NFTName tokenURI={`${baseURI}/${item}.json`} />
                      </p>
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

export default MyNFTs;
