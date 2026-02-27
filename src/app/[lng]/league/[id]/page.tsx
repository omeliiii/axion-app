import { HeaderTitle } from "@/components/navigation/header/header-title";
import { Footer } from "@/components/navigation/footer/footer";
import { PrimaryLeagueCard } from "@/components/cards/league/primary-league-card";
import { TabbedCard } from "@/components/cards/tabbed/tabbed-card";
import {
  GetLeagueByIdResponse,
  useGetLeagueByIdQueryServer,
} from "@/redux/slices/leagues-slice";
import NotFound from "@/app/[lng]/[...not-found]/page";
import { LeagueToast } from "@/app/[lng]/league/[id]/league-toast";
import { LeagueReduxAdapter } from "@/app/[lng]/league/[id]/league-redux-adapter";
import { TestnetDisclaimer } from "@/components/overlays/testnet-disclaimer";
import React from "react";
import { EstimatedRewardCard } from "@/components/cards/league/estimated-reward-card";
import { TopDonationsCard } from "@/components/cards/league/top-donations-card";
import { LeaderboardReferralBox } from "@/app/[lng]/league/[id]/leaderboard-referral-box";

interface LeagueProps {
  params: { id: string; lng: string };
}

const League = async ({ params: { id, lng } }: LeagueProps) => {
  const result = await useGetLeagueByIdQueryServer(id, true);

  if (result.isError) {
    if (result.error.status === 404) {
      return <NotFound params={{ lng }} />;
    }
    return <NotFound params={{ lng }} />;
  }

  const {
    estimatedRewards,
    startDate: csd,
    referralProgram,
    name,
    description,
    endDate: ced,
    donators,
    participants,
    entryTicketAmount,
    entryTktDenom,
    prizes,
    displayRules,
    totalValueLocked,
    referralRewardPercent,
    maxBoostersPerUser,
  } = result.data;

  const leagueStartDate = new Date(csd);
  const leagueEndDate = new Date(ced);

  return (
    <main
      className={
        "flex flex-col gap-14 lg:gap-14 px-5 lg:px-32 py-8 lg:py-12 bg-baseline-neutral-light-black"
      }
    >
      <div className={"relative w-full"}>
        <HeaderTitle lng={lng} />
      </div>

      <div className={"flex flex-col gap-4"}>
        <div className={"mb-2"}>
          <PrimaryLeagueCard
            leagueStartDate={leagueStartDate}
            background={false}
            lng={lng}
            leagueId={id}
            leagueName={name}
            leagueDescription={description}
            leagueEndDate={leagueEndDate}
            participants={participants}
            entryTicketAmount={entryTicketAmount}
            entryTicketDenom={entryTktDenom}
            leagueReferralId={referralProgram}
          />
        </div>

        <div className={"grid grid-flow-row lg:grid-flow-col grid-cols-2 lg:grid-cols-[repeat(2, minmax(0, 1fr))] grid-rows-[repeat(3,max-content)] lg:grid-rows-[2fr,1fr] gap-4"}>
          <div className={"col-start-1 row-start-1 col-span-2 lg:col-span-1"}>
            <EstimatedRewardCard winnerPrizes={prizes} referralRewardPercent={referralRewardPercent} referralId={referralProgram} leagueId={id} />
          </div>

          <div className={"col-start-1 row-start-3 lg:row-start-2 col-span-2 lg:col-span-1"}>
            <TopDonationsCard lng={lng} leagueId={id} />
          </div>

          <div
            className={
              "col-span-2 lg:col-span-1 lg:row-span-2 col-start-1 lg:col-start-2 row-start-2"
            }
          >
            <TabbedCard
              lng={lng}
              leagueId={id}
              leagueRules={displayRules}
              leagueStartDate={leagueStartDate}
              leagueEndDate={leagueEndDate}
              entryTicketDenom={entryTktDenom}
            />
          </div>
        </div>

        <LeaderboardReferralBox lng={lng} leagueId={id} leaguePrizes={prizes} totalUsers={participants} referralRewardPercent={referralRewardPercent}
          leagueEndDate={leagueEndDate} leagueStartDate={leagueStartDate} referralProgram={referralProgram} maxBoostersPerUser={maxBoostersPerUser} />
      </div>

      <Footer lng={lng} />

      <LeagueToast
        lng={lng}
        error={{ status: 0 }}
      />

      <LeagueReduxAdapter
        leagueId={id}
        participants={participants}
        donators={donators}
        estimatedRewards={estimatedRewards}
        totalValueLocked={totalValueLocked}
      />

      <TestnetDisclaimer lng={lng} />
    </main>
  );
};

export default League;
