"use client";

import { ConnectAdapterProps } from "./connectAdapterProps";
import { Keplr } from "kujira.js";

export const connectKeplr = ({
  chainInfo,
  onSuccess,
  onError,
}: ConnectAdapterProps) => {
  Keplr.connect(chainInfo, { feeDenom: "ukuji" })
    .then((keplr) => {
      onSuccess(keplr, "keplr");
    })
    .catch((err) => {
      onError(err, "keplr");
    });
};
