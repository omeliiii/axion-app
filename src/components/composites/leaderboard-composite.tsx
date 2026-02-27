"use client"

import React, {useEffect, useState} from "react";
import {LeaderboardCard} from "@/components/cards/league/leaderboard-card";
import {AutoSizedList} from "@/components/misc/auto-sized-list";
import {SizesType} from "@/hooks/use-breakpoint";
import {Button} from "@/components/buttons/button";
import {useTranslation} from "@/app/i18n/client";
import {ReactIcon} from "@/components/misc/react-icon";
import clsx from "clsx";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {selectAddress} from "@/redux/slices/login-slice";
import {CsrMessage, selectMessage} from "@/redux/slices/csr-message-slice";
import {
    GetStandingsByLeagueIdRequest,
    GetStandingsByLeagueResponseItem, GetUserPositionByLeagueRequest,
    GetUserPositionByLeagueResponse, standingsApiSlice,
    useGetUserPositionByLeagueQuery
} from "@/redux/slices/standings-slice";

interface LeaderboardCompositeMandatoryProps {
    lng: string
    leagueId: string
    leaguePrizes: number[];
    totalUsers: number;
}

interface LeaderboardCompositeOptionalProps {}

export type LeaderboardCompositeProps = LeaderboardCompositeMandatoryProps & Partial<LeaderboardCompositeOptionalProps>

