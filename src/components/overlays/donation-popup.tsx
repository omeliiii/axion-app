"use client";

import clsx from "clsx";
import { ReactIcon } from "@/components/misc/react-icon";
import { useLeagueStatus } from "@/hooks/use-league-status";
import { useTranslation } from "@/app/i18n/client";
import { useEffect, useState } from "react";
import { useLeagueContract } from "@/hooks/contracts/use-league-contract";
import { useAppDispatch } from "@/redux/hooks";
import { TextField } from "@/components/input/text-field";
import { Select, SelectItem } from "@/components/input/select";
import {
  openToast,
  Token,
  TokensRequest,
  TokensResponse,
  useGetTokensQuery,
} from "@/redux/slices/configs-slice";
import log from "loglevel";
import { useGetErrorType } from "@/hooks/contracts/use-get-error-type";
import { ToastProps } from "@/components/overlays/toast";
import {
  leaguesApiSlice,
  setLeagueDonator,
} from "@/redux/slices/leagues-slice";
import { useAmount } from "@/hooks/use-amount";
import { Button } from "../buttons/button";

interface SectionProps {
  title: string;
  description: string;
  show?: boolean;
}

export interface DonationPopupProps {
  lng: string;
  leagueId: string;
  leagueStartDate: Date;
  leagueEndDate: Date;
  leagueEntryTicketDenom: Token;
  open: boolean;
  close: () => void;
}

export const DonationPopup = ({
  lng,
  leagueId,
  leagueStartDate,
  leagueEndDate,
  open,
  close,
  leagueEntryTicketDenom,
}: DonationPopupProps) => {
  const [step, setStep] = useState("choose" as "choose" | "lock" | "full");

  const containerStyle = clsx(
    "focus:will-change-transform backdrop-blur transition-opacity duration-200 fixed w-screen h-screen bg-baseline-neutral-light-black bg-opacity-50" as any,
    {
      "opacity-100 z-50": open,
      "opacity-0 -z-10": !open,
    } as any,
  );

  const innerStyle = clsx(
    "w-[80%] lg:w-[45rem] flex flex-col items-start bg-background-gradient rounded-lg p-8 gap-4 fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform duration-200" as any,
    {
      "scale-100": open,
      "scale-0": !open,
    } as any,
  );

  const resetAndClose = () => {
    setStep("choose");
    close();
  };

  let currentView;
  switch (step) {
    case "choose":
      currentView = (
        <ChooseStep
          lng={lng}
          close={resetAndClose}
          setStep={setStep}
          leagueStartDate={leagueStartDate}
          leagueEndDate={leagueEndDate}
          innerStyle={innerStyle}
        />
      );
      break;

    case "full":
      currentView = (
        <FullStep
          lng={lng}
          leagueId={leagueId}
          innerStyle={innerStyle}
          close={resetAndClose}
        />
      );
      break;

    case "lock":
      currentView = (
        <LockStep
          lng={lng}
          leagueId={leagueId}
          innerStyle={innerStyle}
          close={resetAndClose}
          entryTicketDenom={leagueEntryTicketDenom}
        />
      );
      break;
  }

  return <div className={containerStyle}>{currentView}</div>;
};

interface ChooseStepProps {
  lng: string;
  close: () => void;
  setStep: (step: "full" | "lock") => void;
  leagueStartDate: Date;
  leagueEndDate: Date;
  innerStyle: string;
}

