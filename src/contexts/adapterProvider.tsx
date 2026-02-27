"use client";

import { createContext, ReactNode, useState } from "react";
import { HttpBatchClient, Tendermint37Client } from "@cosmjs/tendermint-rpc";
import { kujiraQueryClient, KujiraQueryClient } from "kujira.js";
import { EncodeObject, Registry } from "@cosmjs/proto-signing";
import { ibcTypes } from "@cosmjs/stargate/build/modules";
import { wasmTypes } from "@cosmjs/cosmwasm-stargate";
import { defaultRegistryTypes } from "@cosmjs/stargate";
import type { Algo, Pubkey } from "@cosmjs/amino";

// ---------------------------------------------------------------------------
// Wallet Type — represents any connected Cosmos wallet adapter
// ---------------------------------------------------------------------------
export interface WalletAccount {
  address: string;
  pubkey: Uint8Array | null;
  algo: Algo;
}

export interface BroadcastResult {
  transactionHash: string;
  [key: string]: unknown;
}

export interface Wallet {
  account: WalletAccount;
  disconnect: () => void;
  signAndBroadcast: (
    rpc: string,
    msgs: EncodeObject[],
    feeDenom: string,
    memo: string,
  ) => Promise<BroadcastResult>;
}

// ---------------------------------------------------------------------------
// Context Value
// ---------------------------------------------------------------------------
export interface AdapterContextValue {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet | null) => void;
  setFastestClient: (
    RPCs: string[],
  ) => Promise<[Tendermint37Client | null, string | null]>;
  tendermintClient: Tendermint37Client | null;
  kujiQueryClient: KujiraQueryClient | null;
  rpc: string | null;
  protoRegistry: Registry | null;
}

const defaultWallet: Wallet = {
  account: { address: "", pubkey: null, algo: "secp256k1" },
  disconnect: () => { },
  signAndBroadcast: async () => ({ transactionHash: "" }),
};

export const AdapterContext = createContext<AdapterContextValue>({
  wallet: defaultWallet,
  setWallet: () => { },
  setFastestClient: async () => [null, null],
  tendermintClient: null,
  kujiQueryClient: null,
  rpc: null,
  protoRegistry: null,
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
const AdapterProvider = ({ children }: { children: ReactNode | undefined }) => {
  const [wallet, setWallet] = useState<Wallet | null>(defaultWallet);
  const [rpc, setRpc] = useState<string | null>(null);
  const [tendermintClient, setTendermintClient] =
    useState<Tendermint37Client | null>(null);
  const [kujiQueryClient, setKujiQueryClient] =
    useState<KujiraQueryClient | null>(null);
  const [protoRegistry, setProtoRegistry] = useState<Registry | null>(null);

  const verifyClient = async (
    endpoint: string,
  ): Promise<[Tendermint37Client, string]> => {
    const newClient = await Tendermint37Client.create(
      new HttpBatchClient(endpoint, {
        dispatchInterval: 100,
        batchSizeLimit: 200,
      }),
    );

    return [newClient, endpoint];
  };

  const setFastestClient = async (
    RPCs: string[],
  ): Promise<[Tendermint37Client | null, string | null]> => {
    const [newClient, rpc] = await Promise.any(
      RPCs.map((endpoint) => verifyClient(endpoint)),
    );
    setTendermintClient(newClient);
    setKujiQueryClient(kujiraQueryClient({ client: newClient }));
    setRpc(rpc);

    const types = [...defaultRegistryTypes, ...wasmTypes, ...ibcTypes];
    setProtoRegistry(new Registry(types));

    return [newClient, rpc];
  };

  return (
    <AdapterContext.Provider
      value={{
        wallet,
        setWallet,
        setFastestClient,
        tendermintClient,
        kujiQueryClient,
        rpc,
        protoRegistry,
      }}
    >
      {children}
    </AdapterContext.Provider>
  );
};

export default AdapterProvider;
