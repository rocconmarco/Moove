import { useEffect, useState } from "react";
import { fetchNFTName } from "~~/utils/helper/fetchNFTName";

const NFTName = ({ tokenURI }: { tokenURI: string }) => {
  const [nftName, setNftName] = useState<string>("Loading...");

  useEffect(() => {
    setNftName("Loading...");

    const loadNFTMetadata = async () => {
      const name = await fetchNFTName(tokenURI);
      setNftName(name);
    };

    loadNFTMetadata();
  }, [tokenURI]);

  return <span className={nftName === "Loading..." ? "animate-pulse" : ""}>{nftName}</span>;
};

export default NFTName;
