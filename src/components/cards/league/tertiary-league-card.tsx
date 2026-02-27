"use client";

import { useTranslation } from "@/app/i18n/client";
import { ReactIcon } from "@/components/misc/react-icon";
import { LeagueButton } from "@/components/cards/league/league-button";

interface TertiaryLeagueCardMandatoryProps {
  lng: string;
  leagueId: string;
  leagueName: string;
  leagueDescription: string;
  leagueStartDate: Date;
  leagueEndDate: Date;
  leagueEstimatedPrize: string;
}

interface TertiaryLeagueCardOptionalProps {}

export type TertiaryLeagueCardProps = TertiaryLeagueCardMandatoryProps &
  Partial<TertiaryLeagueCardOptionalProps>;

export const TertiaryLeagueCard = ({
  lng,
  leagueId,
  leagueName,
  leagueDescription,
  leagueStartDate,
  leagueEndDate,
  leagueEstimatedPrize,
}: TertiaryLeagueCardProps) => {
  return (
    <div
      className={
        "w-[28rem] p-12 grid grid-flow-row justify-between justify-items-start gap-y-2 grid-cols-2 grid-rows-[max-content,max-content,max-content,max-content,max-content] items-start rounded-lg bg-baseline-tertiary bg-opacity-40"
      }
    >
      <span
        className={
          "col-span-2 text-baseline-secondary text-3.5xl font-manrope font-extrabold uppercase leading-10"
        }
      >
        {leagueName}
      </span>
      <span
        className={
          "col-span-2 text-baseline-neutral-white font-manrope leading-6"
        }
      >
        {leagueDescription}
      </span>

      <StartEndDate lng={lng} leagueDate={leagueStartDate} start={true} />
      <StartEndDate lng={lng} leagueDate={leagueEndDate} start={false} />
      <div className={"mt-2"}>
        <EstimatedPrize lng={lng} leagueEstimatedPrize={leagueEstimatedPrize} />
      </div>

      <div
        className={"mt-2 w-96 grid col-span-2 self-center justify-self-center"}
      >
        <LeagueButton primary={false} lng={lng} leagueId={leagueId} />
      </div>
    </div>
  );
};

interface StartEndDateProps {
  lng: string;
  leagueDate: Date;
  start: boolean;
}

const StartEndDate = ({ lng, leagueDate, start }: StartEndDateProps) => {
  const { t } = useTranslation(lng, "leagues");

  return (
    <div
      className={
        "grid grid-flow-row gap-x-2 grid-cols-[max-content,max-content] grid-rows-2 justify-items-start items-center"
      }
    >
      <ReactIcon
        iconPath={
          start
            ? "/icons/tasks-chat-events/calendar-tick.svg"
            : "/icons/tasks-chat-events/calendar-x.svg"
        }
        className={"stroke-baseline-neutral-white w-6 h-6"}
      />
      <span className={"text-baseline-neutral-white leading-5 font-manrope"}>
        {t(start ? "start_date" : ("end_date" as any))}
      </span>
      <div className={"col-span-2"}>
        <span
          className={
            "text-baseline-secondary font-manrope font-medium leading-7"
          }
        >
          {new Intl.DateTimeFormat(lng, {
            day: "numeric",
            month: "short",
          }).format(leagueDate)}
        </span>
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
        "grid grid-flow-row gap-x-2 grid-cols-[max-content,max-content] grid-rows-2 justify-items-start items-center"
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
