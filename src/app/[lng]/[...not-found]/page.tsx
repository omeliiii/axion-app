import { Footer } from "@/components/navigation/footer/footer";
import React from "react";
import { HeaderTitle } from "@/components/navigation/header/header-title";
import { useTranslation } from "@/app/i18n";
import { NotFoundButton } from "@/app/[lng]/[...not-found]/not-found-button";
import { NotFoundLabel } from "@/app/[lng]/[...not-found]/not-found-label";
import { ClippedBackground } from "@/components/misc/clipped-background";
import { Toast } from "@/components/overlays/toast";

interface NotFoundProps {
  params: { lng: string };
}

const NotFound = async ({ params: { lng } }: NotFoundProps) => {
  const { t } = await useTranslation(lng, "notfound");

  return (
    <main className="flex flex-col gap-14 lg:gap-24 px-5 lg:px-32 py-4 lg:py-12 bg-baseline-neutral-light-black">
      <header
        className={
          "relative w-[100%] lg:h-screen lg:px-14 flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-0"
        }
      >
        <div className={"lg:z-40 lg:absolute lg:top-0 lg:left-0 w-full"}>
          <HeaderTitle lng={lng} />
        </div>

        <div
          className={
            "z-10 flex flex-col lg:flex-row justify-center items-center bg-background-blue-gradient lg:bg-none py-8 px-4 lg:px-0 lg:py-0 gap-8 lg:gap-0 rounded-lg lg:rounded-none"
          }
        >
          <NotFoundLabel />

          <div
            className={
              "bg-baseline-neutral-white rounded-2xl flex flex-col items-start gap-2 lg:gap-0 lg:justify-between lg:h-[30rem] p-8"
            }
          >
            <span
              className={
                "text-2xl lg:text-5xl text-baseline-neutral-black font-manrope font-semibold lg:font-medium leading-7 lg:leading-15.2 w-96 lg:w-96"
              }
            >
              {t("cant_find_page" as any)}
            </span>
            <span
              className={
                "text-sm lg:text-lg text-baseline-neutral-black font-manrope font-normal lg:font-light leading-5 lg:leading-7 mt-2 mb-2 lg:mt-0 lg:mb-0"
              }
            >
              {t("something_may_like" as any)}:
            </span>

            <NotFoundButton lng={lng} type={"home"} />
            <NotFoundButton lng={lng} type={"how_it_works"} />
            <NotFoundButton lng={lng} type={"leagues"} />
          </div>

          <span
            className={
              "hidden lg:block text-[40rem] text-baseline-neutral-white font-manrope font-bold"
            }
          >
            4
          </span>
        </div>

        <ClippedBackground showTogyo={false} height={"screen"} />
      </header>

      <Footer lng={lng} />

      <Toast lng={lng} />
    </main>
  );
};

export default NotFound;
