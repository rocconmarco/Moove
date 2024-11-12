"use client"

import styles from "./NFTs.module.css";
import type { NextPage } from "next";
import CountdownTimer from "~~/components/CountdownTimer";
import InfoIcon from "~~/components/InfoIcon";

const NFTs: NextPage = () => {
  return (
    <>
      <div className="relative min-h-screen w-full">
        <div className="relative z-10 flex flex-col items-center justify-center space-x-10 space-y-4 flex-grow pt-8 px-40">
          <div className="h-[350px] flex space-x-10">
            <div>
              <div className={styles.nftWrapper}>
                <div className={styles.img}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <img className={styles.nft} src="/nft-images/boat.jpg" alt="NFT Image" />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-start justify-start w-[400px]">
                <p className="font-bold text-3xl mb-0">Boat</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-xl mt-0 mb-0 tracking-wide">Starting price:</p>
                  <p className="text-xl mt-0 mb-0 tracking-wide text-lightPurple font-bold">1ETH</p>
                  <InfoIcon text="The starting price for the auction." />
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-xl mt-0 mb-0 tracking-wide">Minimum bid increment:</p>
                  <p className="text-xl mt-0 mb-0 tracking-wide text-lightPurple font-bold">0.5ETH</p>
                  <div className="">
                  <InfoIcon text="The minimum amount you need to increase your bid by." />
                  </div>
                  
                </div>
                <p className="text-xl mb-0 tracking-wide">
                  Current highest bid: <span className="text-lightPurple font-bold">1.5ETH</span>
                </p>
              </div>

              <div className="flex flex-col items-start justify-center space-y-2 w-[400px]">
                <div className="flex items-center space-x-4 relative mb-3">
                  <input
                    type="number"
                    className="peer border border-darkPurple block text-lg appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none h-[50px] w-full rounded bg-transparent px-3 py-[0.32rem] leading-[1.6] focus:outline-none"
                    placeholder=""
                  />
                  <p className="text-lg text-lightPurple font-bold">ETH</p>
                </div>
                <div className="relative inline-flex group">
                  <div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-darkPurpleAlt via-darkPink to-darkPurpleAlt rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
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
            <CountdownTimer targetDate="2024-12-31T23:59:59" />
          </div>
        </div>
      </div>
    </>
  );
};

export default NFTs;