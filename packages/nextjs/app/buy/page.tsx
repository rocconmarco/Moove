"use client";

import { useState } from "react";
import styles from "./Buy.module.css";
import type { NextPage } from "next";

const Buy: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNFTClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="relative min-h-screen w-full">
        {isModalOpen && (
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
              <div className="bg-white w-auto flex max-w-4xl rounded-lg shadow-lg p-8">
                <div className="flex justify-end">
                  <button className="text-gray-400 hover:text-gray-600" onClick={() => setIsModalOpen(false)}>
                    Close
                  </button>
                </div>
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
            </div>
          </div>
        )}
        <div className="relative z-10 flex flex-col items-center justify-center space-x-10 space-y-4 flex-grow pt-8 px-40">
          <div className="flex flex-col items-center justify-center space-y-0">
            <h1 className="text-3xl font-bold">Unsold NFTs</h1>
            <p>List of NFTs that received no offers in past auctions and are now available at their starting price.</p>
          </div>
          <div className="grid grid-cols-4 gap-8 mt-8">
            <div className="flex flex-col">
              <button onClick={() => handleNFTClick()}>
                <div className={styles.nftWrapper}>
                  <div className={styles.img}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <img className={styles.nft} src="/nft-images/boat.jpg" alt="NFT Image" />
                  </div>
                </div>
              </button>
              <div className="flex flex-col items-center space-y-4">
                <div className="space-y-0 flex flex-col items-center justify-center">
                  <p className="font-bold text-2xl mb-0">Boat</p>
                  <p className="text-lg tracking-wide font-bold text-lightPurple">1 ETH</p>
                </div>
                <div className="relative inline-flex group">
                  <div className="absolute transition-all duration-500 opacity-70 -inset-px bg-gradient-to-r from-darkPurpleAlt via-darkPink to-darkPurpleAlt rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
                  <a
                    href="#"
                    title="Place your bid"
                    className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    role="button"
                  >
                    Buy
                  </a>
                </div>
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
              <div className="flex flex-col items-center space-y-4">
                <div className="space-y-0 flex flex-col items-center justify-center">
                  <p className="font-bold text-2xl mb-0">Hoverboard</p>
                  <p className="text-lg tracking-wide font-bold text-lightPurple">1 ETH</p>
                </div>
                <div className="relative inline-flex group">
                  <div className="absolute transition-all duration-500 opacity-70 -inset-px bg-gradient-to-r from-darkPurpleAlt via-darkPink to-darkPurpleAlt rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
                  <a
                    href="#"
                    title="Place your bid"
                    className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    role="button"
                  >
                    Buy
                  </a>
                </div>
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
              <div className="flex flex-col items-center space-y-4">
                <div className="space-y-0 flex flex-col items-center justify-center">
                  <p className="font-bold text-2xl mb-0">Segway</p>
                  <p className="text-lg tracking-wide font-bold text-lightPurple">1 ETH</p>
                </div>
                <div className="relative inline-flex group">
                  <div className="absolute transition-all duration-500 opacity-70 -inset-px bg-gradient-to-r from-darkPurpleAlt via-darkPink to-darkPurpleAlt rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
                  <a
                    href="#"
                    title="Place your bid"
                    className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    role="button"
                  >
                    Buy
                  </a>
                </div>
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
              <div className="flex flex-col items-center space-y-4">
                <div className="space-y-0 flex flex-col items-center justify-center">
                  <p className="font-bold text-2xl mb-0">Firetruck</p>
                  <p className="text-lg tracking-wide font-bold text-lightPurple">1 ETH</p>
                </div>
                <div className="relative inline-flex group">
                  <div className="absolute transition-all duration-500 opacity-70 -inset-px bg-gradient-to-r from-darkPurpleAlt via-darkPink to-darkPurpleAlt rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
                  <a
                    href="#"
                    title="Place your bid"
                    className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    role="button"
                  >
                    Buy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Buy;
