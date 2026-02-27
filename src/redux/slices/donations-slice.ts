import { apiSlice } from "@/redux/slices/api-slice";
import { PaginationModel } from "@/model/pagination-model";
import { Token } from "@/redux/slices/configs-slice";

const getDonationsPath = () => "/donations";

export interface DonationsByUserRequest {
  pagination: PaginationModel;
  walletAddress: string;
}

export interface DonationsByLeagueRequest {
  pagination: PaginationModel;
  leagueId: string;
}

export interface DonationItem {
  walletAddress: string;
  amount: number;
  denom: Token;
  transactionHash: string;
  refunded: boolean;
  type: "donation" | "angel";
}

export interface GetDonationsResponse {
  donations: DonationItem[];
}

export const donationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDonations: builder.query({
      query: () => {
        return getDonationsPath();
      },
      providesTags: ["AllDonations"],
    }),
    getDonationsByUser: builder.query({
      query: ({ walletAddress, pagination }: DonationsByUserRequest) => {
        return (
          getDonationsPath() +
          "/user/" +
          walletAddress +
          "?page=" +
          pagination.pageIndex +
          "&size=" +
          pagination.pageSize
        );
      },
      providesTags: ["AllDonations"],
    }),
    getDonationsByLeague: builder.query({
      query: ({ leagueId, pagination }: DonationsByLeagueRequest) => {
        return (
          getDonationsPath() +
          "/league/" +
          leagueId +
          "?page=" +
          pagination.pageIndex +
          "&size=" +
          pagination.pageSize
        );
      },
      providesTags: ["AllDonations"],
    }),
  }),
});

export const {
  useGetAllDonationsQuery,
  useGetDonationsByUserQuery,
  useGetDonationsByLeagueQuery,
} = donationsApiSlice;
