import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

export interface CsrMessage {
  sender: string;
  receiver: string;
  payload: string;
}

interface CsrMessageState {
  message: CsrMessage | null;
}

const initialState: CsrMessageState = {
  message: null,
};

export const csrMessageSlice = createSlice({
  name: "csrMessage",
  initialState,
  reducers: {
    pushMessage: (state, action: PayloadAction<{ message: CsrMessage }>) => {
      state.message = action.payload.message;
    },
    popMessage: (state) => {
      state.message = null;
    },
  },
});

export const { pushMessage, popMessage } = csrMessageSlice.actions;

export const selectMessage = (state: RootState) => state.csrMessage.message;

export default csrMessageSlice.reducer;
