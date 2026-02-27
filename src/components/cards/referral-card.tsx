"use client";

import { useTranslation } from "@/app/i18n/client";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { ReactIcon } from "@/components/misc/react-icon";
import { useReferralContract } from "@/hooks/contracts/use-referral-contract";
import { selectAddress } from "@/redux/slices/login-slice";
import {
  GetReferralCodeByUserRequest,
  GetReferralCodeByUserResponse,
  GetReferredFriendsByReferralCodeRequest,
  GetReferredFriendsByReferralCodeResponse,
  useGetReferralCodeByUserQuery,
  useGetReferredFriendsByReferralCodeQuery,
} from "@/redux/slices/referral-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from "react";
import { PaginationModel } from "@/model/pagination-model";
import { selectParticipant } from "@/redux/slices/leagues-slice";
import log from "loglevel";
import { useGetErrorType } from "@/hooks/contracts/use-get-error-type";
import { ToastProps } from "@/components/overlays/toast";
import { openToast } from "@/redux/slices/configs-slice";
import { Button } from "../buttons/button";
import { IntlFormattedFragment } from "@/components/misc/intl-formatted-fragment";

interface ReferralCardMandatoryProps {
  lng: string;
  referralId: string;
  referralRewardPercent: number,
  leagueId: string
}

interface ReferralCardOptionalProps { }

export type ReferralCardProps = ReferralCardMandatoryProps &
  Partial<ReferralCardOptionalProps>;

export const ReferralCard = ({ lng, referralId, referralRewardPercent, leagueId }: ReferralCardProps) => {
  const { t } = useTranslation(lng, "referral");
  const { t: errors } = useTranslation(lng, "errors");
  const { copyToClipboard } = useCopyToClipboard();
  const { genCode } = useReferralContract();
  const { getErrorType } = useGetErrorType();
  const dispatch = useAppDispatch();

  const walletAddress = useAppSelector(selectAddress);
  const participant = useAppSelector(selectParticipant);

  const [code, setCode] = useState(undefined as undefined | string);
  const [totalReferredFriends, setTotalReferredFriends] = useState(0);
  const [totalReferredForProgram, setTotalReferredForProgram] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const {
    data: getRefCodeRes = {} as GetReferralCodeByUserResponse,
    isSuccess: isGetReferralSuccess,
  } = useGetReferralCodeByUserQuery(
    { walletAddress } as GetReferralCodeByUserRequest,
    { skip: !walletAddress },
  ) as { data: GetReferralCodeByUserResponse; isSuccess: boolean; }

  const {
    data: getRefFriendsRes = {} as GetReferredFriendsByReferralCodeResponse,
    isSuccess: isGetReferredFriendsSuccess,
  } = useGetReferredFriendsByReferralCodeQuery(
    {
      pagination: { pageIndex: 0, pageSize: 10 } as PaginationModel,
      referralCode: code,
      leagueId: leagueId
    } as GetReferredFriendsByReferralCodeRequest,
    { skip: !code },
  ) as unknown as { data: GetReferredFriendsByReferralCodeResponse; isSuccess: boolean };

  const content = code
    ? t("referral_content_code" as any)
    : t("referral_content_no_code" as any);

  useEffect(() => {
    if (isGetReferralSuccess && getRefCodeRes.referralCodes) {
      setCode(
        getRefCodeRes.referralCodes.find(
          (rc) => rc.referralProgramId == referralId,
        )?.code,
      );
    }
  }, [isGetReferralSuccess, getRefCodeRes]);

  useEffect(() => {
    if (isGetReferredFriendsSuccess) {
      setTotalReferredFriends(getRefFriendsRes.total)
      setTotalReferredForProgram(getRefFriendsRes.totalReferredForProgram)
    }
  }, [isGetReferredFriendsSuccess, getRefFriendsRes]);

  const createCode = async () => {
    try {
      setLoading(true);
      const { code, res } = await genCode(referralId);
      const transactionHash = (res as { transactionHash: string }).transactionHash;
      setCode(code);
      log.info(
        "Called gen code with transaction hash: " +
        transactionHash +
        ". Code: " +
        code,
      );
    } catch (error) {
      const errorType = getErrorType(error as Error);
      let errorTitle;
      let errorDescription;

      if (errorType == "generic") {
        errorTitle = errors("gen_code_title" as any) as string;
        errorDescription = errors("gen_code_description" as any) as string;
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
    <div className={"bg-background-gradient p-6 flex flex-col gap-4 rounded-lg backdrop-blur-lg w-full"}>
      <ReferralTitle title={t("referral_content_title" as any)} />

      <p className={"text-baseline-neutral-white font-manrope text-xs lg:text-base leading-4 lg:leading-6 break-words"}>
        <IntlFormattedFragment text={content} />
      </p>

      <p className={"text-gray-400 font-manrope text-xs lg:text-sm leading-3 break-words"}>
        <IntlFormattedFragment text={t('for_example' as any)} />
      </p>

      {participant && (
        <div className={'grid grid-rows-3 grid-cols-1 lg:grid-rows-1 lg:grid-cols-3 w-full gap-6 lg:gap-0 justify-items-center'}>
          <ReferralInfo title={totalReferredFriends.toString()} content={t('friends_invited' as any)} />
          <ReferralInfo title={totalReferredForProgram.toString()} content={t('total_invited' as any)} />
          <ReferralInfo title={((((totalReferredFriends * 100) / totalReferredForProgram) / 100) * referralRewardPercent) + '%'} content={t('earn_on_prize_pool' as any)} />
        </div>
      )}

      {participant && !code && (
        <div className={'self-center flex flex-col w-1/3'}>
          <Button
            label={t("generate" as any)}
            onClick={createCode}
            className="uppercase button--outline"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-blue-500 border-solid" />
            )}
          </Button>
        </div>
      )}

      {participant && code && (
        <div className={'self-center flex flex-col w-1/3'}>
          <Button
            label={code}
            onClick={() =>
              typeof window !== "undefined" &&
              copyToClipboard(window.location.href + "?referralCode=" + code!)
            }
            className="button--icon-right uppercase"
          >
            <ReactIcon iconPath={"/icons/files-folders/documents.svg"} />
          </Button>
        </div>
      )}

      {!participant && (
        <div className={'self-center flex flex-col w-1/3'}>
          <Button
            label={t("join" as any)}
            disabled={true}
            className="uppercase button--outline" />
        </div>
      )}
    </div>
  )
};

const ReferralTitle = ({ title }: { title: string }) => {
  return (
    <div className={"flex flex-row gap-2 items-center justify-start"}>
      <ReactIcon
        iconPath={"/icons/design-dev/code-thin.svg"}
        className={"w-8 h-8"}
      />
      <span
        className={
          "text-baseline-secondary lg:text-2xl font-manrope leading-6 lg:leading-10"
        }
      >
        {title}
      </span>
    </div>
  );
}

const ReferralInfo = ({ title, content }: { title: string, content: string }) => {
  return (
    <div className={'flex flex-col items-center gap-1'}>
      <span className={'text-baseline-neutral-white text-3xl font-manrope font-semibold'}>{title}</span>
      <span className={'text-baseline-neutral-white text-sm font-manrope uppercase'}>{content}</span>
    </div>
  )
}