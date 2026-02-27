import { Footer } from "@/components/navigation/footer/footer";
import React from "react";
import { useTranslation } from "@/app/i18n";
import { HeaderTitle } from "@/components/navigation/header/header-title";
import { ClippedBackground } from "@/components/misc/clipped-background";
import { Toast } from "@/components/overlays/toast";
import { IntlFormattedFragment } from "@/components/misc/intl-formatted-fragment";

interface TermsProps {
  params: { lng: string };
}

const Terms = async ({ params: { lng } }: TermsProps) => {
  const { t } = await useTranslation(lng, "terms");

  const cards = [
    { title: "introduction_title", description: "introduction_description" },
    {
      title: "participation_eligibility_title",
      description: "participation_eligibility_description",
    },
    {
      title: "league_mechanics_title",
      description: "league_mechanics_description",
    },
    { title: "fees_title", description: "fees_description" },
    { title: "suspension_title", description: "suspension_description" },
    { title: "no_investment_title", description: "no_investment_description" },
    {
      title: "risk_disclosure_title",
      description: "risk_disclosure_description",
    },
    { title: "limitation_title", description: "limitation_description" },
    {
      title: "indemnification_title",
      description: "indemnification_description",
    },
    { title: "amendments_title", description: "amendments_description" },
    { title: "governing_title", description: "governing_description" },
    { title: "contact_title", description: "contact_description" },
  ];

  return (
    <main className="relative flex flex-col gap-6 lg:gap-12 px-5 lg:px-32 py-4 lg:py-12 bg-baseline-neutral-light-black">
      <header
        className={
          "relative w-[100%] lg:h-96 lg:px-14 flex flex-col lg:flex-row gap-8 lg:gap-0 justify-center items-center"
        }
      >
        <div className={"lg:z-40 lg:absolute lg:top-0 lg:left-0 w-full"}>
          <HeaderTitle lng={lng} />
        </div>

        <div
          className={
            "flex flex-col w-full p-8 lg:p-0 h-48 lg:h-full justify-center items-start gap-2 rounded-lg bg-background-blue-gradient lg:bg-none"
          }
        >
          <span
            className={
              "z-10 text-baseline-neutral-white text-base lg:text-2xl font-manrope leading-6 lg:leading-10 uppercase"
            }
          >
            {t("understanding_our" as any)}
          </span>
          <h1
            className={
              "z-10 text-baseline-neutral-white text-4xl lg:text-7.5xl font-manrope font-semibold lg:font-medium leading-10 lg:leading-27 uppercase"
            }
          >
            {t("terms_and_conditions" as any)}
          </h1>
        </div>

        <ClippedBackground showTogyo={false} height={"sm"} />
      </header>

      <div className={"flex flex-col gap-4 lg:gap-8 w-full"}>
        {cards.map((card, i) => (
          <Card
            key={i}
            title={t(card.title as any)}
            description={t(card.description as any)}
          />
        ))}
      </div>

      <Footer lng={lng} />

      <Toast lng={lng} />
    </main>
  );
};

interface CardProps {
  title: string;
  description: string;
}

const Card = ({ title, description }: CardProps) => {
  return (
    <div
      className={
        "grid grid-flow-col lg:grid-flow-row grid-cols-1 lg:grid-cols-2 grid-rows-[max-content,max-content] lg:grid-rows-1 gap-4 lg:gap-12 items-start lg:items-center justify-center px-8 py-8 lg:px-16 lg:py-20 bg-baseline-tertiary rounded-lg"
      }
    >
      <h2
        className={
          "text-3xl lg:text-3.5xl text-baseline-neutral-white font-manrope font-semibold lg:font-medium leading-8 lg:leading-10"
        }
      >
        {title}
      </h2>
      <h3 className={"text-baseline-neutral-white font-manrope leading-6"}>
        <IntlFormattedFragment text={description} />
      </h3>
    </div>
  );
};

export default Terms;
