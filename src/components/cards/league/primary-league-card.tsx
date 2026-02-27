"use client";

import { useTranslation } from "@/app/i18n/client";
import { ReactIcon } from "@/components/misc/react-icon";
import { LeagueButton } from "@/components/cards/league/league-button";
import clsx from "clsx";
import { RegistrationEnds } from "@/components/cards/league/registration-ends";
import { Token } from "@/redux/slices/configs-slice";
import {useAmount} from "@/hooks/use-amount";

interface PrimaryLeagueCardMandatoryProps {
    lng: string;
    leagueId: string;
    leagueName: string;
    leagueDescription: string;
    leagueStartDate: Date;
    leagueEndDate: Date;
    participants: number;
    entryTicketAmount: number;
    entryTicketDenom: Token;
    leagueReferralId: string;
}

interface PrimaryLeagueCardOptionalProps {
  background: boolean;
}

export type PrimaryLeagueCardProps = PrimaryLeagueCardMandatoryProps &
    Partial<PrimaryLeagueCardOptionalProps>;

export const PrimaryLeagueCard = ({
                                      lng,
                                      leagueId,
                                      leagueName,
                                      leagueDescription,
                                      leagueStartDate,
                                      leagueEndDate,
                                      participants,
                                      entryTicketAmount,
                                      entryTicketDenom,
                                      background = true,
                                      leagueReferralId,
                                  }: PrimaryLeagueCardProps) => {
  const outerStyle = clsx(
    "px-12 w-full grid grid-flow-col justify-between grid-cols-2 lg:grid-cols-[70%,max-content] grid-rows-[repeat(5,max-content)] lg:grid-rows-[repeat(4,max-content)] items-start gap-y-6 lg:gap-y-2" as any,
    {
      "rounded-lg bg-baseline-tertiary bg-opacity-40 py-8 lg:py-20": background,
      "lg:py-8": !background,
    } as any,
  );

  return (
    <div className={outerStyle}>
      <h2
        className={
          "text-baseline-secondary text-4xl lg:text-6.5xl font-manrope font-extrabold uppercase leading-8 lg:leading-15.2"
        }
      >
        {leagueName}
      </h2>
      <h3
        className={
          "text-baseline-neutral-white text-sm lg:text-base font-manrope leading-6 tracking-wider-sm lg:tracking-normal row-start-4 col-start-1 lg:row-start-auto lg:col-start-auto col-span-2 lg:col-span-1"
        }
      >
        {leagueDescription}
      </h3>

        <div className={'flex flex-row gap-2 text-gray-300 items-center'}>
            <ReactIcon iconPath={'/icons/essentials/people.svg'} className={'w-4 h-4 lg:w-8 lg:h-8'} />
            <span className={'font-manrope lg:font-medium leading-8 lg:leading-10 text-lg lg:text-3.5xl'}>{participants}</span>
        </div>

      {background ? (
        <div
          className={
            "mt-1 lg:mt-7 w-96 grid col-start-1 row-start-5 lg:row-start-auto lg:col-start-auto col-span-2 lg:col-span-1"
          }
        >
          <LeagueButton primary={true} lng={lng} leagueId={leagueId} />
        </div>
      ) : (
        <div
          className={
            "mt-1 lg:mt-7 w-full flex flex-row gap-8 col-start-1 row-start-5 lg:row-start-auto lg:col-start-auto items-end col-span-2 lg:col-span-1"
          }
        >
          <LeagueButton
            primary={true}
            lng={lng}
            leagueName={leagueName}
            leagueId={leagueId}
            ordinal={"first"}
            leagueStartDate={leagueStartDate}
            leagueEndDate={leagueEndDate}
            entryTicketAmount={entryTicketAmount}
            entryTicketDenom={entryTicketDenom}
            referralId={leagueReferralId}
          />
          <LeagueButton
            primary={false}
            lng={lng}
            leagueName={leagueName}
            leagueId={leagueId}
            ordinal={"second"}
            leagueStartDate={leagueStartDate}
            leagueEndDate={leagueEndDate}
            entryTicketAmount={entryTicketAmount}
            entryTicketDenom={entryTicketDenom}
            referralId={leagueReferralId}
          />
        </div>
      )}

      <div
        className={
          "lg:row-span-2 row-start-2 col-start-1 lg:row-start-auto lg:col-start-auto"
        }
      >
        <RegistrationEnds
          lng={lng}
          leagueStartDate={leagueStartDate}
          leagueEndDate={leagueEndDate}
        />
      </div>
      <div className={"lg:justify-self-end row-start-2 col-start-2 lg:row-start-auto lg:col-start-auto lg:row-span-2"}>
        <EntryTicket lng={lng} entryTicketAmount={entryTicketAmount} entryTicketDenom={entryTicketDenom} />
      </div>
    </div>
  );
};

interface EntryTicketProps {
    lng: string;
    entryTicketAmount: number;
    entryTicketDenom: Token;
}

const EntryTicket = ({ lng, entryTicketAmount, entryTicketDenom }: EntryTicketProps) => {
  const { t } = useTranslation(lng, "leagues");
    const { formatAmount } = useAmount();

  return (
      <div className={"grid grid-flow-row gap-x-2 grid-cols-[max-content,max-content] grid-rows-[max-content,max-content] lg:justify-items-end items-center text-baseline-neutral-white"}>
          <ReactIcon
              iconPath={"/icons/finance/money.svg"}
              className={"w-auto h-4 lg:w-auto lg:h-8"}
          />

          <h4 className={"text-base lg:text-2xl font-manrope"}>
              {t("entry_ticket" as any)}
          </h4>

          <div className={"col-span-2"}>
              <span className={'text-baseline-secondary font-manrope lg:font-medium leading-8 lg:leading-10 text-lg lg:text-3.5xl'}>
                  {entryTicketDenom ? entryTicketDenom.name + " " + formatAmount(
                      entryTicketAmount,
                      entryTicketDenom.decimals,
                      Math.min(2, entryTicketDenom.decimals),
                  ) : "-"}
              </span>
          </div>
      </div>
  );
};
