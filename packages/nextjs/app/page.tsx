"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import Link from "next/link";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="relative min-h-screen w-full">
      <div className="relative z-10 flex items-center flex-col flex-grow pt-[8rem]">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-5xl mb-2 text-white shadow-inner">Get your pass to the future of</span>
            <span className="block text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-gray-600 drop-shadow-[0_10px_8px_rgba(0,0,0,0.8)] pb-2">sustainable mobility</span>
          </h1>
         {/*  <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium text-white">Connected Address:</p>
            <Address address={connectedAddress} />
          </div> */}

          {/* <p className="text-center text-lg text-white">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p> */}
          {/* <p className="text-center text-lg text-white">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p> */}
        </div>

        {/* <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row"> */}
            {/* <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div> */}
            {/* <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div> */}
          {/* </div>
        </div> */}
      </div>
    </div>
  );
};

export default Home;