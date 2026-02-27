"use client";

import { ComingSoonCard } from "@/components/cards/coming-soon/coming-soon-card";
import React from "react";
import { useTranslation } from "@/app/i18n/client";
import {
  GetAllLeaguesResponse,
  GetLeagueByIdResponse,
  GetLeaguesByStatusRequest,
  useGetLeaguesByStatusQuery,
} from "@/redux/slices/leagues-slice";
import { PaginationModel } from "@/model/pagination-model";
import { PrimaryLeagueCard } from "@/components/cards/league/primary-league-card";
import { SecondaryLeagueCard } from "@/components/cards/league/secondary-league-card";
import { useAmount } from "@/hooks/use-amount";
import { TertiaryLeagueCard } from "@/components/cards/league/tertiary-league-card";

interface LatestLeaguesCompositeMandatoryProps {
  lng: string;
}

interface LatestLeaguesCompositeOptionalProps { }

export type LatestLeaguesCompositeProps = LatestLeaguesCompositeMandatoryProps &
  Partial<LatestLeaguesCompositeOptionalProps>;

export const LatestLeaguesComposite = ({
  lng,
}: LatestLeaguesCompositeProps) => {
  const { data: openLeagues = {} as GetAllLeaguesResponse } =
    useGetLeaguesByStatusQuery({
      status: "open",
      pagination: { pageSize: 1, pageIndex: 0 } as PaginationModel,
    } as GetLeaguesByStatusRequest) as unknown as { data: GetAllLeaguesResponse };
  const { data: inProgressLeagues = {} as GetAllLeaguesResponse } =
    useGetLeaguesByStatusQuery({
      status: "in_progress",
      pagination: { pageSize: 2, pageIndex: 0 } as PaginationModel,
    } as GetLeaguesByStatusRequest) as unknown as { data: GetAllLeaguesResponse };
  const { data: notActiveLeagues = {} as GetAllLeaguesResponse } =
    useGetLeaguesByStatusQuery({
      status: "not_active",
      pagination: { pageSize: 5, pageIndex: 0 } as PaginationModel,
    } as GetLeaguesByStatusRequest) as unknown as { data: GetAllLeaguesResponse };

  return (
    <div id={"leagues"}>
      {openLeagues?.total > 0 ||
        inProgressLeagues?.total > 0 ||
        notActiveLeagues.total > 0 ? (
        <div
          className={
            "flex flex-col gap-14 lg:gap-24 justify-center items-center w-full"
          }
        >
          {openLeagues.total > 0 && (
            <LatestOpenChunk lng={lng} openLeagues={openLeagues} />
          )}
          {inProgressLeagues.total > 0 && (
            <InProgressChunk lng={lng} inProgressLeagues={inProgressLeagues} />
          )}
          {notActiveLeagues.total > 0 && (
            <TerminatedChunk lng={lng} notActiveLeagues={notActiveLeagues} />
          )}
        </div>
      ) : (
        <ComingSoonCard lng={lng} />
      )}
    </div>
  );
};

const LatestOpenChunk = ({
  lng,
  openLeagues,
}: {
  lng: string;
  openLeagues: GetAllLeaguesResponse;
}) => {
  const { t } = useTranslation(lng, "home");
  const league: GetLeagueByIdResponse = openLeagues.leagues[0];

  return (
    <div
      className={
        "flex flex-col gap-2 lg:gap-3 justify-center items-center w-full"
      }
    >
      <div className={"flex flex-row gap-2 items-center mb-2 lg:mb-0"}>
        <span className={"rounded-full bg-functional-positive w-4 h-4"} />
        <h2
          className={
            "text-baseline-neutral-white text-base lg:text-2xl uppercase font-manrope leading-7 lg:leading-10"
          }
        >
          {t("latest_open_league" as any)}
        </h2>
      </div>

      <span
        className={
          "text-baseline-neutral-white text-xs lg:text-lg font-manrope font-light leading-7"
        }
      >
        {t("you_can_join" as any)}
      </span>

      <PrimaryLeagueCard
        lng={lng}
        leagueId={league.leagueId}
        leagueName={league.name}
        leagueDescription={league.description}
        leagueStartDate={new Date(league.startDate)}
        leagueEndDate={new Date(league.endDate)}
        participants={league.participants}
        entryTicketAmount={league.entryTicketAmount}
        entryTicketDenom={league.entryTktDenom}
        leagueReferralId={league.referralProgram}
      />
    </div>
  );
};

