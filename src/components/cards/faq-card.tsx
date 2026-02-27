import React from "react";
import { ReactIcon } from "@/components/misc/react-icon";

interface FaqCardMandatoryProps {
  title: string;
  content: string;
}

interface FaqCardOptionalProps {}

export type FaqCardProps = FaqCardMandatoryProps &
  Partial<FaqCardOptionalProps>;

export const FaqCard = ({ title, content }: FaqCardProps) => {
  return (
    <div className={"relative overflow-hidden rounded-lg"}>
      <ReactIcon
        iconPath={"/backgrounds/balloons.svg"}
        className={"absolute z-0 -top-12 left-6 w-[40rem]"}
      />

      <div
        className={
          "relative z-10 grid grid-flow-col lg:grid-flow-row grid-cols-1 lg:grid-cols-2 grid-rows-[max-content,max-content] lg:grid-rows-1 px-8 py-8 lg:px-16 lg:py-20 gap-4 lg:gap-3 items-center justify-start bg-baseline-tertiary bg-opacity-40"
        }
      >
        <h2
          className={
            "text-2.5xl lg:text-6.5xl text-baseline-neutral-white font-manrope font-medium leading-8 lg:leading-19.2"
          }
        >
          {title}
        </h2>
        <h3
          className={
            "text-base lg:text-2xl text-baseline-neutral-white font-manrope font-extralight leading-6 lg:leading-10"
          }
        >
          {content}
        </h3>
      </div>
    </div>
  );
};
