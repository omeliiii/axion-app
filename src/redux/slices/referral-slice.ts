import { apiSlice } from "@/redux/slices/api-slice";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  PaginatedCache,
  paginatedMerge,
  paginatedSerializeQueryArgs,
} from "@/redux/paginated-slice";
import { PaginationModel } from "@/model/pagination-model";

const getReferralsPath = () => "/referrals";

export interface GetReferralCodeByUserRequest {
  walletAddress: string;
}

export interface GetReferredFriendsByReferralCodeRequest {
  pagination: PaginationModel;
  referralCode: string;
  leagueId: string;
}

export interface ReferralCode {
  code: string;
  referralProgramId: string;
}

export interface GetReferralCodeByUserResponse {
  total: number;
  referralCodes: ReferralCode[];
}

export interface GetReferredFriendsByReferralCodeResponse {
  total: number;
  referredUsers: string[];
  totalReferredForProgram: number
}

export const referralsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReferralCodeByUser: builder.query({
      query: ({ walletAddress }: GetReferralCodeByUserRequest) => {
        return getReferralsPath() + "/codes/" + walletAddress;
      },
      providesTags: (
        _result: undefined,
        _error: FetchBaseQueryError | undefined,
        arg: GetReferralCodeByUserRequest,
      ) => [
          { type: "ReferralCode" as const, id: arg.walletAddress },
        ],
    }),
    getReferredFriendsByReferralCode: builder.query({
      query: ({
        pagination,
        referralCode,
        leagueId
      }: GetReferredFriendsByReferralCodeRequest) => {
        return (
          getReferralsPath() +
          "/referred/" +
          referralCode +
          "?page=" +
          pagination.pageIndex +
          "&size=" +
          pagination.pageSize +
          "&league_id=" +
          leagueId
        );
      },
      serializeQueryArgs: paginatedSerializeQueryArgs,
      merge: paginatedMerge,
      providesTags: (
        _result: PaginatedCache | undefined,
        _error: FetchBaseQueryError | undefined,
        arg: GetReferredFriendsByReferralCodeRequest,
      ) => [
          { type: "ReferralFriends" as const, id: arg.referralCode },
        ],
    }),
  }),
});

export const {
  useGetReferralCodeByUserQuery,
  useGetReferredFriendsByReferralCodeQuery,
} = referralsApiSlice;