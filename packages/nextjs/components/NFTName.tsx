import { useEffect, useState } from "react";

const NFTName = ({ tokenURI }: { tokenURI: string }) => {
  const [nftName, setNftName] = useState<string>("Loading...");

  useEffect(() => {
    setNftName("Loading...");

    if (!tokenURI || !tokenURI.startsWith("ipfs://")) {
      setNftName("Waiting for NFT data...");
      return;
    }

    const fetchTokenMetadata = async () => {
      try {
        const cidAndPath = tokenURI.replace("ipfs://", "");
        const [cid, ...path] = cidAndPath.split("/");

        if (!cid) {
          setNftName("Invalid URI format");
          return;
        }

        const url = `https://${cid}.ipfs.w3s.link/${path.join("/")}`;

        const response = await fetch(url);
        if (!response.ok) {
          setNftName(`Error: ${response.status}`);
          return;
        }

        const text = await response.text();

        let metadata;
        try {
          metadata = JSON.parse(text);
        } catch (e) {
          setNftName("Invalid metadata format");
          return;
        }

        if (!metadata || typeof metadata !== "object") {
          setNftName("Invalid metadata structure");
          return;
        }

        const vehicleAttribute = metadata.attributes?.find(
          (attr: { trait_type: string; value: string }) => attr.trait_type === "Vehicle",
        );

        if (vehicleAttribute?.value) {
          setNftName(vehicleAttribute.value);
        } else if (metadata.name) {
          setNftName(metadata.name);
        } else {
          setNftName("Unknown Vehicle");
        }
      } catch (error) {
        setNftName("Error loading vehicle");
      }
    };

    const timeoutId = setTimeout(() => {
      fetchTokenMetadata();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [tokenURI]);

  return <span className={nftName === "Loading..." ? "animate-pulse" : ""}>{nftName}</span>;
};

export default NFTName;
