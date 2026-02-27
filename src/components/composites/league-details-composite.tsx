"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useTranslation } from "@/app/i18n/client";
import { InfoBoxCard } from "@/components/cards/info-box-card";
import { useAppSelector } from "@/redux/hooks";
import {
  selectDonators,
  selectParticipants,
  selectTotalValueLocked,
} from "@/redux/slices/leagues-slice";
import { Token } from "@/redux/slices/configs-slice";
import { useAmount } from "@/hooks/use-amount";
import { LeagueStatus } from "@/hooks/use-league-status";

interface LeagueDetailsCompositeMandatoryProps {
  lng: string;
  leagueStartDate: Date;
  leagueEndDate: Date;
  entryTicketDenom: Token;
  entryTicketAmount: number;
}

interface LeagueDetailsCompositeOptionalProps {}

export type LeagueDetailsCompositeProps = LeagueDetailsCompositeMandatoryProps &
  Partial<LeagueDetailsCompositeOptionalProps>;

export const LeagueDetailsComposite = ({
                                         lng,
                                         leagueStartDate,
                                         leagueEndDate,
                                         entryTicketDenom,
                                         entryTicketAmount
                                       }: LeagueDetailsCompositeProps) => {
  const { t } = useTranslation(lng, "leagues");
  const { formatAmount } = useAmount();

  const [status, setStatus] = useState("open" as LeagueStatus);

  const participants = useAppSelector(selectParticipants);
  const donators = useAppSelector(selectDonators);
  const totalValueLocked = useAppSelector(selectTotalValueLocked);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const date = new Date();
      if (date < leagueStartDate) setStatus("open");
      else if (date > leagueEndDate) setStatus("not_active");
      else setStatus("in_progress");
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const statusStyle = clsx(
    "w-4 h-4 rounded-full" as any,
    {
      "bg-functional-positive": status == "open",
      "bg-functional-warning":
        status == "in_progress" || status == "not_active",
    } as any,
  );

  const informations = [
    {
      icon: "/icons/tasks-chat-events/calendar-tick.svg",
      title: "start_date",
      content: new Intl.DateTimeFormat(lng, {
        day: "numeric",
        month: "short",
      }).format(leagueStartDate),
    },
    {
      icon: "/icons/tasks-chat-events/calendar-x.svg",
      title: "end_date",
      content: new Intl.DateTimeFormat(lng, {
        day: "numeric",
        month: "short",
      }).format(leagueEndDate),
    },
    {
      icon: "/icons/essentials/people.svg",
      title: "participants",
      content: participants?.toString(),
    },
    {
      icon: "/icons/essentials/donations.svg",
      title: "donators",
      content: donators?.toString(),
    },
  ];

  return (
    <div
      className={
        "h-full rounded-lg bg-baseline-tertiary bg-opacity-40 px-8 py-6 lg:py-8 grid grid-flow-row grid-cols-2 grid-rows-[repeat(4,max-content)] lg:grid-rows-4 gap-x-2 gap-y-7 lg:gap-y-0"
      }
    >
      <div className={"flex flex-row gap-2 items-center col-span-2"}>
        <span className={statusStyle} />
        <span
          className={
            "text-sm text-baseline-secondary font-manrope font-bold leading-6 tracking-wider-sm uppercase"
          }
        >
          {t(status as any)}
        </span>
      </div>

      {informations.map((information, i) => (
        <InfoBoxCard
          key={i}
          forceRow={true}
          titleIconPath={information.icon}
          title={t(information.title as any)}
          content={information.content ? information.content : "-"}
          background={false}
          contentSize={"sm"}
        />
      ))}

      <div className={"col-span-2"}>
        <InfoBoxCard
            forceRow={true}
            background={false}
            title={t("entry_ticket" as any)}
            titleIconPath={"/icons/finance/money.svg"}
            content={
              entryTicketDenom ? entryTicketDenom.name + " " + formatAmount(
                      entryTicketAmount,
                      entryTicketDenom.decimals,
                      Math.min(2, entryTicketDenom.decimals),
                  ) : "-"
            }
        />
      </div>
    </div>
  );
};
