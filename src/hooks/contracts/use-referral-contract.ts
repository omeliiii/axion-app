import { useAppSelector } from "@/redux/hooks";
import { selectAddress } from "@/redux/slices/login-slice";
import { useContext, useCallback } from "react";
import { AdapterContext } from "@/contexts/adapterProvider";
import {
  generateReferralCode,
  performAction,
} from "@/hooks/contracts/contract-utils";

export const useReferralContract = () => {
  const sender = useAppSelector(selectAddress);
  const { wallet, rpc, kujiQueryClient, protoRegistry } =
    useContext(AdapterContext);

  const assertReady = () => {
    if (!protoRegistry || !kujiQueryClient || !sender || !rpc || !wallet) {
      throw new Error("Wallet not connected or client not initialized");
    }
    return { protoRegistry, queryClient: kujiQueryClient, sender, wallet, rpc };
  };

  const genCode = useCallback(
    async (referralId: string, code?: string) => {
      const ctx = assertReady();
      const finalCode = code ?? generateReferralCode();
      const msgContent = { gen_code: { code: finalCode } };

      const res = await performAction({
        ...ctx,
        contract: referralId,
        msgContent,
        amount: "0",
        denom: "ukuji",
        memo: null,
      });

      return { code: finalCode, res };
    },
    [protoRegistry, kujiQueryClient, sender, wallet, rpc],
  );

  const claimRewards = useCallback(
    async (referralId: string) => {
      const ctx = assertReady();

      return await performAction({
        ...ctx,
        contract: referralId,
        msgContent: { claim_rewards: {} },
        amount: "0",
        denom: "ukuji",
        memo: null,
      });
    },
    [protoRegistry, kujiQueryClient, sender, wallet, rpc],
  );

  return { genCode, claimRewards };
};
