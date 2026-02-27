"use client";

import {useEffect, useRef, useState} from "react";
import { useTranslation } from "@/app/i18n/client";
import { DonationsTab } from "@/components/cards/tabbed/donations-tab";
import { RulesTab } from "@/components/cards/tabbed/rules-tab";
import { CsrMessage, selectMessage } from "@/redux/slices/csr-message-slice";
import { useAppSelector } from "@/redux/hooks";
import { Token } from "@/redux/slices/configs-slice";
import {useLeagueStatus} from "@/hooks/use-league-status";

interface TabbedCardMandatoryProps {
  lng: string;
  leagueId: string;
  leagueRules: string[];
  leagueStartDate: Date;
  leagueEndDate: Date;
  entryTicketDenom: Token;
}

interface TabbedCardOptionalProps {}

export type TabbedCardProps = TabbedCardMandatoryProps &
  Partial<TabbedCardOptionalProps>;

export const TabbedCard = ({
  lng,
  leagueId,
  leagueRules,
  leagueStartDate,
  leagueEndDate,
  entryTicketDenom,
}: TabbedCardProps) => {
  const { t } = useTranslation(lng, "leagues");
  const message: CsrMessage | null = useAppSelector(selectMessage);
  const [tabs, setTabs] = useState([{
    name: t("rules" as any),
    content: <RulesTab rules={leagueRules} type={'points'} lng={lng} />
  }])
  const tabsRef = useRef(tabs);


  useEffect(() => {
    setSelectedTab(tabs[0].name)
    tabsRef.current = tabs;
  }, [tabs]);

  const status = useLeagueStatus({
    startDate: leagueStartDate,
    endDate: leagueEndDate,
  })

  useEffect(() => {
    switch (status) {
      case 'open':
        setTabs([
          {
            name: t("how_to_participate" as any),
            content: <RulesTab rules={leagueRules} type={'participation'} lng={lng} />
          },
          {
            name: t("rules" as any),
            content: <RulesTab rules={leagueRules} type={'points'} lng={lng} />
          }
        ])
        break

      case 'in_progress':
        setTabs([
          {
            name: t("rules" as any),
            content: <RulesTab rules={leagueRules} type={'points'} lng={lng} />
          }
        ])
        break

      case 'not_active':
        setTabs([
          {
            name: t("how_to_claim_rewards" as any),
            content: <RulesTab rules={leagueRules} type={'claim'} lng={lng} />
          }
        ])
        break
    }
  }, [leagueRules, lng, status, t]);

  const scrollTo = (tabName: string) => {
    const parentElement = document.getElementById(tabName)?.parentElement;

    if (parentElement) {
      const scrollWidth = parentElement.scrollWidth;
      const tabIndex = tabs.findIndex((tab) => tab.name == tabName);

      parentElement.scrollTo({
        left: (tabIndex * scrollWidth) / tabs.length,
        behavior: "smooth",
      });

      setSelectedTab(tabName);
    }
  };

  const [selectedTab, setSelectedTab] = useState(tabs[0].name);

  const selectedTabNameStyle =
    "text-xl lg:text-2xl text-baseline-neutral-white font-manrope leading-6 lg:leading-10 border-b border-baseline-neutral-white";
  const unselectedTabNameStyle =
    "text-xl lg:text-2xl text-gray-400 font-manrope leading-6 lg:leading-10";

  useEffect(() => {
    const debounce = (func: Function, wait: number): (() => void) => {
      let timeout: any;
      return function (...args: any) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
        func(...args);
      };
    };

    const handleScroll = () => {
      const parentElement = document.getElementById("scroll-container");

      if (parentElement) {
        const scrollLeft = parentElement.scrollLeft;
        const scrollWidth = parentElement.scrollWidth;
        const tabWidth = scrollWidth / tabsRef.current.length;

        const tabIndex = Math.round(scrollLeft / tabWidth);
        const tabName = tabsRef.current[tabIndex].name;

        setSelectedTab(tabName);
      }
    };

    const debouncedHandleScroll = debounce(handleScroll, 500);

    const scrollOnArrow = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        setTimeout(handleScroll, 500);
      }
    };

    const container = document.getElementById("scroll-container");

    if (container) {
      container.addEventListener("wheel", debouncedHandleScroll);
      container.addEventListener("drag", debouncedHandleScroll);
      container.addEventListener("dragend", debouncedHandleScroll);
      document.addEventListener("keydown", scrollOnArrow);
      container.addEventListener("touchmove", debouncedHandleScroll);

      // Cleanup event listener on component unmount
      return () => {
        container.removeEventListener("wheel", debouncedHandleScroll);
        container.removeEventListener("drag", debouncedHandleScroll);
        container.removeEventListener("dragend", debouncedHandleScroll);
        document.removeEventListener("keydown", scrollOnArrow);
        container.removeEventListener("touchmove", debouncedHandleScroll);
      };
    }
  }, []);

  return (
    <div
      id={"tabbed"}
      className={
        "w-full h-full bg-baseline-tertiary bg-opacity-40 rounded-lg p-4 lg:p-8 flex flex-col gap-8 items-center"
      }
    >
      <div className={"flex flex-row items-center justify-center gap-10"}>
        {tabs.map((tab, i) => (
          <button
            className={
              selectedTab == tab.name
                ? selectedTabNameStyle
                : unselectedTabNameStyle
            }
            onClick={() => {
              scrollTo(tab.name);
            }}
            key={i}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div
        id={"scroll-container"}
        className={
          "h-full w-full flex flex-row overflow-x-scroll snap-x snap-mandatory scrollbar-hide"
        }
      >
        {tabs.map((tab, i) => (
          <div
            key={i}
            id={tab.name}
            className={"flex flex-shrink-0 w-full snap-center justify-center"}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
