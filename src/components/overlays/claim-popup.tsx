"use client";

import clsx from "clsx";
import { ReactIcon } from "@/components/misc/react-icon";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectAddress } from "@/redux/slices/login-slice";
import {
  GetRewardsByLeagueIdAndWalletRequest,
  GetRewardsByLeagueIdAndWalletResponseItem,
  leaguesApiSlice,
  selectClaimed,
  selectRefunded,
  useGetRewardsByLeagueIdAndWalletQuery,
} from "@/redux/slices/leagues-slice";
import { useReferralContract } from "@/hooks/contracts/use-referral-contract";
import { useLeagueContract } from "@/hooks/contracts/use-league-contract";
import {
  GetReferralCodeByUserRequest,
  GetReferralCodeByUserResponse,
  ReferralCode,
  useGetReferralCodeByUserQuery,
} from "@/redux/slices/referral-slice";
import { useAmount } from "@/hooks/use-amount";
import log from "loglevel";
import { useGetErrorType } from "@/hooks/contracts/use-get-error-type";
import { useState } from "react";
import { ToastProps } from "@/components/overlays/toast";
import { openToast } from "@/redux/slices/configs-slice";
import { Button } from "../buttons/button";

export interface ClaimPopupProps {
  lng: string;
  leagueId: string;
  close: () => void;
  open: boolean;
  referralId: string;
}

