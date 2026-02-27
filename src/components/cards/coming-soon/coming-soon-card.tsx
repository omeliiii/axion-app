"use client";

import { useTranslation } from "@/app/i18n/client";
import React from "react";
import { ComingSoonButton } from "@/components/cards/coming-soon/coming-soon-button";
import { IntlFormattedFragment } from "@/components/misc/intl-formatted-fragment";

interface ComingSoonCardMandatoryProps {
  lng: string;
}

interface ComingSoonCardOptionalProps {}

export type ComingSoonCardProps = ComingSoonCardMandatoryProps &
  Partial<ComingSoonCardOptionalProps>;

export const ComingSoonCard = ({ lng }: ComingSoonCardProps) => {
  const { t } = useTranslation(lng);

  return (
    <div
      className={
        "flex flex-col items-center p-8 gap-2 rounded-lg bg-baseline-tertiary bg-opacity-40 w-full"
      }
    >
      <span
        className={
          "text-baseline-secondary text-4xl lg:text-6.5xl text-center font-manrope font-extrabold uppercase leading-15.2"
        }
      >
        {t("coming_soon" as any)}
      </span>
      <span
        className={
          "text-base text-baseline-neutral-white text-center font-manrope font-extralight leading-10"
        }
      >
        <IntlFormattedFragment text={t("make_sure_dont_miss" as any)} />
      </span>

      <div className={"flex flex-row gap-8 items-center mt-12"}>
        <ComingSoonButton type={"telegram"} />
        <ComingSoonButton type={"twitter"} />
      </div>
    </div>
  );
};
