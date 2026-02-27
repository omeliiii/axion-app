"use client";

import React from "react";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/buttons/button";
import { ReactIcon } from "@/components/misc/react-icon";

interface HeaderButtonMandatoryProps {
  lng: string;
}

interface HeaderButtonOptionalProps {}

export type HeaderButtonProps = HeaderButtonMandatoryProps &
  Partial<HeaderButtonOptionalProps>;

export const HeaderButton = ({ lng }: HeaderButtonProps) => {
  const { t } = useTranslation(lng, "navigation");

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    element && element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Button
      label={t("explore_open_leagues" as any)}
      onClick={() => scrollTo("leagues")}
      className="button--small md:button--normal lg:button--big button--icon-right uppercase"
    >
      <ReactIcon
        iconPath={"/icons/basics/arrow-right.svg"}
        className={"w-5 h-5"}
      />
    </Button>
  );
};
