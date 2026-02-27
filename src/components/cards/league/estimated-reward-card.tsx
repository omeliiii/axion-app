"use client"

import { useAppSelector } from "@/redux/hooks";
import { EstimatedRewardEntry, selectEstimatedRewards } from "@/redux/slices/leagues-slice";
import { Decimal } from "@/components/numbers/decimal";
import { Pie, PieChart, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import {
    GetReferralCodeByUserRequest,
    GetReferralCodeByUserResponse, GetReferredFriendsByReferralCodeRequest, GetReferredFriendsByReferralCodeResponse,
    useGetReferralCodeByUserQuery, useGetReferredFriendsByReferralCodeQuery
} from "@/redux/slices/referral-slice";
import { PaginationModel } from "@/model/pagination-model";
import { selectAddress } from "@/redux/slices/login-slice";

interface EstimatedRewardCardMandatoryProps {
    winnerPrizes: number[],
    referralRewardPercent: number
    referralId: string,
    leagueId: string
}

interface EstimatedRewardCardOptionalProps {

}

export type EstimatedRewardCardProps = EstimatedRewardCardMandatoryProps & Partial<EstimatedRewardCardOptionalProps>

export const EstimatedRewardCard = ({ winnerPrizes, referralRewardPercent, referralId, leagueId }: EstimatedRewardCardProps) => {
    const estimatedRewards = useAppSelector(selectEstimatedRewards) as EstimatedRewardEntry[];
    const walletAddress = useAppSelector(selectAddress);

    const [pieData, setPieData] = useState([] as any[])
    const [code, setCode] = useState(undefined as undefined | string);
    const [totalReferredFriends, setTotalReferredFriends] = useState(0);
    const [totalReferredForProgram, setTotalReferredForProgram] = useState(0);

    const {
        data: getRefCodeRes = {} as GetReferralCodeByUserResponse
    } = useGetReferralCodeByUserQuery(
        { walletAddress } as GetReferralCodeByUserRequest,
        { skip: !walletAddress },
    ) as unknown as { data: GetReferralCodeByUserResponse }

    const {
        data: getRefFriendsRes = {} as GetReferredFriendsByReferralCodeResponse,
        isSuccess: isGetReferredFriendsSuccess,
    } = useGetReferredFriendsByReferralCodeQuery(
        {
            pagination: { pageIndex: 0, pageSize: 10 } as PaginationModel,
            referralCode: code,
            leagueId: leagueId
        } as GetReferredFriendsByReferralCodeRequest,
        { skip: !code },
    ) as unknown as { data: GetReferredFriendsByReferralCodeResponse; isSuccess: boolean };

    useEffect(() => {
        if (getRefCodeRes.referralCodes) {
            setCode(
                getRefCodeRes.referralCodes.find(
                    (rc) => rc.referralProgramId == referralId,
                )?.code,
            );
        }
    }, [getRefCodeRes, referralId]);

    useEffect(() => {
        if (isGetReferredFriendsSuccess) {
            setTotalReferredFriends(getRefFriendsRes.total)
            setTotalReferredForProgram(getRefFriendsRes.totalReferredForProgram)
        }
    }, [isGetReferredFriendsSuccess, getRefFriendsRes]);

    useEffect(() => {
        setPieData(
            [...winnerPrizes.map((winnerPrize, i) => {
                return {
                    name: (i + 1) + ' Position',
                    value: Math.round(percentage(winnerPrize, 100 - referralRewardPercent))
                }
            }), { name: 'Referral', value: referralRewardPercent }]
        )
    }, [winnerPrizes, referralRewardPercent]);

    const percentage = (amount: number, percentage: number) => (amount / 100) * percentage

    const bigint = (n: number) => isNaN(n) ? BigInt(0) : BigInt(n)

    return (
        <div className={'relative h-full w-full rounded-lg bg-baseline-tertiary bg-opacity-40 flex flex-col justify-between overflow-hidden'}>
            <ResponsiveContainer width="100%" height="100%" className='absolute z-0 -top-10 left-0 opacity-10'>
                <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={80} outerRadius={100} fill="#039BE5" label={({ name }) => name} labelLine={false} />
                </PieChart>
            </ResponsiveContainer>

            <div className={'flex flex-col gap-7 px-4 py-2 lg:py-4'}>
                <div className={'w-full flex flex-row justify-between items-center'}>
                    <span className={'w-[25%] text-baseline-neutral-white text-xl font-manrope font-medium'}>Prize Pool</span>

                    {estimatedRewards?.map((estimatedReward, i) => (
                        <Decimal key={i} round={2} decimals={estimatedReward.denom.decimals} symbolLeft
                            symbol={estimatedReward.denom.name} amount={bigint(estimatedReward.amount)}
                            className={'w-[20%] text-baseline-neutral-white text-base font-manrope font-light'} />
                    ))}
                </div>

                {winnerPrizes?.map((winnerPrize, i) => (
                    <div key={i} className={'w-full flex flex-row justify-between items-center'}>
                        <span className={'w-[25%] text-baseline-neutral-white text-lg font-manrope font-medium'}>{i + 1} Position ({Math.round(percentage(winnerPrize, 100 - referralRewardPercent))}%)</span>

                        {estimatedRewards?.map((estimatedReward, i) => (
                            <Decimal key={i} round={2} decimals={estimatedReward.denom.decimals} symbolLeft
                                symbol={estimatedReward.denom.name}
                                amount={bigint(Math.round(percentage(estimatedReward.amount, percentage(winnerPrize, 100 - referralRewardPercent))))}
                                className={'w-[20%] text-baseline-neutral-white text-sm font-manrope font-light'} />
                        ))}
                    </div>
                ))}
            </div>

            <div className={'flex flex-col bg-baseline-secondary bg-opacity-10 px-4 py-1 lg:py-2 gap-1'}>
                <div className={'w-full flex flex-row justify-between items-center'}>
                    <span className={'w-[25%] text-baseline-neutral-white text-xl font-manrope font-medium'}>Referral ({referralRewardPercent}%)</span>

                    {estimatedRewards?.map((estimatedReward, i) => (
                        <Decimal key={i} round={2} decimals={estimatedReward.denom.decimals} symbolLeft
                            symbol={estimatedReward.denom.name}
                            amount={bigint(Math.round(percentage(estimatedReward.amount, referralRewardPercent)))}
                            className={'w-[20%] text-baseline-neutral-white text-base font-manrope font-light'} />
                    ))}
                </div>

                {totalReferredFriends > 0 && (
                    <div className={'w-full flex flex-row justify-between items-center'}>
                        <span className={'w-[25%] text-baseline-neutral-white text-sm font-manrope font-medium'}>Referred {totalReferredFriends}/{totalReferredForProgram} ({(totalReferredFriends * 100) / totalReferredForProgram}%)</span>

                        {estimatedRewards?.map((estimatedReward, i) => (
                            <Decimal key={i} round={2} decimals={estimatedReward.denom.decimals} symbolLeft
                                symbol={estimatedReward.denom.name}
                                amount={bigint(Math.round(percentage(percentage(estimatedReward.amount, referralRewardPercent), (totalReferredFriends * 100) / totalReferredForProgram)))}
                                className={'w-[20%] text-baseline-neutral-white text-sm font-manrope font-light'} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}