export const ClaimPopup = ({
  lng,
  leagueId,
  close,
  open,
  referralId,
}: ClaimPopupProps) => {
  const { t } = useTranslation(lng, "leagues");
  const { t: errors } = useTranslation(lng, "errors");
  const userWallet = useAppSelector(selectAddress);
  const { claimRewards: claimReferral } = useReferralContract();
  const { refund, claim: claimPrize } = useLeagueContract();
  const { formatAmount } = useAmount();
  const { getErrorType } = useGetErrorType();
  const dispatch = useAppDispatch();

  const claimed = useAppSelector(selectClaimed);
  const refunded = useAppSelector(selectRefunded);

  const [isLoading, setLoading] = useState(false);

  const {
    data: rewardsResponse = [] as GetRewardsByLeagueIdAndWalletResponseItem[],
    isLoading: isGetRewardsLoading,
  } = useGetRewardsByLeagueIdAndWalletQuery(
    { leagueId, userWallet } as GetRewardsByLeagueIdAndWalletRequest,
    { skip: !userWallet },
  ) as {
    data: GetRewardsByLeagueIdAndWalletResponseItem[];
    isLoading: boolean;
  };

  const {
    data: getRefCodeRes = {} as GetReferralCodeByUserResponse,
    isLoading: isGetReferralLoading,
  } = useGetReferralCodeByUserQuery(
    { walletAddress: userWallet } as GetReferralCodeByUserRequest,
    { skip: !userWallet },
  ) as { data: GetReferralCodeByUserResponse; isLoading: boolean };

  const containerStyle = clsx(
    "focus:will-change-transform backdrop-blur transition-opacity duration-200 fixed w-screen h-screen bg-baseline-neutral-light-black bg-opacity-50" as any,
    {
      "opacity-100 z-50": open,
      "opacity-0 -z-10": !open,
    } as any,
  );

  const innerStyle = clsx(
    "w-[80%] lg:w-[45rem] flex flex-col items-start bg-light-blue-900 rounded-lg p-8 gap-4 fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform duration-200" as any,
    {
      "scale-100": open,
      "scale-0": !open,
    } as any,
  );

  const claim = async () => {
    const refCode = getRefCodeRes?.referralCodes?.find(
      (rc: ReferralCode) => rc.referralProgramId == referralId,
    )?.code;

    try {
      setLoading(true);

      if (refCode) {
        try {
          const { claimReferralTxHash } = await claimReferral(referralId);
          log.info(
            "Called claim referral with transaction hash: " +
              claimReferralTxHash,
          );
        } catch (e) {
          const errorType = getErrorType(e as Error);
          if (errorType != "no_rewards_to_claim") {
            log.info("There are no rewards to claim for referral");
            throw e;
          }
        }
      }

      if (!refunded) {
        const { refundTxHash } = await refund(leagueId);
        log.info("Called refund with transaction hash: " + refundTxHash);
      }

      if (!claimed) {
        try {
          const { claimPrizeTxHash } = await claimPrize(leagueId);
          log.info(
            "Called claim prize with transaction hash: " + claimPrizeTxHash,
          );
        } catch (e) {
          const errorType = getErrorType(e as Error);
          if (errorType != "no_rewards_to_claim") {
            log.info("There are no rewards to claim");
            throw e;
          }
        }
      }

      dispatch(
        leaguesApiSlice.util.invalidateTags([
          { type: "LeagueRewards", id: `${leagueId}_${userWallet}` },
        ]),
      );
      close();
    } catch (error) {
      const errorType = getErrorType(error as Error);
      let errorTitle;
      let errorDescription;

      if (errorType == "generic") {
        errorTitle = errors("claim_title" as any) as string;
        errorDescription = errors("claim_description" as any) as string;
      } else {
        errorTitle = errors((errorType + "_title") as any) as string;
        errorDescription = errors(
          (errorType + "_description") as any,
        ) as string;
      }

      dispatch(
        openToast({
          toast: {
            open: true,
            level: "error",
            duration: "short",
            title: errorTitle,
            description: errorDescription,
          } as ToastProps,
        }),
      );
    }

    setLoading(false);
  };

  return (
    <div className={containerStyle}>
      <div className={innerStyle}>
        <div className={"flex flex-row w-full justify-between"}>
          <span
            className={
              "text-baseline-neutral-white text-2xl lg:text-3.5xl font-manrope font-medium"
            }
          >
            {t("claim" as any)}
          </span>
          <button onClick={close}>
            <ReactIcon
              iconPath={"/icons/basics/x.svg"}
              className={"w-4 h-4 stroke-baseline-neutral-white"}
            />
          </button>
        </div>

        <span className={"text-baseline-neutral-white font-manrope leading-6"}>
          {t("balance_breakdown" as any)}
        </span>

        <div className={"flex flex-col gap-4 w-full"}>
          <div className={"flex flex-row w-full justify-between mb-1"}>
            <span
              className={
                "w-5/12 text-baseline-neutral-white text-sm font-manrope font-bold leading-6 tracking-wider-sm"
              }
            >
              {t("action" as any)}
            </span>
            <span
              className={
                "w-3/12 text-baseline-neutral-white text-sm font-manrope font-bold leading-6 tracking-wider-sm"
              }
            >
              {t("points" as any)}
            </span>
            <span
              className={
                "w-4/12 text-baseline-neutral-white text-sm font-manrope font-bold leading-6 tracking-wider-sm"
              }
            >
              {t("prize" as any)}
            </span>
          </div>

          {rewardsResponse?.map(
            (reward: GetRewardsByLeagueIdAndWalletResponseItem, i: number) => (
              <div key={i} className={"flex flex-row w-full justify-between"}>
                <span
                  className={
                    "w-5/12 text-baseline-neutral-white text-xs font-manrope leading-5 tracking-wider-sm"
                  }
                >
                  {reward.action}
                </span>
                <span
                  className={
                    "w-3/12 text-baseline-neutral-white text-xs font-manrope leading-5 tracking-wider-sm"
                  }
                >
                  {reward.points}
                </span>
                <span
                  className={
                    "w-4/12 text-baseline-neutral-white text-xs font-manrope leading-5 tracking-wider-sm"
                  }
                >
                  {reward.prizeDenom.name}{" "}
                  {formatAmount(
                    reward.prizeAmount,
                    reward.prizeDenom.decimals,
                    Math.min(2, reward.prizeDenom.decimals),
                  )}
                </span>
              </div>
            ),
          )}
        </div>

        <div className={"self-center"}>
          <Button
            label={t("claim" as any)}
            onClick={claim}
            disabled={isGetRewardsLoading || isGetReferralLoading}
            className="button--icon-right uppercase button--outline"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-blue-500 border-solid" />
            )}
            <ReactIcon iconPath={"/icons/finance/money-stack.svg"} />
          </Button>
        </div>
      </div>
    </div>
  );
};
