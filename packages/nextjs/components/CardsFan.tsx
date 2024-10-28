"use client";

import { useEffect, useState } from "react";

export const CardsFan = () => {
  const [isVisible, setIsVisible] = useState(false);
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
    <div className="h-screen flex items-center justify-center">
      <div id="cards-container" className="relative w-72 h-[342px]">
        {indexesArray.map(index => (
          <div
            key={index}
            className={`absolute w-full h-full transition-all duration-1000 ease-out
              bg-gradient-to-br from-darkPurple to-darkPink
              rounded-xl shadow-xl
              transform-gpu preserve-3d
              origin-bottom ${isVisible ? `translate-y-0 ${getRotation(index)}` : "translate-y-32 rotate-0"}`}
            style={{
              transformStyle: "preserve-3d",
              transform: `
                  rotateY(${isVisible ? getYRotation(index) : 0}deg)
                  rotateZ(${isVisible ? getZRotation(index) : 0}deg)
                  translateZ(${12 * index}px)
                  translateY(${isVisible ? getYOffset(index) : 0}px)
                `,
              boxShadow: "0 0 20px rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.2)",
              zIndex: index,
            }}
          >
            <div className="absolute inset-0 border-2 border-white/10 rounded-xl" />
            {<div
              className="absolute h-full w-2"
              style={{
                transform: "rotateY(90deg) translateZ(143px) translateX(-1px)",
                transformOrigin: "right",
              }}
            />}
            <div
              className="absolute w-full h-2"
              style={{
                transform: "rotateX(90deg) translateZ(191px) translateY(-1px)",
                transformOrigin: "bottom",
              }}
            />
            <div className="text-white text-center">
              <h3 className="text-xl font-bold my-5">{getName(index)}</h3>
              <div className="w-full h-full px-4">
                <img src={`/nft-images/${getName(index)}.jpg`}></img>
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
  const names = ["Skateboard", "Firetruck", "Scooter", "Helicopter", "Hoverboard"];
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
