import { apiSlice } from "@/redux/slices/api-slice";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { PaginationModel } from "@/model/pagination-model";
import { PaginatedCache } from "@/redux/paginated-slice";
import {
  paginatedMerge,
  paginatedSerializeQueryArgs,
} from "@/redux/paginated-slice";

export interface GetStandingsByLeagueIdRequest {
  leagueId: string;
  pagination: PaginationModel;
  timestamp: number;
}

export interface GetStandingsByLeagueResponseItem {
  userWalletAddress: string;
  totalScore: number;
  lastScores: number[];
}

export interface GetUserPositionByLeagueRequest {
  leagueId: string;
  userWalletAddress: string;
  timestamp: number;
}

export interface GetUserPositionByLeagueResponse {
  position: number;
  timestamp: number;
}

const getStandingsPath = () => "/standings";

export const standingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStandingsByLeague: builder.query({
      query: ({
        leagueId,
        pagination,
        timestamp,
      }: GetStandingsByLeagueIdRequest) => {
        let endpoint = getStandingsPath();

        endpoint +=
          "/" +
          leagueId +
          "?page=" +
          pagination.pageIndex +
          "&size=" +
          pagination.pageSize +
          "&timestamp=" +
          timestamp;

        return endpoint;
      },
      serializeQueryArgs: paginatedSerializeQueryArgs,
      merge: paginatedMerge,
      providesTags: (
        _result: PaginatedCache | undefined,
        _error: FetchBaseQueryError | undefined,
        arg: GetStandingsByLeagueIdRequest,
      ) => [
          { type: "Standings" as const, id: arg.leagueId },
        ],
    }),
    getUserPositionByLeague: builder.query({
      query: ({
        leagueId,
        userWalletAddress,
        timestamp,
      }: GetUserPositionByLeagueRequest) => {
        let endpoint = getStandingsPath();

        endpoint +=
          "/" + leagueId + "/" + userWalletAddress + "?timestamp=" + timestamp;

        return endpoint;
      },
      providesTags: (
        _result: GetUserPositionByLeagueResponse | undefined,
        _error: FetchBaseQueryError | undefined,
        arg: GetUserPositionByLeagueRequest,
      ) => [
          { type: "Standings" as const, id: arg.leagueId },
        ],
    }),
  }),
});

export const { useGetStandingsByLeagueQuery, useGetUserPositionByLeagueQuery } =
  standingsApiSlice;
