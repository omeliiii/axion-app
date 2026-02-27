import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import log from "loglevel";
import {
  transformToCamelCase,
  transformToSnakeCase,
} from "@/redux/camel-snake-utils";

export const getApiUrl = (): string => {
  let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    log.info("Using browser URL to get BE endpoint");
    baseUrl =
      "https://" +
      (typeof window !== "undefined" ? window.location.host : "localhost") +
      "/api/v1";
  }

  return baseUrl;
};

const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  if (typeof args === "object" && "body" in args && args.body) {
    args = { ...args, body: transformToSnakeCase(args.body) };
  }

  const baseResult = await fetchBaseQuery({
    baseUrl: getApiUrl(),
    timeout: 120000,
  })(args, api, extraOptions);

  if (baseResult.data) {
    const transformed = transformToCamelCase(baseResult.data) as Record<string, unknown>;

    if (baseResult.meta?.response?.status) {
      transformed.__httpResponseStatus__ = baseResult.meta.response.status;
    }

    return { data: transformed, meta: baseResult.meta };
  }

  return baseResult;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  refetchOnReconnect: true,
  tagTypes: [
    "User",
    "Standings",
    "AllLeagues",
    "League",
    "LeagueRewards",
    "AllDonations",
    "ReferralCode",
    "ReferralFriends",
    "Boosters",
  ],
  endpoints: () => ({}),
});

export const { usePrefetch } = apiSlice;
