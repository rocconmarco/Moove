import { useEffect, useState } from "react";
import styles from "./NFTImage.module.css";

const NFTImage = ({ tokenURI }: { tokenURI: string }) => {
  const [NFTImage, setNFTImage] = useState<string>("/nft-placeholder.jpg");

  useEffect(() => {
    setNFTImage("/nft-placeholder.jpg");

    if (!tokenURI || !tokenURI.startsWith("ipfs://")) {
      setNFTImage("/nft-placeholder.jpg");
      return;
    }

    const fetchTokenMetadata = async () => {
      try {
        const cidAndPath = tokenURI.replace("ipfs://", "");
        const [cid, ...path] = cidAndPath.split("/");

        if (!cid) {
          /* console.error("Invalid IPFS URI format"); */
          setNFTImage("Invalid URI format");
          return;
        }

        const url = `https://${cid}.ipfs.w3s.link/${path.join("/")}`;
        /* console.log("Fetching from URL:", url); */

        const response = await fetch(url);
        if (!response.ok) {
          console.error("HTTP Error:", response.status);
          setNFTImage(`Error: ${response.status}`);
          return;
        }

        const text = await response.text();

        let metadata;
        try {
          metadata = JSON.parse(text);
        } catch (e) {
          /* console.error("JSON Parse Error:", e); */
          setNFTImage("Invalid metadata format");
          return;
        }

        if (!metadata || typeof metadata !== "object") {
          setNFTImage("Invalid metadata structure");
          return;
        }

        const imageIpfsAddress = metadata?.image;
        const imageCidAndPath = imageIpfsAddress.replace("ipfs://", "");
        const [imageCid, ...imagePath] = imageCidAndPath.split("/");
        const imageUrl = `https://${imageCid}.ipfs.w3s.link/${imagePath.join("/")}`;

        if (imageUrl) {
          setNFTImage(imageUrl);
        } else {
          setNFTImage("/nft-placeholder.jpg");
        }
      } catch (error) {
        /* console.error("Error in fetchTokenMetadata:", error); */
        setNFTImage("/nft-placeholder.jpg");
      }
    };

    const timeoutId = setTimeout(() => {
      fetchTokenMetadata();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [tokenURI]);

  return (
    <div className={styles.nftWrapper}>
      <div className={styles.img}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <img className={styles.nft} src={NFTImage} alt="NFT Image" />
      </div>
    </div>
  );
};

export default NFTImage;
