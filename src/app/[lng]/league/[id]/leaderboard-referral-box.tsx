"use client"

import {useLeagueStatus} from "@/hooks/use-league-status";
import {ReferralCard} from "@/components/cards/referral-card";
import React from "react";
import {LeaderboardComposite} from "@/components/composites/leaderboard-composite";
import {BoosterCard} from "@/components/cards/booster-card";
import {useAppSelector} from "@/redux/hooks";
import {selectAddress} from "@/redux/slices/login-slice";

interface LeaderboardReferralBoxMandatoryProps {
    lng: string
    referralProgram: string
    leagueId: string
    leaguePrizes: number[]
    totalUsers: number
    leagueStartDate: Date
    leagueEndDate: Date
    referralRewardPercent: number
    maxBoostersPerUser: number
}

interface LeaderboardReferralBoxOptionalProps {

}

export type LeaderboardReferralBoxProps = LeaderboardReferralBoxMandatoryProps & Partial<LeaderboardReferralBoxOptionalProps>

export const LeaderboardReferralBox = ({leagueStartDate, leagueEndDate, lng, referralProgram, leagueId, leaguePrizes, totalUsers, referralRewardPercent, maxBoostersPerUser}: LeaderboardReferralBoxProps) => {
    const status = useLeagueStatus({
        startDate: leagueStartDate,
        endDate: leagueEndDate,
    })

    const walletAddress = useAppSelector(selectAddress);

    return (
        <div className={'w-full flex justify-center'}>
            {status == 'open' ? (
                <ReferralCard lng={lng} referralId={referralProgram} referralRewardPercent={referralRewardPercent} leagueId={leagueId} />
            ) : (
                <div className={'flex flex-col w-full gap-4'}>
                    {!walletAddress && status == 'in_progress' && (<BoosterCard leagueId={leagueId} lng={lng} maxBoostersPerUser={maxBoostersPerUser} />)}
                    <LeaderboardComposite lng={lng} leagueId={leagueId} leaguePrizes={leaguePrizes} totalUsers={totalUsers}/>
                </div>
            )}
        </div>
    )
}