"use client";

import { Parallax, ParallaxProvider } from "react-scroll-parallax";
import { ReactIcon } from "@/components/misc/react-icon";

export const RoadmapBackground = () => {
  const balls = [];
  for (let i = 0; i < 30; i++) {
    balls.push({
      top: Math.random() * 90 + "%",
      left: Math.random() * 90 + "%",
      width: Math.random() * 3 + 1 + "rem",
      height: Math.random() * 3 + 1 + "rem",
    });
  }

  return (
    <ParallaxProvider>
      <Parallax speed={-100}>
        <div className={"absolute inset-0 z-0"}>
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
        </div>
      </Parallax>
    </ParallaxProvider>
  );
};
