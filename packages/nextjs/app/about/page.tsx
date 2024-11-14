"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./About.module.css";
import type { NextPage } from "next";

const MyNFTs: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNFTClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="relative z-10 min-h-screen -mt-[64px] flex flex-col items-center justify-center space-x-10 space-y-4 flex-grow pt-8 px-40">
        <div className="flex flex-col items-center justify-center space-y-0 ">
          <Image alt="Moove logo" className={`${styles.title} opacity-0`} width={400} height={75} src="/logo.png" />
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center space-y-4 flex-grow pt-8 px-72 border border-red-300">
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consectetur unde architecto eum quo enim tempora ad
          dolores excepturi, quidem, praesentium nobis asperiores delectus. Ea, rerum numquam atque temporibus, saepe
          vel fuga reiciendis quae quos hic nobis nam maiores, totam eveniet exercitationem. Provident rerum sequi ut
          saepe dignissimos, porro deserunt est amet magnam ducimus. Similique molestiae necessitatibus aperiam cum
          nihil neque quasi qui aliquam hic minus sunt itaque aspernatur iure impedit magni recusandae voluptate
          repellendus velit fugit quia consequatur exercitationem tenetur, in maiores. Illum fugiat unde eius eaque
          vitae perferendis accusamus vel minima ullam consectetur facilis voluptate, totam ipsam repellat quasi!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consectetur unde architecto eum quo enim tempora ad
          dolores excepturi, quidem, praesentium nobis asperiores delectus. Ea, rerum numquam atque temporibus, saepe
          vel fuga reiciendis quae quos hic nobis nam maiores, totam eveniet exercitationem. Provident rerum sequi ut
          saepe dignissimos, porro deserunt est amet magnam ducimus. Similique molestiae necessitatibus aperiam cum
          nihil neque quasi qui aliquam hic minus sunt itaque aspernatur iure impedit magni recusandae voluptate
          repellendus velit fugit quia consequatur exercitationem tenetur, in maiores. Illum fugiat unde eius eaque
          vitae perferendis accusamus vel minima ullam consectetur facilis voluptate, totam ipsam repellat quasi!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consectetur unde architecto eum quo enim tempora ad
          dolores excepturi, quidem, praesentium nobis asperiores delectus. Ea, rerum numquam atque temporibus, saepe
          vel fuga reiciendis quae quos hic nobis nam maiores, totam eveniet exercitationem. Provident rerum sequi ut
          saepe dignissimos, porro deserunt est amet magnam ducimus. Similique molestiae necessitatibus aperiam cum
          nihil neque quasi qui aliquam hic minus sunt itaque aspernatur iure impedit magni recusandae voluptate
          repellendus velit fugit quia consequatur exercitationem tenetur, in maiores. Illum fugiat unde eius eaque
          vitae perferendis accusamus vel minima ullam consectetur facilis voluptate, totam ipsam repellat quasi!
        </p>
      </div>
    </>
  );
};

export default MyNFTs;
