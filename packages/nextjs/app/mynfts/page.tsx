"use client";

import { useState } from "react";
import styles from "./MyNFTs.module.css";
import type { NextPage } from "next";

const MyNFTs: NextPage = () => {
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
            <h1 className="text-3xl font-bold">My NFTs</h1>
            <p>All your NFTs, in one single place.</p>
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
                    <img className={styles.nft} src="/nft-images/motorbike.jpg" alt="NFT Image" />
                  </div>
                </div>
              </button>
              <div className="flex flex-col items-center space-y-4">
                <div className="space-y-0 flex flex-col items-center justify-center">
                  <p className="font-bold text-2xl mb-0">Motorbike</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyNFTs;
