import { ChainInfo } from "@keplr-wallet/types";
import { Keplr, Leap, LeapSnap, Sonar, Station, Xfi } from "kujira.js";

export interface ConnectAdapterProps {
  chainInfo: ChainInfo;
  onStart?: (data: string) => void;
  onSuccess: (
    wallet: Sonar | Keplr | Leap | Xfi | Station | LeapSnap,
    adapter: string,
  ) => void;
  onError: (error: unknown, adapter: string) => void;
}
