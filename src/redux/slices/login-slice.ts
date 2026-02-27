// /redux/slices/login-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { apiSlice } from "@/redux/slices/api-slice";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface LoginState {
  id: number | null;
  address: string | null;
  publicKey: string | null;
  newUser: boolean | null;
}

const initialState: LoginState = {
  id: null,
  address: null,
  publicKey: null,
  newUser: null,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        id: number | null;
        address: string;
        publicKey: string;
        newUser: boolean;
      }>,
    ) => {
      state.id = action.payload.id;
      state.address = action.payload.address;
      state.publicKey = action.payload.publicKey;
      state.newUser = action.payload.newUser;
    },
    logout: (state) => {
      state.id = null;
      state.address = null;
      state.publicKey = null;
      state.newUser = null;
    },
  },
});

export interface GetUserRequest {
  walletAddress: string;
}

export interface GetUserResponse {
  id: number;
  walletAddress: string;
}

const getUsersPath = () => "/users";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: ({ walletAddress }: GetUserRequest) => {
        return getUsersPath() + "/" + walletAddress;
      },
      providesTags: (
        _result: undefined,
        _error: FetchBaseQueryError | undefined,
        arg: GetUserRequest,
      ) => [
          { type: "User" as const, id: arg.walletAddress },
        ],
    }),
  }),
});

export const { useGetUserQuery } = userApiSlice;

export const { login, logout } = loginSlice.actions;

export const selectAddress = (state: RootState) => state.login.address;
export const selectPublicKey = (state: RootState) => state.login.publicKey;

export default loginSlice.reducer;
