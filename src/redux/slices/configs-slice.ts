import { apiSlice } from "@/redux/slices/api-slice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { ToastProps } from "@/components/overlays/toast";

const getConfigsPath = () => "/configs";

export interface WorkingRPCsRequest {
  network: string;
}

export interface WorkingRPCsResponse {
  RPCs: string[];
}

export interface Token {
  name: string;
  svg: string;
  denom: string;
  decimals: number;
}

export interface TokensRequest {
  network: string;
  leagueId?: string;
}

export interface TokensResponse {
  tokens: Token[];
}

export const configsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWorkingRPCs: builder.query({
      query: ({ network }: WorkingRPCsRequest) => {
        return getConfigsPath() + "/rpcs/" + network;
      },
    }),
    getTokens: builder.query({
      query: ({ network, leagueId }: TokensRequest) => {
        let endpoint = getConfigsPath() + "/tokens/" + network;

        if (leagueId) {
          endpoint += "/" + leagueId;
        }

        return endpoint;
      },
    }),
  }),
});

export const { useGetWorkingRPCsQuery, useGetTokensQuery } = configsApiSlice;

interface ConfigsState {
  testnetDisclaimerShown: boolean;
  toast: ToastProps;
}

const initialState: ConfigsState = {
  testnetDisclaimerShown: false,
  toast: {
    level: "success",
    open: false,
  } as ToastProps,
};

export const configsSlice = createSlice({
  name: "configs",
  initialState,
  reducers: {
    showTestnetMessage: (state) => {
      state.testnetDisclaimerShown = true;
    },
    openToast: (state, action: PayloadAction<{ toast: ToastProps }>) => {
      state.toast = action.payload.toast;
    },
    closeToast: (state) => {
      state.toast.open = false;
      state.toast.title = undefined;
      state.toast.description = undefined;
      state.toast.duration = undefined;
    },
  },
});

export const { showTestnetMessage, openToast, closeToast } =
  configsSlice.actions;

export const selectTestnetMessageShown = (state: RootState) =>
  state.configs.testnetDisclaimerShown;
export const selectToast = (state: RootState) => state.configs.toast;

export default configsSlice.reducer;
