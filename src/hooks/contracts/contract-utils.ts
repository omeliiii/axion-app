import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import {
  Algo,
  coins,
  encodeEd25519Pubkey,
  encodeSecp256k1Pubkey,
  Pubkey,
} from "@cosmjs/amino";
import { customAlphabet } from "nanoid";
import { KujiraQueryClient } from "kujira.js";
import { accountFromAny } from "@cosmjs/stargate";
import log from "loglevel";
import { EncodeObject, Registry } from "@cosmjs/proto-signing";
import type { Wallet } from "@/contexts/adapterProvider";

const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);

// ---------------------------------------------------------------------------
// Contract Message Builders
// ---------------------------------------------------------------------------
export const getMsgs = (
  sender: string,
  contract: string,
  msg: Uint8Array,
  funds: ReturnType<typeof coins> | null,
): EncodeObject[] => {
  return [
    {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender,
        contract,
        msg,
        funds: funds ?? undefined,
      }),
    },
  ];
};

const encodePublicKey = (pubkey: Uint8Array, algo: Algo): Pubkey => {
  switch (algo) {
    case "secp256k1":
      return encodeSecp256k1Pubkey(pubkey);
    case "ed25519":
      return encodeEd25519Pubkey(pubkey);
    default:
      throw new Error("Unsupported pubkey type.");
  }
};

const executeContract = async (
  wallet: Wallet,
  rpc: string,
  msgs: EncodeObject[],
  memo: string,
) => {
  return await wallet.signAndBroadcast(rpc, msgs, "ukuji", memo);
};

const simulateContract = async (
  protoRegistry: Registry,
  client: KujiraQueryClient,
  wallet: Wallet,
  rpc: string,
  msgs: EncodeObject[],
  memo: string,
) => {
  const accountQuery = await client.auth.account(wallet.account.address);
  if (!accountQuery) throw new Error("Account not found");
  const { sequence } = accountFromAny(accountQuery);

  if (!wallet.account.pubkey) {
    throw new Error("Wallet public key is not available");
  }

  const pubkey = encodePublicKey(wallet.account.pubkey, wallet.account.algo);
  const anyMsgs = msgs.map((m) => protoRegistry.encodeAsAny(m));

  return await client.tx.simulate(anyMsgs, memo, pubkey, sequence);
};

// ---------------------------------------------------------------------------
// Options object pattern — replaces 10 positional parameters
// ---------------------------------------------------------------------------
export interface PerformActionOptions {
  protoRegistry: Registry;
  queryClient: KujiraQueryClient;
  sender: string;
  wallet: Wallet;
  rpc: string;
  contract: string;
  msgContent: Record<string, unknown>;
  amount: string;
  denom: string;
  memo: string | null;
}

export const performAction = async (opts: PerformActionOptions) => {
  const {
    protoRegistry,
    queryClient,
    sender,
    wallet,
    rpc,
    contract,
    msgContent,
    amount,
    denom,
    memo,
  } = opts;

  try {
    const msg = new TextEncoder().encode(JSON.stringify(msgContent));
    const funds = amount !== "0" ? coins(amount, denom) : null;
    const msgs = getMsgs(sender, contract, msg, funds);

    await simulateContract(protoRegistry, queryClient, wallet, rpc, msgs, memo ?? "");
    return await executeContract(wallet, rpc, msgs, memo ?? "");
  } catch (e) {
    log.error(e);
    throw e;
  }
};

// ---------------------------------------------------------------------------
// Referral Code Generator
// ---------------------------------------------------------------------------
export const generateReferralCode = (): string => {
  return nanoid();
};
