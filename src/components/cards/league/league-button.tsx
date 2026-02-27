"use client";

import { useTranslation } from "@/app/i18n/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useLeagueStatus } from "@/hooks/use-league-status";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { CsrMessage, pushMessage } from "@/redux/slices/csr-message-slice";
import { useLeagueContract } from "@/hooks/contracts/use-league-contract";
import { selectAddress } from "@/redux/slices/login-slice";
import { useEffect, useState } from "react";
import { DonationPopup } from "@/components/overlays/donation-popup";
import { ClaimPopup } from "@/components/overlays/claim-popup";
import { openToast, Token } from "@/redux/slices/configs-slice";
import {
  leaguesApiSlice,
  selectDonator,
  selectParticipant,
  setLeagueParticipant,
} from "@/redux/slices/leagues-slice";
import { ToastProps } from "@/components/overlays/toast";
import { useGetErrorType } from "@/hooks/contracts/use-get-error-type";
import clsx from "clsx";
import log from "loglevel";
import { ReactIcon } from "@/components/misc/react-icon";
import { Button } from "@/components/buttons/button";

export type LeagueButtonType =
  | "view"
  | "join"
  | "spot"
  | "claim"
  | "donate"
  | "donations";

interface LeagueButtonMandatoryProps {
  lng: string;
  leagueId: string;
  primary: boolean;
}

interface LeagueButtonOptionalProps {
  leagueName: string;
  leagueStartDate: Date;
  leagueEndDate: Date;
  ordinal: "first" | "second";
  entryTicketAmount: number;
  entryTicketDenom: Token;
  referralId: string;
}

export type LeagueButtonProps = LeagueButtonMandatoryProps &
  Partial<LeagueButtonOptionalProps>;

