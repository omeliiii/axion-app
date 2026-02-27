"use client";

import clsx from "clsx";
import { ReactIcon } from "@/components/misc/react-icon";
import { IntlFormattedFragment } from "@/components/misc/intl-formatted-fragment";
import { Button } from "../buttons/button";

export interface DisclaimerProps {
  title: string;
  description: string;
  open: boolean;
  action: () => void;
  close: () => void;
  buttonText: string;
  buttonIcon: string;
}

export const Disclaimer = ({
  title,
  description,
  open,
  action,
  close,
  buttonText,
  buttonIcon,
}: DisclaimerProps) => {
  const containerStyle = clsx(
    "focus:will-change-transform backdrop-blur transition-opacity duration-200 fixed w-screen h-screen bg-baseline-neutral-light-black bg-opacity-70" as any,
    {
      "opacity-100 z-50": open,
      "opacity-0 -z-10": !open,
    } as any,
  );

  const innerStyle = clsx(
    "w-[80%] lg:w-[45rem] flex flex-col items-start bg-background-gradient rounded-lg p-8 gap-4 fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform duration-200" as any,
    {
      "scale-100": open,
      "scale-0": !open,
    } as any,
  );

  return (
    <div className={containerStyle}>
      <div className={innerStyle}>
        <div className={"flex flex-row w-full justify-between"}>
          <span
            className={
              "text-baseline-neutral-white text-2xl lg:text-3.5xl font-manrope font-medium"
            }
          >
            {title}
          </span>
          <button onClick={close}>
            <ReactIcon
              iconPath={"/icons/basics/x.svg"}
              className={"w-4 h-4 stroke-baseline-neutral-white"}
            />
          </button>
        </div>

        <span
          className={
            "text-baseline-neutral-white text-sm lg:text-lg font-manrope leading-7"
          }
        >
          <IntlFormattedFragment text={description} />
        </span>

        <div className={"self-center"}>
          <Button
            label={buttonText}
            onClick={action}
            className="button--icon-right uppercase"
          >
            <ReactIcon iconPath={buttonIcon} />
          </Button>
        </div>
      </div>
    </div>
  );
};
