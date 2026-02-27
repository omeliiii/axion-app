"use client";

import { useTranslation } from "@/app/i18n/client";
import { ReactIcon } from "@/components/misc/react-icon";
import { LeagueButton } from "@/components/cards/league/league-button";
import { LeagueCountdown } from "@/components/cards/league/league-countdown";

interface SecondaryLeagueCardMandatoryProps {
  lng: string;
  leagueId: string;
  leagueName: string;
  leagueDescription: string;
  leagueEndDate: Date;
  partnerships: string[];
  leagueEstimatedPrize: string;
}

interface SecondaryLeagueCardOptionalProps {}

export type SecondaryLeagueCardProps = SecondaryLeagueCardMandatoryProps &
  Partial<SecondaryLeagueCardOptionalProps>;

export const SecondaryLeagueCard = ({
  lng,
  leagueId,
  leagueName,
  leagueDescription,
  leagueEndDate,
  partnerships,
  leagueEstimatedPrize,
}: SecondaryLeagueCardProps) => {
  return (
    <div
      className={
        "lg:w-[48rem] py-8 lg:py-20 px-12 grid grid-flow-col justify-between gap-y-2 grid-cols-1 lg:grid-cols-[70%,max-content] grid-rows-[repeat(5,max-content)] lg:grid-rows-[repeat(3,max-content)] items-start rounded-lg bg-baseline-tertiary bg-opacity-40"
      }
    >
      <span
        className={
          "text-baseline-secondary text-4xl lg:text-6.5xl font-manrope font-extrabold uppercase leading-8 lg:leading-15.2 w-48 lg:w-auto inline-block break-words line-clamp-2 overflow-ellipsis"
        }
      >
        {leagueName}
      </span>
      <span
        className={
          "text-baseline-neutral-white text-sm lg:text-base font-manrope leading-6 w-48 lg:w-auto inline-block break-words line-clamp-2 overflow-ellipsis"
        }
      >
        {leagueDescription}
      </span>
      <div
        className={
          "mt-1 lg:mt-7 w-96 grid col-span-2 self-center justify-self-center col-start-1 row-start-5 lg:col-start-auto lg:row-start-auto"
        }
      >
        <LeagueButton primary={false} lng={lng} leagueId={leagueId} />
      </div>

      <div className={"row-span-2 flex flex-col h-full gap-8 lg:items-end"}>
        <LeagueEnds lng={lng} leagueEndDate={leagueEndDate} />
        <EstimatedPrize lng={lng} leagueEstimatedPrize={leagueEstimatedPrize} />
        <Partnership lng={lng} partnerships={partnerships} />
      </div>
    </div>
  );
};

interface LeagueEndsProps {
  lng: string;
  leagueEndDate: Date;
}

const LeagueEnds = ({ lng, leagueEndDate }: LeagueEndsProps) => {
  const { t } = useTranslation(lng, "leagues");

  return (
    <div
      className={
        "grid grid-flow-row gap-x-2 grid-cols-[max-content,max-content] grid-rows-[max-content,max-content] lg:justify-items-end"
      }
    >
      <ReactIcon
        iconPath={"/icons/essentials/clock.svg"}
        className={"stroke-baseline-neutral-white w-6 h-6"}
      />
      <span className={"text-baseline-neutral-white leading-5 font-manrope"}>
        {t("league_ends" as any)}
      </span>
      <div className={"col-span-2"}>
        <LeagueCountdown
          primary={false}
          lng={lng}
          leagueEndDate={leagueEndDate}
        />
      </div>
    </div>
  );
};

interface EstimatedPrizeProps {
  lng: string;
  leagueEstimatedPrize: string;
}

const EstimatedPrize = ({ lng, leagueEstimatedPrize }: EstimatedPrizeProps) => {
  const { t } = useTranslation(lng, "leagues");

  return (
    <div
      className={
        "grid grid-flow-row gap-x-2 grid-cols-[max-content,max-content] grid-rows-[max-content,max-content] lg:justify-items-end"
      }
    >
      <ReactIcon
        iconPath={"/icons/finance/money-stack.svg"}
        className={"stroke-baseline-neutral-white w-6 h-6"}
      />
      <span className={"text-baseline-neutral-white leading-5 font-manrope"}>
        {t("estimated_prize" as any)}
      </span>
      <div className={"col-span-2"}>
        <span
          className={
            "text-baseline-secondary text-2xl font-manrope font-medium leading-10"
          }
        >
          {leagueEstimatedPrize}
        </span>
      </div>
    </div>
  );
};

interface PartnershipProps {
  lng: string;
  partnerships: string[];
}

const Partnership = ({ lng, partnerships }: PartnershipProps) => {
  const { t } = useTranslation(lng, "leagues");

  return (
    <div className={"flex flex-col gap-2 lg:items-end"}>
      <span className={"text-baseline-neutral-white leading-6 font-manrope"}>
        {t("partnership_with" as any)}
      </span>

      <div className={"flex flex-row items-center gap-6 lg:justify-items-end"}>
        {partnerships.map((partnership, i) => (
          <div key={i} className={"flex flex-row gap-0.5 items-center"}>
            <ReactIcon
              iconPath={"/partners/" + partnership.toLowerCase() + ".svg"}
              className={"w-8 h-8"}
            />
            <span
              className={
                "text-baseline-neutral-white text-sm font-manrope font-light"
              }
            >
              {partnership}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
