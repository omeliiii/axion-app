"use client";

import { ConnectAdapterProps } from "./connectAdapterProps";
import { Sonar } from "kujira.js";

export const connectSonar = ({
  onStart,
  onSuccess,
  onError,
}: ConnectAdapterProps) => {
  Sonar.connect(process.env.NEXT_PUBLIC_NETWORK, {
    request: (uri) => onStart!(uri),
    auto: true,
  })
    .then((sonar) => {
      onSuccess(sonar, "sonar");
    })
    .catch((err) => {
      onError(err, "sonar");
    });
};
