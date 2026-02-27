"use client";

import { ConnectAdapterProps } from "./connectAdapterProps";
import { Xfi } from "kujira.js";

export const connectXfi = ({
  chainInfo,
  onSuccess,
  onError,
}: ConnectAdapterProps) => {
  Xfi.connect(chainInfo, { feeDenom: "ukuji" })
    .then((xfi) => {
      onSuccess(xfi, "xfi");
    })
    .catch((err) => {
      onError(err, "xfi");
    });
};