export const LeagueButton = ({
  lng,
  leagueId,
  primary,
  leagueName,
  ordinal,
  leagueStartDate,
  leagueEndDate,
  entryTicketAmount,
  entryTicketDenom,
  referralId,
}: LeagueButtonProps) => {
  const { t } = useTranslation(lng, "leagues");
  const { t: errors } = useTranslation(lng, "errors");
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = useLeagueStatus({
    startDate: leagueStartDate,
    endDate: leagueEndDate,
  });
  const dispatch = useAppDispatch();
  const { participate } = useLeagueContract();
  const { getErrorType } = useGetErrorType();

  const walletAddress = useAppSelector(selectAddress);
  const participant = useAppSelector(selectParticipant);
  const donator = useAppSelector(selectDonator);

  const [donationOpen, setDonationOpen] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [buttonType, setButtonType] = useState(null as null | LeagueButtonType);
  const [callback, setCallback] = useState(() => {
    return () => {};
  });
  const [icon, setIcon] = useState("" as string | undefined);
  const [text, setText] = useState("");
  const [disabled, setDisabled] = useState(false);
  type FirstButtonType = { join: boolean; spot: boolean; claim: boolean };
  const [firstButton, setFirstButton] = useState(
    null as FirstButtonType | null,
  );

  useEffect(() => {
    setFirstButton(
      leagueStartDate
        ? {
            join:
              !walletAddress ||
              (!participant && (status != "not_active" || !donator)),
            spot: status != "not_active" && participant,
            claim: status == "not_active" && (participant || donator),
          }
        : null,
    );
  }, [leagueStartDate, participant, status, donator, walletAddress]);

  useEffect(() => {
    if (ordinal == "first" && firstButton) {
      setButtonType(
        Object.keys(firstButton).find(
          (btn: string) => firstButton![btn as keyof FirstButtonType],
        ) as LeagueButtonType,
      );
    } else if (ordinal == "second") {
      setButtonType(donator || status == "not_active" ? "donations" : "donate");
    } else if (ordinal != "first") {
      setButtonType("view");
    }
  }, [ordinal, firstButton]);

  const openLeague = () => {
    router.push("/league/" + leagueId);
  };

  useEffect(() => {
    switch (buttonType) {
      case "view":
        setCallback(() => openLeague);
        setIcon("/icons/basics/arrow-right.svg");
        setText("view");
        break;

      case "join":
        setCallback(() => async () => {
          const referralCode = searchParams.get("referralCode");

          try {
            setLoading(true);
            const { transactionHash } = await participate(
              leagueId,
              entryTicketAmount!.toString(),
              entryTicketDenom!.denom,
              referralCode,
            );
            log.info(
              "Called participate with transaction hash: " + transactionHash,
            );
            dispatch(setLeagueParticipant());
            dispatch(
              leaguesApiSlice.util.invalidateTags([
                { type: "League", id: `${leagueId}_true` },
              ]),
            );
          } catch (error) {
            const errorType = getErrorType(error as Error);
            let errorTitle;
            let errorDescription;

            if (errorType == "generic") {
              errorTitle = errors("join_league_title" as any) as string;
              errorDescription = errors(
                "join_league_description" as any,
              ) as string;
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
        });
        setIcon("/icons/basics/arrow-right.svg");
        const texts = {
          open: "join_now",
          in_progress: "registration_ended",
          not_active: "league_ended",
        };
        setText(texts[status as "in_progress" | "open" | "not_active"]);
        setDisabled(status != "open" || !walletAddress);
        break;

      case "spot":
        setCallback(() => () => {
          dispatch(
            pushMessage({
              message: {
                sender: "league-button",
                receiver: "leaderboard-composite",
                payload: "spot-me",
              } as CsrMessage,
            }),
          );
        });
        setIcon("/icons/basics/arrow-right.svg");
        setText("spot_leaderboard");
        setDisabled(!walletAddress);
        break;

      case "claim":
        setCallback(() => () => {
          setClaimOpen(true);
        });
        setIcon("/icons/finance/money-stack.svg");
        setText("claim_prizes");
        setDisabled(!walletAddress);
        break;

      case "donate":
        setCallback(() => () => {
          setDonationOpen(true);
        });
        setIcon("/icons/essentials/donations.svg");
        setText("make_donation");
        setDisabled(!walletAddress);
        break;

      case "donations":
        setCallback(() => () => {
          dispatch(
            pushMessage({
              message: {
                sender: "league-button",
                receiver: "tabbed-card",
                payload: "scroll-to-donations",
              } as CsrMessage,
            }),
          );
        });
        setIcon(undefined);
        setText("view_donations");
        setDisabled(false);
        break;
    }
  }, [buttonType, walletAddress, status]);

  return primary ? (
    <div className={"relative"}>
      {buttonType && (
        <Button
          label={t(text as any)}
          onClick={callback}
          disabled={disabled}
          className="button--icon-right uppercase"
        >
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-blue-500 border-solid" />
          )}
          <ReactIcon iconPath={icon as any} />
        </Button>
      )}

      {status == "not_active" && (
        <div
          className={clsx(
            "fixed top-0 left-0" as any,
            { "-z-10": !claimOpen, "z-50": claimOpen } as any,
          )}
        >
          <ClaimPopup
            lng={lng}
            leagueId={leagueId}
            close={() => setClaimOpen(false)}
            open={claimOpen}
            referralId={referralId!}
          />
        </div>
      )}
    </div>
  ) : (
    <div className={"relative"}>
      <Button
        label={t(text as any)}
        onClick={callback}
        disabled={disabled}
        aria-disabled={disabled}
        className="button--icon-right uppercase button--outline"
      >
        {isLoading && (
          <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-blue-500 border-solid" />
        )}
        <ReactIcon iconPath={icon as any} />
      </Button>

      <div
        className={clsx(
          "fixed top-0 left-0" as any,
          { "-z-10": !donationOpen, "z-50": donationOpen } as any,
        )}
      >
        <DonationPopup
          lng={lng}
          leagueId={leagueId}
          leagueStartDate={leagueStartDate!}
          leagueEndDate={leagueEndDate!}
          leagueEntryTicketDenom={entryTicketDenom!}
          open={donationOpen}
          close={() => setDonationOpen(false)}
        />
      </div>
    </div>
  );
};
