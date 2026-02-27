"use client";

import { ConnectAdapterProps } from "./connectAdapterProps";
import { Leap } from "kujira.js";

export const connectLeap = ({
  chainInfo,
  onSuccess,
  onError,
}: ConnectAdapterProps) => {
  Leap.connect(chainInfo, { feeDenom: "ukuji" })
    .then((leap) => {
      onSuccess(leap, "leap");
    })
    .catch((err) => {
      onError(err, "leap");
    });
};
