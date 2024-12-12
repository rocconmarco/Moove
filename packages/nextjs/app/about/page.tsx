"use client";

import Image from "next/image";
import styles from "./About.module.css";
import type { NextPage } from "next";

const About: NextPage = () => {
  return (
    <>
      <div className="relative z-10 min-h-screen -mt-[64px] flex flex-col items-center justify-center space-x-10 space-y-4 flex-grow pt-8 px-40">
        <div className="flex flex-col items-center justify-center space-y-0 w-[300px] sm:w-[400px]">
          <Image alt="Moove logo" className={`${styles.title} opacity-0`} width={400} height={75} src="/logo.png" />
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center space-y-4 flex-grow pt-8 px-8 sm:px-16 md:px-32 lg:px-56 xl:px-72">
        <p className="text-base mb-0">
          MOOVE is a blockchain-based auction platform and NFT marketplace created by Marco Roccon as part of the final
          project for the Master in Blockchain Development at start2impact University.
        </p>
        <p className="text-base">
          The platform is fully functional, allowing users to bid for a chance to obtain unique NFTs from the MOOVE
          collection. Each auction lasts 30 days, after which the highest bidder wins the NFT. If no bids are placed by
          the end of an auction, the NFT is marked as &quot;unsold&quot; and becomes available in the &quot;Buy&quot;
          section at its starting price.
        </p>
        <p className="text-base">
          Both the auction process and the marketplace are fully managed by smart contracts developed in Solidity and
          deployed on the Sepolia testnet. Users can connect a web3 wallet to interact with the platform and view their
          NFTs in the &quot;MyNFTs&quot; section.
        </p>
        <p className="text-base">
          The platform&apos;s design is entirely created by the author and aligns with the futuristic aesthetic commonly
          adopted by designers in the web3 space.
        </p>
        <p className="text-base">
          MOOVE is open to everyone for testing and interaction. The minting mechanisms have been successfully
          implemented and tested, ensuring that anyone has a real chance to win one of the 13 unique NFTs in the
          collection.
        </p>
        <p className="text-base">
          This project has been a tough challenge, but through perseverance, I turned every mistake into a learning
          opportunity, which ultimately made me a better developer. Each difficulty I faced became a strength and laid
          the foundation for further growth in my skillset.
        </p>
        <div className="flex flex-col items-center justify-center w-[200px] h-[80px]">
          <p className="text-lg font-bold mt-16">Marco Roccon</p>
          <Image
            alt="Marco Roccon signature"
            className="-mt-6"
            layout="intrinsic"
            width={200}
            height={80}
            src="/firma.svg"
          />
        </div>
      </div>
      <div className="relative z-10 min-h-screen mt-14 flex flex-col items-center justify-center space-x-10 space-y-4 flex-grow pt-8 px-40">
        <div className="flex flex-col md:flex-row items-center justify-center space-x-2 ">
          <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px]">
            <Image
              alt="Marco Roccon logo"
              className={`${styles.title} opacity-0`}
              width={200}
              height={200}
              src="/LogoPNG.png"
            />
          </div>
          <div className="flex items-center justify-center w-[150px] h-[37.5px] md:w-[50px] md:h-[200px] pr-0 md:pr-10 pt-10 md:pt-0">
            <p className="text-xl text-center font-bold">X</p>
          </div>
          <div className="flex object-cover items-center justify-center w-[280px] h-[140px] md:w-[400px] md:h-[200px]">
            <Image
              alt="start2impact logo"
              className={`${styles.title} opacity-0`}
              width={400}
              height={75}
              src="/s2i-logo.png"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
