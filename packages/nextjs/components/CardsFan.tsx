"use client";

import { useEffect, useState } from "react";
import styles from "./CardsFan.module.css";

export const CardsFan = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const indexesArray: [1, 2, 3, 4, 5] = [1, 2, 3, 4, 5];

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("cards-container");
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const isInView = rect.top <= window.innerHeight * 0.75;
      setIsVisible(isInView);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`${styles.cards} opacity-0 h-[400px] flex sm:items-start sm:justify-center`}>
      <div id="cards-container" className="relative mt-8 sm:mt-0 px-24 sm:px-0 w-[187.2px] h-[240px] sm:w-72 sm:h-[342px]">
        {indexesArray.map(index => (
          <div
            key={index}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`absolute w-full h-full transition-all duration-500 ease-out
              bg-gradient-to-br from-darkPurple to-darkPink
              rounded-xl shadow-xl
              transform-gpu preserve-3d
              origin-bottom 
              ${isVisible ? `translate-y-0 ${getRotation(index)}` : "translate-y-32 rotate-0"}`}
            style={{
              transformStyle: "preserve-3d",
              transform: `
                  rotateY(${isVisible ? getYRotation(index) : 0}deg)
                  rotateZ(${isVisible ? getZRotation(index) : 0}deg)
                  translateZ(${12 * index}px)
                  translateY(${
                    isVisible
                      ? hoveredCard === index
                        ? getYOffset(index) - 100
                        : getYOffset(index)
                      : 0
                  }px)
                `,
              boxShadow: hoveredCard === index 
                ? "0 20px 25px rgba(0,0,0,0.3)" 
                : "0 0 20px rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.2)",
              zIndex: index,  
            }}
          >
            <div className="absolute inset-0 border-2 border-white/10 rounded-xl" />
            {
              <div
                className="absolute h-full w-2"
                style={{
                  transform: "rotateY(90deg) translateZ(143px) translateX(-1px)",
                  transformOrigin: "right",
                }}
              />
            }
            <div
              className="absolute w-full h-2"
              style={{
                transform: "rotateX(90deg) translateZ(191px) translateY(-1px)",
                transformOrigin: "bottom",
              }}
            />
            <div className="text-white text-start px-4">
              <div className="flex justify-between items-center h-16">
                <h3 className="text-base sm:text-xl font-bold my-5">{getName(index)}</h3>
                <img src="/favicon.png" className="h-[55%] sm:h-[80%]" alt="favicon" />
              </div>

              <div className="w-full h-full">
                <img src={`/nft-images/${getName(index)}.jpg`} alt={getName(index)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

type PossibleIndexes = 1 | 2 | 3 | 4 | 5;

const getName = (index: PossibleIndexes) => {
  const names = ["Boat", "Firetruck", "Train", "Jetski", "Hoverboard"];
  return names[index - 1];
};

const getRotation = (index: PossibleIndexes) => {
  switch (index) {
    case 1:
      return "-rotate-40 -translate-x-20";
    case 2:
      return "-rotate-20 -translate-x-10";
    case 3:
      return "rotate-0 translate-x-0";
    case 4:
      return "rotate-20 translate-x-10";
    case 5:
      return "rotate-40 translate-x-20";
    default:
      return "";
  }
};

const getYRotation = (index: PossibleIndexes) => {
  const rotations = [-15, -7.5, 0, 7.5, 15];
  return rotations[index - 1];
};

const getZRotation = (index: PossibleIndexes) => {
  const rotations = [-40, -20, 0, 20, 40];
  return rotations[index - 1];
};

const getYOffset = (index: PossibleIndexes) => {
  const offsets = [-20, -10, 0, 10, 20];
  return offsets[index - 1];
};

export default CardsFan;