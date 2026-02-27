import { useTranslation } from "@/app/i18n";

import { ReactIcon } from "@/components/misc/react-icon";
import { HeaderTitle } from "@/components/navigation/header/header-title";
import React from "react";
import { ClippedBackground } from "@/components/misc/clipped-background";
import { HeaderButton } from "@/components/navigation/header/header-button";
import { IntlFormattedFragment } from "@/components/misc/intl-formatted-fragment";

interface HeaderMandatoryProps {
  lng: string;
}

interface HeaderOptionalProps {}

export type HeaderProps = HeaderMandatoryProps & Partial<HeaderOptionalProps>;

export const Header = async ({ lng }: HeaderProps) => {
  const { t } = await useTranslation(lng, "navigation");

  return (
    <header
      className={
        "relative flex flex-col w-full lg:h-screen justify-center items-center gap-8 lg:gap-0"
      }
    >
      <div className={"lg:z-40 lg:absolute lg:top-0 lg:left-0 w-full"}>
        <HeaderTitle lng={lng} />
      </div>

      <div
        className={
          "relative z-10 flex flex-col items-center w-full lg:w-[52rem] bg-background-blue-gradient lg:bg-none rounded-lg xl:rounded-none p-8 lg:p-0 overflow-hidden lg:overflow-auto"
        }
      >
        <ReactIcon
          iconPath={"/logo/togyo.svg"}
          className={
            "absolute z-0 fill-baseline-neutral-black opacity-40 w-[80%] lg:w-0 top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]"
          }
        />

        <h1
          className={
            "z-10 text-baseline-neutral-white flex flex-col items-center"
          }
        >
          <span className={"me-20 md:me-28 lg:me-44 text-left"}>
            {t("dive_into_action" as any)},{" "}
          </span>
          <span
            className={
              "ms-20 md:ms-28 lg:ms-44 text-right text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6.5xl lg:font-bold leading-10 lg:leading-19.2"
            }
          >
            {t("with_axion" as any)}
          </span>
        </h1>

        <div
          className={
            "body z-10 mt-6 lg:mt-12 mb-3 lg:mb-6 lg:text-xl row-start-3 text-baseline-neutral-white text-center break-words w-full"
          }
        >
          <IntlFormattedFragment text={t("join_zero_loss" as any)} />
        </div>

        <div className={"z-10 mb-3"}>
          <HeaderButton lng={lng} />
        </div>
      </div>

      <ClippedBackground showTogyo={true} height={"screen"} />
    </header>
  );
};
