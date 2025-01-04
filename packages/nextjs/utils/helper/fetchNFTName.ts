export const fetchNFTName = async (tokenURI: string): Promise<string> => {
    if (!tokenURI || !tokenURI.startsWith("ipfs://")) {
      return "Waiting for NFT data...";
    }
  
    try {
      const cidAndPath = tokenURI.replace("ipfs://", "");
      const [cid, ...path] = cidAndPath.split("/");
  
      if (!cid) {
        return "Invalid URI format";
      }
  
      const url = `https://${cid}.ipfs.w3s.link/${path.join("/")}`;
  
      const response = await fetch(url);
      if (!response.ok) {
        return `Error: ${response.status}`;
      }
  
      const text = await response.text();
  
      let metadata;
      try {
        metadata = JSON.parse(text);
      } catch {
        return "Invalid metadata format";
      }
  
      if (!metadata || typeof metadata !== "object") {
        return "Invalid metadata structure";
      }
  
      const vehicleAttribute = metadata.attributes?.find(
        (attr: { trait_type: string; value: string }) => attr.trait_type === "Vehicle"
      );
  
      if (vehicleAttribute?.value) {
        return vehicleAttribute.value;
      } else if (metadata.name) {
        return metadata.name;
      } else {
        return "Unknown NFT";
      }
    } catch {
      return "Error loading NFT";
    }
  };