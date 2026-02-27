import { apiSlice } from "@/redux/slices/api-slice";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const getBoostersPath = () => "/boosters";

export interface GetBoostersByUserAndLeagueRequest {
    walletAddress: string;
    leagueId: string
}

export interface Booster {
    name: string
    description: string
    category: string
    boosterId: string
    transactionHashMint: string
    transactionHashBurn: string
    dateStartValidity: Date
    dateEndValidity: Date
    durationMinutes: number
    editionNumber: number
    editionSize: number
}

export interface GetBoostersByUserAndLeagueResponse {
    boosters: Booster[];
}

export const boostersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBoostersByUserAndLeague: builder.query({
            query: ({ walletAddress, leagueId }: GetBoostersByUserAndLeagueRequest) => {
                return getBoostersPath() + "/user/" + walletAddress + '/league/' + leagueId;
            },
            providesTags: (
                _result: undefined,
                _error: FetchBaseQueryError | undefined,
                arg: GetBoostersByUserAndLeagueRequest,
            ) => [
                    { type: "Boosters" as const, id: `${arg.walletAddress}_${arg.leagueId}` },
                ],
        })
    }),
});

export const {
    useGetBoostersByUserAndLeagueQuery
} = boostersApiSlice;