import { ReactIcon } from "@/components/misc/react-icon";
import React from "react";
import clsx from "clsx";

export interface ClippedBackgroundProps {
  showTogyo: boolean;
  height: "sm" | "screen";
}

export const ClippedBackground = ({
  showTogyo,
  height,
}: ClippedBackgroundProps) => {
  const outerStyle = clsx(
    "absolute top-0 left-0 w-[100%] h-0 overflow-hidden rounded-lg" as any,
    {
      "lg:h-screen": height == "screen",
      "lg:h-96": height == "sm",
    } as any,
  );

  return (
    <div className={outerStyle}>
      <svg width="0" height="0" className={"absolute -z-50"}>
        <defs>
          <clipPath id="bg-clip" clipPathUnits="objectBoundingBox">
            <path d="M0 0.1065 C0 0.0891 0.0091 0.075 0.0204 0.075 H0.1117 C0.1230 0.075 0.1322 0.0603 0.1322 0.043 V0.0316 C0.1322 0.0141 0.1427 0 0.1526 0 H0.5322 C0.5434 0 0.5527 0.0143 0.5527 0.043 V0.0432 C0.5527 0.0602 0.5629 0.075 0.5731 0.075 H0.9797 C0.9913 0.075 1 0.0887 1 0.1065 V0.9682 C1 0.9867 0.9913 1 0.9797 1 H0.0204 C0.0091 1 0 0.9867 0 0.9682 Z" />
          </clipPath>
        </defs>
      </svg>

      <div
        className={
          "w-[100%] h-[66vw] absolute top-0 left-0 flex flex-col gap-64 justify-start items-center bg-background-blue-gradient overflow-hidden"
        }
        style={{ clipPath: "url(#bg-clip)" }}
      >
        {showTogyo && (
          <ReactIcon
            iconPath={"/logo/togyo.svg"}
            className={
              "absolute z-10 fill-baseline-neutral-black opacity-40 w-[65rem] top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]"
            }
          />
        )}
      </div>
    </div>
  );
};
