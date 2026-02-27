"use client";

import React, { useEffect, useState } from "react";
import { useBreakpoint } from "@/hooks/use-breakpoint";

export const NotFoundLabel = () => {
  const { getSize } = useBreakpoint();
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setMobile(getSize({ others: "mobile", lg: "desktop" }) == "mobile");
    };

    handleResize();

    typeof window !== "undefined" &&
      window.addEventListener("resize", handleResize);
    return () => {
      typeof window !== "undefined" &&
        window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <span
      className={
        "text-[12rem] lg:text-[40rem] text-baseline-neutral-white font-manrope font-bold leading-[12rem] lg:leading-[40rem]"
      }
    >
      {isMobile ? "404" : "4"}
    </span>
  );
};
