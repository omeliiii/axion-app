import { useAppSelector } from "@/redux/hooks";
import { selectAddress } from "@/redux/slices/login-slice";
import { useContext, useCallback } from "react";
import { AdapterContext } from "@/contexts/adapterProvider";
import { performAction } from "@/hooks/contracts/contract-utils";

export const useLeagueContract = () => {
  const sender = useAppSelector(selectAddress);
  const { wallet, rpc, kujiQueryClient, protoRegistry } =
    useContext(AdapterContext);

  const assertReady = () => {
    if (!protoRegistry || !kujiQueryClient || !sender || !rpc || !wallet) {
      throw new Error("Wallet not connected or client not initialized");
    }
    return { protoRegistry, queryClient: kujiQueryClient, sender, wallet, rpc };
  };

  const participate = useCallback(
    async (
      leagueId: string,
      leagueTicketAmount: string,
      leagueTicketDenom: string,
      referralCode: string | null,
    ) => {
      const ctx = assertReady();
      const msgContent = referralCode
        ? { participate: { ref_code: referralCode } }
        : { participate: {} };

      return await performAction({
        ...ctx,
        contract: leagueId,
        msgContent,
        amount: leagueTicketAmount,
        denom: leagueTicketDenom,
        memo: null,
      });
    },
    [protoRegistry, kujiQueryClient, sender, wallet, rpc],
  );

  const doAngel = useCallback(
    async (
      leagueId: string,
      amount: string,
      leagueTicketDenom: string,
      memo: string,
    ) => {
      const ctx = assertReady();
      const msgContent = { participate: { amount } };

      return await performAction({
        ...ctx,
        contract: leagueId,
        msgContent,
        amount,
        denom: leagueTicketDenom,
        memo,
      });
    },
    [protoRegistry, kujiQueryClient, sender, wallet, rpc],
  );

  const donate = useCallback(
    async (
      leagueId: string,
      amount: string,
      amountDenom: string,
      memo: string,
    ) => {
      const ctx = assertReady();

      return await performAction({
        ...ctx,
        contract: leagueId,
        msgContent: { donate: {} },
        amount,
        denom: amountDenom,
        memo,
      });
    },
    [protoRegistry, kujiQueryClient, sender, wallet, rpc],
  );

  const refund = useCallback(
    async (leagueId: string) => {
      const ctx = assertReady();

      return await performAction({
        ...ctx,
        contract: leagueId,
        msgContent: { refund: {} },
        amount: "0",
        denom: "ukuji",
        memo: null,
      });
    },
    [protoRegistry, kujiQueryClient, sender, wallet, rpc],
  );

  const claim = useCallback(
    async (leagueId: string) => {
      const ctx = assertReady();

      return await performAction({
        ...ctx,
        contract: leagueId,
        msgContent: { claim: {} },
        amount: "0",
        denom: "ukuji",
        memo: null,
      });
    },
    [protoRegistry, kujiQueryClient, sender, wallet, rpc],
  );

  return { participate, doAngel, donate, refund, claim };
};
