import { useState, useEffect } from "react";

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
          /* console.error("Invalid IPFS URI format"); */
          setNftName("Invalid URI format");
          return;
        }

        const url = `https://${cid}.ipfs.w3s.link/${path.join("/")}`;
        /* console.log("Fetching from URL:", url); */
        
        const response = await fetch(url);
        if (!response.ok) {
          /* console.error("HTTP Error:", response.status); */
          setNftName(`Error: ${response.status}`);
          return;
        }
        
        const text = await response.text();
        
        let metadata;
        try {
          metadata = JSON.parse(text);
        } catch (e) {
          /* console.error("JSON Parse Error:", e); */
          setNftName("Invalid metadata format");
          return;
        }

        
        if (!metadata || typeof metadata !== 'object') {
          setNftName("Invalid metadata structure");
          return;
        }

        const vehicleAttribute = metadata.attributes?.find(
          (attr: { trait_type: string; value: string }) => 
            attr.trait_type === "Vehicle"
        );

        if (vehicleAttribute?.value) {
          setNftName(vehicleAttribute.value);
        } else if (metadata.name) {
          setNftName(metadata.name);
        } else {
          setNftName("Unknown Vehicle");
        }
      } catch (error) {
        /* console.error("Error in fetchTokenMetadata:", error); */
        setNftName("Error loading vehicle");
      }
    };

    const timeoutId = setTimeout(() => {
      fetchTokenMetadata();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [tokenURI]);

  return (
    <span className={nftName === "Loading..." ? "animate-pulse" : ""}>
      {nftName}
    </span>
  );
};

export default NFTName;