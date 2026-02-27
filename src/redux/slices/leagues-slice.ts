import { apiSlice, getApiUrl } from "@/redux/slices/api-slice";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { PaginationModel } from "@/model/pagination-model";
import {
  paginatedMerge,
  paginatedSerializeQueryArgs,
} from "@/redux/paginated-slice";
import { transformToCamelCase } from "@/redux/camel-snake-utils";
import { Token } from "@/redux/slices/configs-slice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { LeagueStatus } from "@/hooks/use-league-status";

export interface GetAllLeaguesRequest {
  pagination: PaginationModel;
}

export interface GetLeaguesByStatusRequest {
  status: LeagueStatus;
  pagination: PaginationModel;
}

export interface GetLeaguesByIdRequest {
  leagueId: string;
  requireDetails: boolean;
}

export interface GetRewardsByLeagueIdAndWalletRequest {
  leagueId: string;
  userWallet: string;
}

export interface GetUserLeagueInfoRequest {
  userWallet: string;
  leagueId: string;
}

export interface GetAllLeaguesResponse {
  total: number;
  leagues: GetLeagueByIdResponse[];
}

export interface EstimatedRewardEntry {
  amount: number
  denom: Token
}

export interface GetLeagueByIdResponse {
  leagueId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  partnerships: string[];
  participants: number;
  donators: number;
  totalValueLocked: number;
  entryTicketAmount: number;
  entryTktDenom: Token;
  prizes: number[];
  displayRules: string[];
  referralProgram: string;
  estimatedRewards: EstimatedRewardEntry[]
  referralRewardPercent: number
  maxBoostersPerUser: number
  boostersCategoriesWhitelist: string[]
  boostersCategoriesBlacklist: string[]
}

export interface GetRewardsByLeagueIdAndWalletResponseItem {
  action: string;
  points: string;
  prizeAmount: number;
  prizeDenom: Token;
}

export interface GetUserLeagueInfoResponse {
  participant: boolean;
  donator: boolean;
  claimed: boolean;
  refunded: boolean;
}

const getLeaguesPath = () => "/leagues";

export const leaguesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeagues: builder.query({
      query: ({ pagination }: GetAllLeaguesRequest) => {
        let endpoint = getLeaguesPath();

        endpoint +=
          "?page=" + pagination.pageIndex + "&size=" + pagination.pageSize;

        return endpoint;
      },
      serializeQueryArgs: paginatedSerializeQueryArgs,
      merge: paginatedMerge,
      providesTags: ["AllLeagues"],
    }),
    getLeaguesByStatus: builder.query({
      query: ({ status, pagination }: GetLeaguesByStatusRequest) => {
        let endpoint = getLeaguesPath() + "/status/" + status;

        endpoint +=
          "?page=" + pagination.pageIndex + "&size=" + pagination.pageSize;

        return endpoint;
      },
      serializeQueryArgs: paginatedSerializeQueryArgs,
      merge: paginatedMerge,
      providesTags: ["AllLeagues"],
    }),
    getLeagueById: builder.query({
      query: ({ leagueId, requireDetails }: GetLeaguesByIdRequest) => {
        let endpoint = getLeaguesPath();

        endpoint += "/" + leagueId + "?require_details=" + requireDetails;

        return endpoint;
      },
      providesTags: (
        _result: undefined,
        _error: FetchBaseQueryError | undefined,
        {
          leagueId,
          requireDetails,
        }: { leagueId: string; requireDetails: boolean },
      ) => [{ type: "League" as const, id: `${leagueId}_${requireDetails}` }],
    }),
    getRewardsByLeagueIdAndWallet: builder.query({
      query: ({
        leagueId,
        userWallet,
      }: GetRewardsByLeagueIdAndWalletRequest) => {
        let endpoint = getLeaguesPath();

        endpoint += "/" + leagueId + "/users/" + userWallet + "/rewards";

        return endpoint;
      },
      providesTags: (
        _result: undefined,
        _error: FetchBaseQueryError | undefined,
        { leagueId, userWallet }: GetRewardsByLeagueIdAndWalletRequest,
      ) => [{ type: "LeagueRewards" as const, id: `${leagueId}_${userWallet}` }],
    }),
    getUserLeagueInfo: builder.query({
      query: ({ leagueId, userWallet }: GetUserLeagueInfoRequest) => {
        let endpoint = getLeaguesPath();

        endpoint += "/" + leagueId + "/users/" + userWallet + "/info";

        return endpoint;
      },
      providesTags: (
        _result: undefined,
        _error: FetchBaseQueryError | undefined,
        arg: GetUserLeagueInfoRequest,
      ) => [
          { type: "League" as const, id: `${arg.leagueId}_${arg.userWallet}` },
        ],
    }),
  }),
});

