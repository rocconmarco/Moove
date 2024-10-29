"use client";

import Link from "next/link";
import styles from "./HomePage.module.css";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ImageSlider } from "~~/components/ImageSlider";
import { Address } from "~~/components/scaffold-eth";
import { CardsFan } from "~~/components/CardsFan";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="relative min-h-screen w-full">
      <div className="relative z-10 flex items-center flex-col flex-grow pt-8">
        <div className="px-5">
          <h1 className={`${styles.title} text-center`}>
            <span className="block text-5xl mb-2 text-white shadow-inner">Get your pass to the future of</span>
            <span className="block text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-gray-600 drop-shadow-[0_10px_8px_rgba(0,0,0,0.8)] pb-2">
              sustainable mobility
            </span>
          </h1>

          <div>
            <ImageSlider />
          </div>
        </div>

        <div className="flex w-full px-20 my-5 h-[600px]">
          <div className={`${styles.description} opacity-0 flex flex-col w-1/2 pt-4`}>
            <h2>
              <span className="block text-5xl mb-2 text-white shadow-inner">Moove your way</span>
              <span className="block text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-gray-600 drop-shadow-[0_10px_8px_rgba(0,0,0,0.8)] pb-2">
                into the city
              </span>
            </h2>
            <p className="text-white text-lg mt-4">
              A mobility app that adapts to your day. Choose the best option for every moment and feel safe while going
              home.
            </p>
          </div>

          <div className="w-1/2 h-full">
            <img src="/3d-map/3d-map.jpg" alt="3D Map" className={`${styles.images} w-full h-full object-cover opacity-0`} />
          </div>
        </div>


        <div className="flex w-full px-20 my-40 h-[600px]">
          <div className={`${styles.description} opacity-0 flex flex-col w-1/2 pt-4`}>
            <h2>
              <span className="block text-5xl mb-2 text-white shadow-inner">Reduce the emissions,</span>
              <span className="block text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-gray-600 drop-shadow-[0_10px_8px_rgba(0,0,0,0.8)] pb-2">
                help the planet
              </span>
            </h2>
            <p className="text-white text-lg mt-4">
              Moove vehicles are 100% electric. Share your journey with a friend and you will be rewarded with a fee discount on your next ride. 
            </p>
          </div>

          <div className="w-1/2 h-full">
            <img src="/green-forest/green-forest.jpg" alt="Green Forest" className={`${styles.images} w-full h-full object-cover opacity-0`} />
          </div>

        </div>


        <div className="flex w-full px-20 my-40 h-[600px]">
          <div className={`${styles.description} opacity-0 flex flex-col w-1/2 pt-4`}>
            <h2>
              <span className="block text-5xl mb-2 text-white shadow-inner">Introducing</span>
              <span className="block text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-gray-600 drop-shadow-[0_10px_8px_rgba(0,0,0,0.8)] pb-2">
                Moove NFTs
              </span>
            </h2>
            <p className="text-white text-lg mt-4">
              Participate in public auctions and obtain your first Moove NFT. Get privileged access to vehicles and discounts on community events.
            </p>
          </div>

          <div className={`w-1/2 h-full`}>
            <CardsFan />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