const InProgressChunk = ({
  lng,
  inProgressLeagues,
}: {
  lng: string;
  inProgressLeagues: GetAllLeaguesResponse;
}) => {
  const { t } = useTranslation(lng, "home");
  const { formatAmount } = useAmount();

  return (
    <div
      className={
        "flex flex-col gap-2 lg:gap-3 justify-center items-center w-full"
      }
    >
      <div className={"flex flex-row gap-2 items-center mb-2 lg:mb-0"}>
        <span className={"rounded-full bg-functional-warning w-4 h-4"} />
        <h2
          className={
            "text-baseline-neutral-white text-base lg:text-2xl uppercase font-manrope leading-7 lg:leading-10 text-center"
          }
        >
          {t("leagues_in_progress" as any)}
        </h2>
      </div>

      <span
        className={
          "text-baseline-neutral-white text-xs lg:text-lg font-manrope font-light leading-7"
        }
      >
        {t("registration_as_participant" as any)}
      </span>

      <div
        className={
          "flex flex-row w-screen overflow-x-scroll scrollbar-hide gap-4 lg:gap-6"
        }
      >
        <div className={"w-5 lg:w-20"} />

        {inProgressLeagues.leagues.map(
          (league: GetLeagueByIdResponse, i: number) => (
            <div key={i} className={"flex flex-shrink-0"}>
              <SecondaryLeagueCard
                lng={lng}
                leagueId={league.leagueId}
                leagueName={league.name}
                leagueDescription={league.description}
                leagueEndDate={new Date(league.endDate)}
                partnerships={league.partnerships}
                leagueEstimatedPrize={
                  league.entryTktDenom && league.estimatedRewards?.[0]
                    ? league.entryTktDenom.name +
                    " " +
                    formatAmount(
                      league.estimatedRewards[0].amount,
                      league.entryTktDenom.decimals,
                      Math.min(2, league.entryTktDenom.decimals),
                    )
                    : "-"
                }
              />
            </div>
          ),
        )}

        <div className={"w-5 lg:w-20"} />
      </div>
    </div>
  );
};

const TerminatedChunk = ({
  lng,
  notActiveLeagues,
}: {
  lng: string;
  notActiveLeagues: GetAllLeaguesResponse;
}) => {
  const { t } = useTranslation(lng, "home");
  const { formatAmount } = useAmount();

  return (
    <div
      className={
        "flex flex-col gap-2 lg:gap-3 justify-center items-center w-full"
      }
    >
      <div className={"flex flex-row gap-2 items-center mb-2 lg:mb-0"}>
        <span className={"rounded-full bg-functional-negative w-4 h-4"} />
        <h2
          className={
            "text-baseline-neutral-white text-base lg:text-2xl uppercase font-manrope leading-7 lg:leading-10"
          }
        >
          {t("past_leagues" as any)}
        </h2>
      </div>

      <div
        className={
          "flex flex-row w-screen overflow-x-scroll scrollbar-hide gap-4 lg:gap-6"
        }
      >
        <div className={"w-5 lg:w-20"} />

        {notActiveLeagues.leagues.map(
          (league: GetLeagueByIdResponse, i: number) => (
            <div key={i} className={"flex flex-shrink-0"}>
              <TertiaryLeagueCard
                lng={lng}
                leagueId={league.leagueId}
                leagueName={league.name}
                leagueDescription={league.description}
                leagueStartDate={new Date(league.startDate)}
                leagueEndDate={new Date(league.endDate)}
                leagueEstimatedPrize={
                  league.entryTktDenom && league.estimatedRewards?.[0]
                    ? league.entryTktDenom.name +
                    " " +
                    formatAmount(
                      league.estimatedRewards[0].amount,
                      league.entryTktDenom.decimals,
                      Math.min(2, league.entryTktDenom.decimals),
                    )
                    : "-"
                }
              />
            </div>
          ),
        )}

        <div className={"w-5 lg:w-20"} />
      </div>
    </div>
  );
};
