"use client";

import { Button } from "@/components/buttons/button";
import { ReactIcon } from "@/components/misc/react-icon";
import clsx from "clsx";
import { ElementType } from "react";

export type ComingSoonButtonType = "twitter" | "telegram";

interface ComingSoonButtonMandatoryProps {
  type: ComingSoonButtonType;
}

interface ComingSoonButtonOptionalProps {}

export type ComingSoonButtonProps = ComingSoonButtonMandatoryProps &
  Partial<ComingSoonButtonOptionalProps>;

const links = {
  twitter: {
    icon: "/social/twitter-x.svg",
    callback: () => {
      typeof window !== "undefined" &&
        window.open("https://x.com/AxionLeagues", "_blank");
    },
  },
  telegram: {
    icon: "/social/telegram.svg",
    callback: () => {
      typeof window !== "undefined" &&
        window.open("https://t.me/AxionLeagues", "_blank");
    },
  },
};

export const ComingSoonButton = ({ type }: ComingSoonButtonProps) => {
  const link = links[type];
  return (
    <Button
      as={"a" as ElementType}
      onClick={link.callback}
      className={"button--icon button--big"}
    >
      <ReactIcon iconPath={link.icon} className={"w-6 h-6"} />
    </Button>
  );
};
