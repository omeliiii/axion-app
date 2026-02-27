import { Header } from "@/components/navigation/header/header";
import { PartnerCard } from "@/components/cards/partner-card";
import { PartnerComposite } from "@/components/composites/partner-composite";
import { useTranslation } from "@/app/i18n";
import { InfoBoxCard } from "@/components/cards/info-box-card";
import { RoadmapComposite } from "@/components/composites/roadmap/roadmap-composite";
import { RoadmapCard } from "@/components/cards/roadmap-card";
import { FaqCard } from "@/components/cards/faq-card";
import { Footer } from "@/components/navigation/footer/footer";
import React from "react";
import { TestnetDisclaimer } from "@/components/overlays/testnet-disclaimer";
import { Toast } from "@/components/overlays/toast";
import { LatestLeaguesComposite } from "@/components/composites/latest-leagues-composite";

interface HomeProps {
  params: { lng: string };
}

export default async function Home({ params: { lng } }: HomeProps) {
  const { t } = await useTranslation(lng, "home");

  return (
    <main className="flex flex-col gap-14 lg:gap-24 px-5 lg:px-32 py-8 lg:py-12 bg-baseline-neutral-light-black">
      <Header lng={lng} />

      <div className={"flex flex-col items-center gap-y-6"}>
        <h2 className={"text-baseline-neutral-white"}>
          {t("our_partners" as any)}
        </h2>

        <PartnerComposite
          cards={[
            <PartnerCard
              iconPath={"/partners/kujira.svg"}
              name={"Kujira"}
              key={0}
            />,
            <PartnerCard
              iconPath={"/partners/thorchain.svg"}
              name={"Thorchain"}
              key={1}
            />,
            <PartnerCard
              iconPath={"/partners/nami.svg"}
              name={"Nami"}
              key={2}
            />,
            <PartnerCard
              iconPath={"/partners/manta.svg"}
              name={"Manta"}
              key={3}
            />,
          ]}
        />
      </div>

      <div
        className={
          "grid grid-rows-[repeat(4,max-content)] lg:grid-rows-[max-content,max-content] grid-cols-1 lg:grid-cols-3 grid-flow-col lg:grid-flow-row gap-y-4 lg:gap-y-6 lg:gap-x-8 justify-items-center justify-between"
        }
      >
        <h2
          className={"text-baseline-neutral-white lg:col-span-3 mb-2 lg:mb-0"}
        >
          {t("on_axion" as any)}
        </h2>

        <InfoBoxCard
          background={true}
          title={t("participants" as any)}
          titleIconPath={"/icons/essentials/people.svg"}
          content={"-"}
        />

        <InfoBoxCard
          background={true}
          title={t("total_value_locked" as any)}
          titleIconPath={"/icons/finance/money-stack.svg"}
          content={"-"}
        />

        <InfoBoxCard
          background={true}
          title={t("average_win" as any)}
          titleIconPath={"/icons/finance/money.svg"}
          content={"-"}
        />
      </div>

      <div
        className={
          "flex flex-col gap-12 mt-12 items-start lg:items-center px-8 lg:px-0"
        }
        id={"how_it_works"}
      >
        <h2 className={"text-light-blue-600 text-center"}>
          {t("how_it_works" as any)}
        </h2>

        <RoadmapComposite
          cards={[
            <RoadmapCard
              key={1}
              title={t("get_entry_ticket" as any)}
              content={t("the_entry_ticket" as any)}
              iconPath={"/icons/finance/money.svg"}
            />,

            <RoadmapCard
              key={2}
              title={t("engage_earn" as any)}
              content={t("participants_earn" as any)}
              iconPath={"/icons/technology/game-controller.svg"}
            />,

            <RoadmapCard
              key={3}
              title={t("no_one_loses" as any)}
              content={t("at_the_end" as any)}
              iconPath={"/icons/essentials/donations.svg"}
            />,
          ]}
        />
      </div>

      <FaqCard
        title={t("refer_and_earn" as any)}
        content={t("invite_friends" as any)}
      />

      <LatestLeaguesComposite lng={lng} />

      <Footer lng={lng} />

      <TestnetDisclaimer lng={lng} />

      <Toast lng={lng} />
    </main>
  );
}
