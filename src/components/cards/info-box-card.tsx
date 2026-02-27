import React from "react";
import clsx from "clsx";
import { ReactIcon } from "@/components/misc/react-icon";

interface InfoBoxCardMandatoryProps {
  titleIconPath: string;
  title: string;
  content: string;
}

interface InfoBoxCardOptionalProps {
  background: boolean;
  contentIconPath: string;
  contentIconSize: "sm" | "lg";
  contentSize: "sm" | "lg";
  forceRow: boolean;
}

export type InfoBoxCardProps = InfoBoxCardMandatoryProps &
  Partial<InfoBoxCardOptionalProps>;

export const InfoBoxCard = ({
  background = false,
  titleIconPath,
  title,
  contentIconPath,
  contentIconSize = "sm",
  content,
  contentSize = "lg",
  forceRow,
}: InfoBoxCardProps) => {
  const containerClass = clsx(
    "grid w-full lg:inline-grid" as any,
    { "p-8 rounded-lg bg-baseline-tertiary bg-opacity-40": background } as any,
  );

  const innerClass = clsx(
    "grid lg:grid-cols-[min-content,max-content] lg:grid-rows-[min-content,min-content] lg:grid-flow-row items-center lg:justify-items-start lg:gap-x-2" as any,
    {
      "lg:gap-y-2": contentSize == "lg",
      "grid-flow-col grid-cols-1 grid-rows-[repeat(3,min-content)] justify-items-center":
        !forceRow,
      "grid-flow-row grid-cols-[min-content,max-content] grid-rows-[min-content,min-content] gap-x-2 justify-items-start":
        forceRow,
    } as any,
  );

  const contentIconClass = clsx({
    "w-6 h-6": contentIconSize === "sm",
    "w-14 h-14": contentIconSize === "lg",
  } as any);

  const contentLabelClass = clsx(
    "text-baseline-secondary font-manrope font-light" as any,
    {
      "text-2.5xl lg:text-5xl leading-19.2":
        titleIconPath && contentSize == "lg",
      "text-xl leading-10 lg:col-span-2": !titleIconPath && contentSize == "lg",
      "lg:text-xl leading-5 lg:col-span-2": contentSize == "sm",
      "lg:col-span-2": !contentIconPath,
      "col-span-2": forceRow,
    } as any,
  );

  return (
    <div className={containerClass}>
      <div className={innerClass}>
        {titleIconPath && (
          <ReactIcon
            iconPath={titleIconPath}
            className={"w-6 h-6 stroke-baseline-neutral-white"}
          />
        )}
        <h3 className="text-baseline-neutral-white lg:text-xl leading-10 font-manrope font-light mt-2 lg:mt-0">
          {title}
        </h3>
        {contentIconPath && (
          <ReactIcon iconPath={contentIconPath} className={contentIconClass} />
        )}
        <h4 className={contentLabelClass}>{content}</h4>
      </div>
    </div>
  );
};