const ChooseStep = ({
  lng,
  close,
  setStep,
  leagueStartDate,
  leagueEndDate,
  innerStyle,
}: ChooseStepProps) => {
  const { t } = useTranslation(lng, "leagues");
  const status = useLeagueStatus({
    startDate: leagueStartDate,
    endDate: leagueEndDate,
  });

  const sections: SectionProps[] = [
    { title: "what_is_it", description: "donation_is_a_way", show: true },
    { title: "how_it_works", description: "tokens_are_invested", show: true },
    {
      title: "donation_types",
      description: "full_donation_lock_value",
      show: status == "in_progress",
    },
  ];

  return (
    <div className={innerStyle}>
      <div className={"flex flex-row w-full justify-between"}>
        <span
          className={
            "text-baseline-neutral-white text-2xl lg:text-3.5xl font-manrope font-medium"
          }
        >
          {t("new_donation" as any)}
        </span>
        <button onClick={close}>
          <ReactIcon
            iconPath={"/icons/basics/x.svg"}
            className={"w-4 h-4 stroke-baseline-neutral-white"}
          />
        </button>
      </div>

      {sections
        .filter((section) => section.show)
        .map((section, i) => (
          <Section
            key={i}
            title={t(section.title as any)}
            description={t(section.description as any)}
          />
        ))}

      <div className={"self-center flex flex-col lg:flex-row gap-4"}>
        <Button
          label={t("full_donation" as any)}
          onClick={() => setStep("full")}
          className="button--icon-right uppercase"
        >
          <ReactIcon iconPath={"/icons/essentials/donations.svg"} />
        </Button>

        <Button
          label={t("lock_value" as any)}
          onClick={() => setStep("lock")}
          className="button--icon-right uppercase"
        >
          <ReactIcon iconPath={"/icons/real-estate/bank.svg"} />
        </Button>
      </div>
    </div>
  );
};

const Section = ({ title, description }: SectionProps) => {
  return (
    <div className={"flex flex-col gap-1 items-start"}>
      <span
        className={
          "text-baseline-neutral-white text-lg lg:text-2xl font-manrope leading-10"
        }
      >
        {title}
      </span>
      <span
        className={
          "text-baseline-neutral-white text-sm lg:text-lg font-manrope leading-7"
        }
      >
        {description}
      </span>
    </div>
  );
};

interface FullStepProps {
  lng: string;
  close: () => void;
  innerStyle: string;
  leagueId: string;
}