export const LeaderboardComposite = ({lng, leagueId, leaguePrizes, totalUsers}: LeaderboardCompositeProps) => {
    const {t} = useTranslation(lng, "leagues");
    const dispatch = useAppDispatch();
    const walletAddress = useAppSelector(selectAddress);
    const message: CsrMessage | null = useAppSelector(selectMessage);

    const chunkSize = 100

    const [loadTimestamp, setLoadTimestamp] = useState(0);
    const [data, setData] = useState([] as GetStandingsByLeagueResponseItem[]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const {
        data: userPositionResponse = null as null | GetUserPositionByLeagueResponse,
    } = useGetUserPositionByLeagueQuery(
        {
            leagueId,
            userWalletAddress: walletAddress,
            timestamp: loadTimestamp,
        } as GetUserPositionByLeagueRequest,
        { skip: loadTimestamp == 0 || !walletAddress },
    ) as { data: GetUserPositionByLeagueResponse }

    useEffect(() => {
        setLoadTimestamp(new Date().getTime());
    }, []);

    useEffect(() => {
        if (loadTimestamp) {
            // First data load
            loadMoreRows();
        }
    }, [loadTimestamp]);

    useEffect(() => {
        if (message?.receiver == "leaderboard-composite" && message.payload == "spot-me") {
            spotMe();
        }
    }, [message]);

    const loadMoreRows = async (startIndex = 0) => {
        if (isLoading || !hasMore || !loadTimestamp) return;

        setIsLoading(true);

        const newDataResponse = (await dispatch(
            standingsApiSlice.endpoints.getStandingsByLeague.initiate({
                leagueId,
                pagination: {
                    pageIndex: Math.floor(startIndex / chunkSize),
                    pageSize: chunkSize,
                },
                timestamp: loadTimestamp,
            } as GetStandingsByLeagueIdRequest) as any,
        )) as { data: GetStandingsByLeagueResponseItem[] };

        if (newDataResponse && newDataResponse.data) {
            const newData = newDataResponse.data;

            if (newData.length < chunkSize) {
                setHasMore(false);
            }

            setData((prevData) => {
                const combinedData = [...prevData];
                newData.forEach(
                    (item: GetStandingsByLeagueResponseItem, index: number) => {
                        const i = startIndex + index;
                        if (!combinedData[i]) {
                            combinedData[i] = item;
                        }
                    },
                );
                return combinedData;
            });
        }

        setIsLoading(false);
    };

    const spotMe = async () => {
        const userPositionExists =
            userPositionResponse && !!data[userPositionResponse.position - 1];

        if (!userPositionExists && userPositionResponse) {
            // Se la posizione dell'utente non è stata ancora caricata, carica un intorno
            const start = Math.max(userPositionResponse.position - 50, 0);
            await loadMoreRows(start);
        }

        if (!userPositionResponse || !data[userPositionResponse.position - 1]) {
            return;
        }

        // Una volta caricati i dati (e che la lista li abbia renderizzati), scrolla fino alla posizione
        const container = document.getElementById("leaderboard-list");

        if (container) {
            const rowHeight = (container.firstChild?.firstChild as any)?.offsetHeight;
            const newScroll =
                (userPositionResponse?.position - 1) * (rowHeight ? rowHeight : 65) - (rowHeight ? rowHeight : 65);

            await new Promise<void>((resolve) => {
                const checkScroll = () => {
                    if (container.scrollHeight - container.clientHeight >= newScroll)
                        resolve();
                    else setTimeout(checkScroll, 100);
                };
                checkScroll();
            });

            container.scrollTo({ top: newScroll, behavior: "smooth" });
        }
    };

    const renderRow = ({index, key, style}: {index: number, key: string, style: React.CSSProperties}) => {
        const row = data[index];
        if (!row) return <div key={key} style={style} id={`row-${index}`}></div>;

        return (
            <div key={key} style={style} id={`row-${index}`} className={'px-4'}>
                <LeaderboardCard position={index+1} totalScore={row.totalScore} yourPosition={userPositionResponse?.position}
                                 winnersNumber={leaguePrizes.length} lastPoints={row.lastScores} />
            </div>
        )
    }

    return (
        <div className={'h-screen w-full bg-baseline-tertiary bg-opacity-20 rounded-lg grid grid-flow-row justify-center items-center grid-rows-[max-content,1fr] grid-cols-2 pt-6'}>
            <div className={userPositionResponse?.position ? 'justify-self-start ms-4 lg:ms-24' : 'col-span-2 justify-self-center'}>
                {userPositionResponse?.position ? (
                    <YourPosition lng={lng} yourPosition={userPositionResponse!.position!} totalUsers={totalUsers}/>
                ) : (
                    <span className={'text-baseline-secondary text-4xl lg:text-6.5xl font-manrope font-extrabold uppercase leading-8 lg:leading-15.2'}>{t('leaderboard' as any)}</span>
                )}
            </div>

            {userPositionResponse?.position && (<Button className={'me-4 lg:me-24 uppercase button--outline button--icon-right button--small justify-self-end'}
                    label={t("spot_me" as any)} onClick={spotMe}>
                <ReactIcon iconPath={'/icons/arrows/double-caret-down.svg'}/>
            </Button>)}

            <div className={'h-full w-full lg:w-3/4 col-span-2 justify-self-center'}>
                {data && (
                    <div className={'col-span-2 w-full h-full pt-6'}>
                        <AutoSizedList
                            listId={"leaderboard-list"}
                            data={data}
                            chunkSize={chunkSize}
                            loadMoreRows={loadMoreRows}
                            renderRow={renderRow}
                            rowHeight={{others: "230", sm: "150"} as SizesType}
                            listClassName={'overflow-visible h-[100%] w-[100%]'}
                            enableInfiniteScrolling
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

interface YourPositionProps {
    lng: string
    yourPosition: number
    totalUsers: number
}

const YourPosition = ({lng, yourPosition, totalUsers}: YourPositionProps) => {
    const {t} = useTranslation(lng, "leagues");

    const positionStyle = clsx('text-2xl font-mono leading-3' as any, {
        'text-standings-gold': yourPosition == 1,
        'text-standings-silver': yourPosition == 2,
        'text-standings-bronze': yourPosition == 3,
        'text-gray-500': yourPosition > 3
    } as any)

    return (
        <div className={'grid grid-flow-col grid-rows-[max-content,max-content] grid-cols-[max-content,max-content] gap-x-2 gap-y-1'}>
            <span className={'text-baseline-neutral-white text-2xl font-manrope justify-self-start uppercase'}>{t('your_position' as any)}</span>

            <div className={'inline-flex flex-row justify-self-end mx-4 items-end gap-1'}>
                <span className={positionStyle}>{yourPosition} </span>
                <span className={'text-gray-500 text-md font-mono leading-3'}>/ {totalUsers}</span>
            </div>

            <div className={'row-span-2 self-center'}>
                <ReactIcon iconPath={'/icons/essentials/trophy.svg'} className={'h-14 w-14'} />
            </div>
        </div>
    )
}