import { useEffect, useState } from "react";
import styles from "./NFTImage.module.css";
import { fetchNFTImage } from "~~/utils/helper/fetchNFTImage";

const NFTImage = ({ tokenURI }: { tokenURI: string }) => {
  const [NFTImage, setNFTImage] = useState<string>("/nft-placeholder.jpg");

  useEffect(() => {
    const loadNFTImage = async () => {
      const image = await fetchNFTImage(tokenURI);
      setNFTImage(image);
    };

    loadNFTImage();
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