const FullStep = ({ lng, close, innerStyle, leagueId }: FullStepProps) => {
  const { t } = useTranslation(lng, "leagues");
  const { t: errors } = useTranslation(lng, "errors");
  const { getErrorType } = useGetErrorType();
  const { donate } = useLeagueContract();
  const dispatch = useAppDispatch();
  const { parseAmount } = useAmount();
  const { data: tokensResponse = { tokens: [] } as TokensResponse } =
    useGetTokensQuery({
      network: process.env.NEXT_PUBLIC_NETWORK,
      leagueId,
    } as TokensRequest) as { data: TokensResponse };

  const [memo, setMemo] = useState("" as string);
  const [amount, setAmount] = useState(0);
  const [denom, setDenom] = useState(undefined as undefined | SelectItem);
  const [isLoading, setLoading] = useState(false);
  const [tokens, setTokens] = useState([] as SelectItem[]);

  const doDonation = async () => {
    try {
      setLoading(true);
      const selectedToken = tokensResponse.tokens.find(
        (token: Token) => token.name == denom!.text,
      )!;
      const { transactionHash } = await donate(
        leagueId,
        parseAmount(amount, selectedToken.decimals).toString(),
        selectedToken.denom,
        memo,
      );
      log.info("Called donation with transaction hash: " + transactionHash);
      dispatch(setLeagueDonator());
      dispatch(
        leaguesApiSlice.util.invalidateTags([
          { type: "League", id: `${leagueId}_true` },
        ]),
      );

      close();
    } catch (error) {
      const errorType = getErrorType(error as Error);
      let errorTitle;
      let errorDescription;

      if (errorType == "generic") {
        errorTitle = errors("donation_title" as any) as string;
        errorDescription = errors("donation_description" as any) as string;
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

  useEffect(() => {
    if (tokensResponse.tokens) {
      setTokens(
        tokensResponse.tokens.map((token) => {
          return {
            iconPath: "/tokens/" + token.name.toLowerCase() + ".svg",
            text: token.name,
          } as SelectItem;
        }),
      );
    }
  }, [tokensResponse?.tokens]);

  return (
    <div className={innerStyle}>
      <div className={"flex flex-row w-full justify-between"}>
        <span
          className={
            "text-baseline-neutral-white text-2xl lg:text-3.5xl font-manrope font-medium"
          }
        >
          {t("make_donation" as any)}
        </span>
        <button onClick={close}>
          <ReactIcon
            iconPath={"/icons/basics/x.svg"}
            className={"w-4 h-4 stroke-baseline-neutral-white"}
          />
        </button>
      </div>

      <label
        className={"text-lg text-baseline-neutral-white font-manrope leading-7"}
        htmlFor={"donation-amount"}
        aria-label={"type amount"}
      >
        {t("type_amount" as any)}
      </label>

      <TextField
        id={"donation-amount"}
        setValue={setAmount}
        placeholder={t("type_amount" as any)}
        initialValue={amount}
        type={"number"}
        pattern={"^-?\\d+(\\.\\d+)?$"}
      >
        <Select id={"donation-denom"} items={tokens} setValue={setDenom} />
      </TextField>

      <label
        className={"text-lg text-baseline-neutral-white font-manrope leading-7"}
        htmlFor={"donation-memo"}
        aria-label={"type message"}
      >
        {t("type_message" as any)}
      </label>

      <div className={"w-full"}>
        <TextField
          disabled
          id={"donation-memo"}
          setValue={setMemo}
          placeholder={t("may_the_best" as any)}
        />
      </div>

      <div className={"self-center"}>
        <Button
          label={t("donate" as any)}
          onClick={doDonation}
          disabled={!amount || !denom?.text}
          className="button--icon-right uppercase button--outline"
        >
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-blue-500 border-solid" />
          )}
          <ReactIcon iconPath={"/icons/essentials/donations.svg"} />
        </Button>
      </div>
    </div>
  );
};

interface LockStepProps {
  lng: string;
  entryTicketDenom: Token;
  close: () => void;
  innerStyle: string;
  leagueId: string;
}

const LockStep = ({
  lng,
  entryTicketDenom,
  close,
  innerStyle,
  leagueId,
}: LockStepProps) => {
  const { t } = useTranslation(lng, "leagues");
  const { t: errors } = useTranslation(lng, "errors");
  const { getErrorType } = useGetErrorType();
  const { doAngel } = useLeagueContract();
  const dispatch = useAppDispatch();
  const { parseAmount } = useAmount();

  const [isLoading, setLoading] = useState(false);

  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState("" as string);

  const angelize = async () => {
    try {
      setLoading(true);
      const { transactionHash } = await doAngel(
        leagueId,
        parseAmount(amount, entryTicketDenom.decimals).toString(),
        entryTicketDenom.denom,
        memo,
      );
      log.info("Called do angel with transaction hash: " + transactionHash);
      dispatch(setLeagueDonator());
      dispatch(
        leaguesApiSlice.util.invalidateTags([
          { type: "League", id: `${leagueId}_true` },
        ]),
      );

      close();
    } catch (error) {
      const errorType = getErrorType(error as Error);
      let errorTitle;
      let errorDescription;

      if (errorType == "generic") {
        errorTitle = errors("lock_value_title" as any) as string;
        errorDescription = errors("lock_value_description" as any) as string;
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
    <div className={innerStyle}>
      <div className={"flex flex-row w-full justify-between"}>
        <span
          className={
            "text-baseline-neutral-white text-2xl lg:text-3.5xl font-manrope font-medium"
          }
        >
          {t("make_donation" as any)}
        </span>
        <button onClick={close}>
          <ReactIcon
            iconPath={"/icons/basics/x.svg"}
            className={"w-4 h-4 stroke-baseline-neutral-white"}
          />
        </button>
      </div>

      <label
        className={"text-lg text-baseline-neutral-white font-manrope leading-7"}
        htmlFor={"donation-amount"}
        aria-label={"type amount"}
      >
        {t("type_amount" as any)}
      </label>

      <TextField
        id={"donation-amount"}
        setValue={setAmount}
        placeholder={
          t(
            "type_amount_angel" as any,
            { currency: entryTicketDenom.name } as any,
          ) as string
        }
        initialValue={amount}
        type={"number"}
        pattern={"^-?\\d+(\\.\\d+)?$"}
      />

      <label
        className={"text-lg text-baseline-neutral-white font-manrope leading-7"}
        htmlFor={"angel-memo"}
        aria-label={"type message"}
      >
        {t("type_message" as any)}
      </label>

      <div className={"w-full"}>
        <TextField
          disabled
          id={"angel-memo"}
          setValue={setMemo}
          placeholder={t("may_the_best" as any)}
        />
      </div>

      <div className={"self-center"}>
        <Button
          label={t("lock_value" as any)}
          onClick={angelize}
          className="button--icon-right uppercase button--outline"
        >
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-blue-500 border-solid" />
          )}
          <ReactIcon iconPath={"/icons/real-estate/bank.svg"} />
        </Button>
      </div>
    </div>
  );
};