interface ServerQuerySuccess {
  isError: false;
  data: GetLeagueByIdResponse;
}

interface ServerQueryError {
  isError: true;
  error: { status: number; message?: string };
}

type ServerQueryResult = ServerQuerySuccess | ServerQueryError;

export const useGetLeagueByIdQueryServer = async (
  leagueId: string,
  requireDetails = false,
): Promise<ServerQueryResult> => {
  try {
    let endpoint = `${getApiUrl()}${getLeaguesPath()}/${leagueId}`;
    if (requireDetails)
      endpoint += "?require_details=true&ts=" + new Date().getTime();
    const response = await fetch(endpoint);

    if (!response.ok) {
      if (response.status === 404) {
        return { isError: true, error: { status: 404 } };
      }

      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as GetLeagueByIdResponse;

    return { isError: false, data: transformToCamelCase(data) as GetLeagueByIdResponse };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Failed to fetch league data:", e);
    return { isError: true, error: { status: 500, message } };
  }
};

export const {
  useGetAllLeaguesQuery,
  useGetLeaguesByStatusQuery,
  useGetLeagueByIdQuery,
  useGetRewardsByLeagueIdAndWalletQuery,
  useGetUserLeagueInfoQuery,
} = leaguesApiSlice;

export interface LeaguesState {
  participant: boolean;
  donator: boolean;
  claimed: boolean;
  refunded: boolean;
  participants: number;
  donators: number;
  estimatedRewards: EstimatedRewardEntry[];
  totalValueLocked: number;
  updateLeagueData: boolean;
}

const initialState: LeaguesState = {
  participant: false,
  donator: false,
  claimed: false,
  refunded: false,
  participants: 0,
  donators: 0,
  estimatedRewards: [],
  totalValueLocked: 0,
  updateLeagueData: false,
};

export const leaguesSlice = createSlice({
  name: "leagues",
  initialState,
  reducers: {
    loadLeagueData: (
      state,
      action: PayloadAction<{
        participants: number;
        donators: number;
        estimatedRewards: EstimatedRewardEntry[];
        totalValueLocked: number;
      }>,
    ) => {
      state.participants = action.payload.participants;
      state.donators = action.payload.donators;
      state.estimatedRewards = action.payload.estimatedRewards;
      state.totalValueLocked = action.payload.totalValueLocked;
    },
    setLeagueInfo: (
      state,
      action: PayloadAction<{
        participant: boolean;
        donator: boolean;
        claimed: boolean;
        refunded: boolean;
      }>,
    ) => {
      state.participant = action.payload.participant;
      state.donator = action.payload.donator;
      state.claimed = action.payload.claimed;
      state.refunded = action.payload.refunded;
    },
    setLeagueParticipant: (state) => {
      state.participant = true;
      state.updateLeagueData = true;
    },
    setLeagueDonator: (state) => {
      state.donator = true;
      state.updateLeagueData = true;
    },
    resetUpdateLeagueData: (state) => {
      state.updateLeagueData = false;
    },
  },
});

export const {
  loadLeagueData,
  setLeagueInfo,
  setLeagueParticipant,
  setLeagueDonator,
  resetUpdateLeagueData,
} = leaguesSlice.actions;

export const selectParticipant = (state: RootState) =>
  state.leagues.participant;
export const selectDonator = (state: RootState) => state.leagues.donator;
export const selectRefunded = (state: RootState) => state.leagues.refunded;
export const selectClaimed = (state: RootState) => state.leagues.claimed;
export const selectParticipants = (state: RootState) =>
  state.leagues.participants;
export const selectDonators = (state: RootState) => state.leagues.donators;
export const selectEstimatedRewards = (state: RootState) =>
  state.leagues.estimatedRewards;
export const selectTotalValueLocked = (state: RootState) =>
  state.leagues.totalValueLocked;
export const selectUpdateLeagueData = (state: RootState) =>
  state.leagues.updateLeagueData;

export default leaguesSlice.reducer;
