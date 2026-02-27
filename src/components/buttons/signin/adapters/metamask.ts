"use client";

import { LeapSnap } from "kujira.js";
import { ConnectAdapterProps } from "./connectAdapterProps";

export const connectMetamask = ({
  chainInfo,
  onSuccess,
  onError,
}: ConnectAdapterProps) => {
  LeapSnap.connect(chainInfo, { feeDenom: "ukuji" })
    .then((metamask) => {
      onSuccess(metamask, "metamask");
    })
    .catch((err) => {
      onError(err, "metamask");
    });
};
