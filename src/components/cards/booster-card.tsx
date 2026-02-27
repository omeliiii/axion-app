"use client"

import { useAppSelector } from "@/redux/hooks";
import { selectAddress } from "@/redux/slices/login-slice";
import {
    Booster,
    GetBoostersByUserAndLeagueRequest,
    GetBoostersByUserAndLeagueResponse,
    useGetBoostersByUserAndLeagueQuery
} from "@/redux/slices/booster-slice";
import React, { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { ReactIcon } from "@/components/misc/react-icon";
import { IntlFormattedFragment } from "@/components/misc/intl-formatted-fragment";
import { Button } from "@/components/buttons/button";

interface BoosterCardMandatoryProps {
    leagueId: string
    lng: string
    maxBoostersPerUser: number
}

interface BoosterCardOptionalProps {

}

export type BoosterCardProps = BoosterCardMandatoryProps & Partial<BoosterCardOptionalProps>

export const BoosterCard = ({ leagueId, lng, maxBoostersPerUser }: BoosterCardProps) => {
    const { t } = useTranslation(lng, 'leagues')
    const walletAddress = useAppSelector(selectAddress);

    const [boosters, setBoosters] = useState([] as Booster[])

    const { data: getBoostersRes = {} as GetBoostersByUserAndLeagueResponse }
        = useGetBoostersByUserAndLeagueQuery({ walletAddress, leagueId } as GetBoostersByUserAndLeagueRequest) as { data: GetBoostersByUserAndLeagueResponse }

    useEffect(() => {
        if (getBoostersRes.boosters) {
            setBoosters(getBoostersRes.boosters)
        }
    }, [getBoostersRes]);

    const chartData = [
        { stonks: 0, notStonks: 0 },
        { stonks: 4, notStonks: 3 },
        { stonks: 3, notStonks: 2 },
        { stonks: 7, notStonks: 4 },
        { stonks: 8, notStonks: 1 },
        { stonks: 7, notStonks: 2 },
        { stonks: 9, notStonks: 4 },
        { stonks: 15, notStonks: 2 }
    ]

    return (
        <div id={'boosters'} className={'w-full rounded-lg bg-baseline-tertiary bg-opacity-40 px-4 py-2 lg:py-4 relative overflow-hidden flex flex-col gap-1'}>
            <ResponsiveContainer width="100%" height="100%"
                className='absolute z-0 -bottom-1 left-0 opacity-50 scale-[1.01]'>
                <LineChart data={chartData}>
                    <Line type="linear" dataKey="stonks" stroke="#007018" animationDuration={500}
                        animationEasing="ease-out" dot={false} activeDot={false} />
                    <Line type="linear" dataKey="notStonks" stroke="#BDBDBD" animationDuration={1000}
                        animationEasing="ease-out" dot={false} activeDot={false} />
                </LineChart>
            </ResponsiveContainer>

            <div className={'z-10'}><BoosterTitle title={t('booster_title' as any)} /></div>

            <p className={"z-10 text-baseline-neutral-white font-manrope text-xs lg:text-base leading-4 lg:leading-6 break-words"}>
                <IntlFormattedFragment text={t('booster_description' as any)} />
            </p>

            <p className={"z-10 text-gray-400 font-manrope text-xs lg:text-sm leading-3 break-words"}>
                <IntlFormattedFragment text={t('booster_example' as any)} />
            </p>

            <div className={'z-10 flex flex-row w-full justify-center gap-2 lg:gap-6 mt-6'}>
                {Array.from({ length: maxBoostersPerUser }, (_, i) => (
                    <ReactIcon key={i} className={'h-10 w-10 lg:h-14 lg:w-14'}
                        iconPath={'/icons/essentials/rocket-' + (i >= boosters.length ? 'inactive' : 'active') + '.svg'} />
                ))}
            </div>

            <p className={"z-10 self-center text-baseline-neutral-white font-manrope text-xs lg:text-sm leading-4 lg:leading-6 break-words mt-1"}>
                <IntlFormattedFragment text={String(t(maxBoostersPerUser == boosters.length ? 'booster_terminated' : 'booster_left' as any, { n: maxBoostersPerUser - boosters.length } as any))} />
            </p>

            <div className={'z-10 self-center flex flex-col w-1/3 mt-6'}>
                <Button label={t("buy_booster" as any)} onClick={() => { }}
                    className="uppercase button--outline" disabled={maxBoostersPerUser == boosters.length} />
            </div>
        </div>
    )
}

const BoosterTitle = ({ title }: { title: string }) => {
    return (
        <div className={"flex flex-row gap-2 items-center justify-start"}>
            <ReactIcon iconPath={"/icons/essentials/rocket.svg"} className={"w-8 h-8"} />
            <span className={"text-baseline-neutral-white lg:text-2xl font-manrope leading-6 lg:leading-10"}>{title}</span>
        </div>
    );
}