import Link from "next/link";
import { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "404 - Page Not Found",
  description: "Get your pass to the future of sustainable mobility.",
});

const NotFound: NextPage = () => {
  return (
    <div className="relative z-10 min-h-screen -mt-[64px] flex flex-col items-center justify-center flex-grow pt-8">
      <div className="w-[300px] md:w-[390px]">
        <img alt="MOOVE Logo" src="/logo.png" />
      </div>
      <p className="texl-lg md:text-xl font-bold mb-8">404 - Page Not Found</p>

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
          title="Back to home"
          href="/"
          className="
                        relative inline-flex items-center justify-center 
                        px-8 py-4 text-lg font-bold text-white 
                        transition-all duration-200 bg-gray-900 
                        font-pj rounded-xl outline-none z-10 
                       active:bg-gray-700 hover:bg-gray-800 hover:scale-105
                      "
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
