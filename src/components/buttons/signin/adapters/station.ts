"use client";

import { Station } from "kujira.js";
import { ConnectAdapterProps } from "./connectAdapterProps";

export const connectStation = ({
  chainInfo,
  onSuccess,
  onError,
}: ConnectAdapterProps) => {
  Station.connect(chainInfo)
    .then((station) => {
      onSuccess(station, "xfi");
    })
    .catch((err) => {
      onError(err, "xfi");
    });
};
