import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/login-slice";
import leaguesReducer from "./slices/leagues-slice";
import csrMessageReducer from "./slices/csr-message-slice";
import configsReducer from "./slices/configs-slice";
import { apiSlice } from "./slices/api-slice";
import { combineReducers } from "redux";
import logger from "redux-logger";

const rootReducer = combineReducers({
  login: loginReducer,
  leagues: leaguesReducer,
  csrMessage: csrMessageReducer,
  configs: configsReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      const mdw = getDefaultMiddleware().concat(apiSlice.middleware);

      if (process.env.NEXT_PUBLIC_ENV !== "production") {
        return mdw.concat(logger);
      }

      return mdw;
    },
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];

export default makeStore;
