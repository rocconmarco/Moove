export const fetchNFTImage = async (tokenURI: string): Promise<string> => {
    if (!tokenURI || !tokenURI.startsWith("ipfs://")) {
      return "/nft-placeholder.jpg";
    }
  
    try {
      const cidAndPath = tokenURI.replace("ipfs://", "");
      const [cid, ...path] = cidAndPath.split("/");
  
      if (!cid) {
        console.error("Invalid URI format");
        return "/nft-placeholder.jpg";
      }
  
      const url = `https://${cid}.ipfs.w3s.link/${path.join("/")}`;
      const response = await fetch(url);
  
      if (!response.ok) {
        console.error("HTTP Error:", response.status);
        return "/nft-placeholder.jpg";
      }
  
      const metadata = await response.json();
  
      if (!metadata || typeof metadata !== "object" || !metadata.image) {
        console.error("Invalid metadata structure or missing image");
        return "/nft-placeholder.jpg";
      }
  
      const imageIpfsAddress = metadata.image;
      const imageCidAndPath = imageIpfsAddress.replace("ipfs://", "");
      const [imageCid, ...imagePath] = imageCidAndPath.split("/");
      return `https://${imageCid}.ipfs.w3s.link/${imagePath.join("/")}`;
    } catch (error) {
      console.error("Error fetching metadata:", error);
      return "/nft-placeholder.jpg";
    }
  };