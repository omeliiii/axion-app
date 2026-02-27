"use client";

import { Parallax } from "react-scroll-parallax";
import { ReactIcon } from "@/components/misc/react-icon";

export const RoadmapBackground = () => {
  const balls = [];
  for (let i = 0; i < 70; i++) {
    const negativeFactor = Math.random() < 0.5 ? -1 : 1;

    balls.push({
      top: Math.random() * 110 * negativeFactor + "%",
      left: Math.random() * 95 + "%",
      width: Math.random() * 3 + 1 + "rem",
      height: Math.random() * 3 + 1 + "rem",
    });
  }

  return (
    <Parallax
      className={"absolute h-[200vh] w-full z-0"}
      rotate={["0deg", "45deg"]}
      speed={100}
      easing={"easeInOut"}
    >
      {balls.map((ball, i) => (
        <ReactIcon
          iconPath={"/backgrounds/ball.svg"}
          key={i}
          className={"absolute"}
          style={{
            top: ball.top,
            left: ball.left,
            width: ball.width,
            height: ball.height,
          }}
        />
      ))}
    </Parallax>
  );
};
