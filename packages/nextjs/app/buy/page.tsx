"use client";

import styles from "./Buy.module.css";
import type { NextPage } from "next";

const Buy: NextPage = () => {
  return (
    <>
      <div className="relative min-h-screen w-full">
        <div className="relative z-10 flex flex-col items-center justify-center space-x-10 space-y-4 flex-grow pt-8 px-40">
          <h1 className="text-3xl font-bold">Unsold NFTs</h1>
          <p>List of NFTs that received no offers in past auctions and are now available at their starting price.</p>
          <div className="grid grid-cols-4 gap-8 mt-8">
            <div className="flex flex-col">
              <div className={styles.nftWrapper}>
                <div className={styles.img}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <img className={styles.nft} src="/nft-images/boat.jpg" alt="NFT Image" />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-0">
                <p className="font-bold text-2xl mb-0">Boat</p>
                <p className="text-lg tracking-wide font-bold text-lightPurple">1 ETH</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className={styles.nftWrapper}>
                <div className={styles.img}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <img className={styles.nft} src="/nft-images/hoverboard.jpg" alt="NFT Image" />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-0">
                <p className="font-bold text-2xl mb-0">Hoverboard</p>
                <p className="text-lg tracking-wide font-bold text-lightPurple">1 ETH</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className={styles.nftWrapper}>
                <div className={styles.img}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <img className={styles.nft} src="/nft-images/segway.jpg" alt="NFT Image" />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-0">
                <p className="font-bold text-2xl mb-0">Segway</p>
                <p className="text-lg tracking-wide font-bold text-lightPurple">1 ETH</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className={styles.nftWrapper}>
                <div className={styles.img}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <img className={styles.nft} src="/nft-images/firetruck.jpg" alt="NFT Image" />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-0">
                <p className="font-bold text-2xl mb-0">Firetruck</p>
                <p className="text-lg tracking-wide font-bold text-lightPurple">1 ETH</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Buy;
