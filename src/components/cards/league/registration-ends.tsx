"use client";

import { useTranslation } from "@/app/i18n/client";
import { ReactIcon } from "@/components/misc/react-icon";
import { LeagueCountdown } from "@/components/cards/league/league-countdown";
import { useLeagueStatus } from "@/hooks/use-league-status";

export interface RegistrationEndsProps {
  lng: string;
  leagueStartDate: Date;
  leagueEndDate: Date;
}

export const RegistrationEnds = ({
  lng,
  leagueStartDate,
  leagueEndDate,
}: RegistrationEndsProps) => {
  const { t } = useTranslation(lng, "leagues");
  const status = useLeagueStatus({
    startDate: leagueStartDate,
    endDate: leagueEndDate,
  });

  return (
      <div
          className={
            "grid grid-flow-row gap-x-2 grid-cols-[max-content,max-content] grid-rows-[max-content,max-content,max-content] lg:justify-items-end items-center text-baseline-neutral-white"
          }
      >
        <ReactIcon
            iconPath={"/icons/essentials/clock.svg"}
            className={"w-4 h-4 lg:w-8 lg:h-8"}
        />
        <h4
            className={
              "text-base lg:text-2xl font-manrope"
            }
        >
          {t(status == "open" ? "registration_ends" : ("league_ends" as any))}
        </h4>

        <div className={"col-span-2"}>
          {status == "not_active" || !status ? (
              <span
                  className={
                    "text-baseline-secondary font-manrope lg:font-medium leading-8 lg:leading-10 text-lg lg:text-3.5xl"
                  }
              >
            -
          </span>
          ) : (
              <LeagueCountdown
                  primary={true}
                  lng={lng}
                  leagueEndDate={status == "open" ? leagueStartDate : leagueEndDate}
              />
          )}
        </div>

        <div className={'h-0 scale-0 lg:h-auto lg:scale-100 flex flex-row gap-2 items-center col-span-2 text-gray-300'}>
          <span className={'font-manrope font-light leading-5 lg:col-span-20'}>
            {new Intl.DateTimeFormat(lng, {
              day: "numeric",
              month: "short",
            }).format(leagueStartDate)}
          </span>

          <ReactIcon iconPath={'/icons/basics/arrow-right.svg'} className={'w-4 h-4'}/>

          <span className={'font-manrope font-light leading-5 lg:col-span-2'}>
              {new Intl.DateTimeFormat(lng, {
                day: "numeric",
                month: "short",
              }).format(leagueEndDate)}
            </span>
        </div>
      </div>
  );
};
