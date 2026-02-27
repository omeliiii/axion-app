"use client"

import {ReactIcon} from "@/components/misc/react-icon";
import {Decimal} from "@/components/numbers/decimal";
import clsx from "clsx";
import {Area, AreaChart, ResponsiveContainer} from "recharts";
import {useEffect, useState} from "react";
import {useCopyToClipboard} from "@/hooks/use-copy-to-clipboard";

interface LeaderboardCardMandatoryProps {
    position: number
    totalScore: number
    winnersNumber: number
}

interface LeaderboardCardOptionalProps {
    lastPoints: number[]
    yourPosition: number|undefined
}

export type LeaderboardCardProps = LeaderboardCardMandatoryProps & Partial<LeaderboardCardOptionalProps>

export const LeaderboardCard = ({position, totalScore, winnersNumber, lastPoints, yourPosition = -1}: LeaderboardCardProps) => {
    const [animationId, setAnimationId] = useState(0);
    const [lastPointsData, setLastPointsData] = useState(lastPoints)

    const { copyToClipboard } = useCopyToClipboard();

    const positionStyle = clsx('absolute top-1 left-1/2 -translate-x-1/2 text-lg font-mono' as any, {
        'text-standings-gold': position == 1,
        'text-standings-silver': position == 2,
        'text-standings-bronze': position == 3,
        'text-gray-500 opacity-70': position > 3
    } as any)

    const badgeStyle = clsx('w-10 h-10' as any, {
        'fill-standings-gold': position == 1,
        'fill-standings-silver': position == 2,
        'fill-standings-bronze': position == 3,
        'fill-gray-500 opacity-70': position > 3
    } as any)

    const outerStyle = clsx('relative overflow-hidden rounded-lg grid grid-flow-row grid-cols-1 grid-rows-[auto_auto_1fr] sm:grid-cols-[auto_auto_1fr] sm:grid-rows-1 bg-baseline-tertiary bg-opacity-40 items-center w-full justify-items-center sm:justify-items-start gap-y-2 sm:gap-y-0 gap-x-8 px-12 pt-12 pb-6 shadow-lg hover:scale-[1.03] duration-200 transition-transform' as any, {
        'border-2 border-baseline-secondary': position == yourPosition
    } as any)

    const avatarStyle = clsx('w-16 h-16 z-20 relative' as any, {
        'drop-shadow-[0_6px_6px_rgba(255,162,38,0.6)]': position == yourPosition
    } as any)

    useEffect(() => {
        setLastPointsData(lastPoints?.map(_ => 0))
        setTimeout(()=>setLastPointsData([...lastPoints!]), 500)
    }, [animationId, lastPoints]);

    const onMouseEnter = () => {
        setAnimationId(prevId => prevId + 1)
    }

    return (
        <button className={outerStyle} onMouseEnter={onMouseEnter}>
            <div className={'absolute -bottom-1 left-0 scale-[1.01] z-10 w-[100%] h-[100%]'} />

            {lastPoints && (
                <ResponsiveContainer width="100%" height="100%" className='absolute z-0 -bottom-1 left-0 opacity-15 scale-[1.01]'>
                    <AreaChart data={lastPointsData?.map(lastPoint => {return {val: lastPoint}})} style={{cursor: 'pointer'}}>
                        <Area type="monotone" dataKey="val" stroke={position == yourPosition ? "#FFA726" : "#BDBDBD"} fill="#01579B"
                              animationDuration={500}
                              animationEasing="ease-out"
                              animationId={animationId}/>
                    </AreaChart>
                </ResponsiveContainer>
            )}

            <div className={'absolute top-2 left-2 z-20'}>
                {position > winnersNumber ? (
                    <h4 className={'text-gray-500 font-mono'}>#{position}</h4>
                ) : (
                    <div className={'relative flex'}>
                        <span className={positionStyle}>{position}</span>
                        <ReactIcon iconPath={'/icons/essentials/position-badge.svg'} className={badgeStyle} />
                    </div>
                )}
            </div>

            <ReactIcon iconPath={'/icons/essentials/avatar.svg'} className={avatarStyle}/>

            <button className={'z-20 flex flex-row items-center gap-2 text-baseline-neutral-white hover:text-baseline-secondary transition-colors duration-200'}
                    onClick={() => typeof window !== "undefined" && copyToClipboard('kujira1m8w...xz6jng')}>
                <span className={'font-manrope text-xl'}>kujira1m8w...xz6jng</span>
                <ReactIcon iconPath={"/icons/files-folders/documents.svg"} className={'w-5 h-5'} />
            </button>

            <Decimal round={2} decimals={2} symbolLeft symbol={totalScore < 0 ? '-' : ''} amount={BigInt(Math.abs(totalScore))} className={'text-baseline-secondary text-3xl sm:justify-self-end z-20'} />
        </button>
    )
}