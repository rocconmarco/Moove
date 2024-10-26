"use client";

import { useEffect } from "react";
import styles from "./StarryBackground.module.css";

export const StarryBackground = () => {
  useEffect(() => {
    function createRandomStar() {
      const star = document.createElement("div");
      star.className = styles["random-star"];
      star.style.left = Math.random() * window.innerWidth + "px";
      star.style.top = "0";

      const duration = 10 + Math.random() * 4;
      star.style.setProperty("--fall-duration", `${duration}s`);

      const container = document.querySelector(`.${styles["bg-stars"]}`);
      if (container) {
        container.appendChild(star);
        
        setTimeout(() => {
          if (star.parentNode === container) {
            star.remove();
          }
        }, duration * 1000);
      }
    }

    for (let i = 0; i < 10; i++) {
      createRandomStar();
    }

    const interval = setInterval(createRandomStar, 300);

    return () => {
      clearInterval(interval);
      const container = document.querySelector(`.${styles["bg-stars"]}`);
      const stars = container?.getElementsByClassName(styles["random-star"]);
      if (stars) {
        Array.from(stars).forEach(star => star.remove());
      }
    };
  }, []);

  return (
    <div className={`${styles["bg-stars"]} fixed inset-0`}></div>
  );
};