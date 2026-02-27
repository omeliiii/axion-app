"use client";

import { useTranslation } from "@/app/i18n/client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectAddress } from "@/redux/slices/login-slice";
import { AutoSizedList } from "@/components/misc/auto-sized-list";
import {
  DonationItem,
  donationsApiSlice,
  DonationsByLeagueRequest,
  GetDonationsResponse,
} from "@/redux/slices/donations-slice";
import { DonationPopup } from "@/components/overlays/donation-popup";
import { Token } from "@/redux/slices/configs-slice";
import clsx from "clsx";
import { useAmount } from "@/hooks/use-amount";
import { Button } from "@/components/buttons/button";
import { ReactIcon } from "@/components/misc/react-icon";

interface DonationsTabMandatoryProps {
  lng: string;
  leagueId: string;
  leagueStartDate: Date;
  leagueEndDate: Date;
  entryTicketDenom: Token;
}

interface DonationsTabOptionalProps {}

export type DonationsTabProps = DonationsTabMandatoryProps &
  Partial<DonationsTabOptionalProps>;

export const DonationsTab = ({
  lng,
  leagueId,
  leagueStartDate,
  leagueEndDate,
  entryTicketDenom,
}: DonationsTabProps) => {
  const { t } = useTranslation(lng, "leagues");
  const dispatch = useAppDispatch();
  const walletAddress = useAppSelector(selectAddress);
  const { formatAmount } = useAmount();

  const chunkSize = 100;

  const [loadTimestamp, setLoadTimestamp] = useState(0);
  const [data, setData] = useState([] as DonationItem[]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [donationOpen, setDonationOpen] = useState(false);

  useEffect(() => {
    setLoadTimestamp(new Date().getTime());
  }, []);

  useEffect(() => {
    if (loadTimestamp) {
      // First data load
      loadMoreRows();
    }
  }, [loadTimestamp]);

  const loadMoreRows = async (startIndex = 0) => {
    if (isLoading || !hasMore || !loadTimestamp) return;

    setIsLoading(true);

    const newDataResponseAny = (await dispatch(
      donationsApiSlice.endpoints.getDonationsByLeague.initiate({
        leagueId,
        pagination: {
          pageIndex: Math.floor(startIndex / chunkSize),
          pageSize: chunkSize,
        },
      } as DonationsByLeagueRequest) as any,
    )) as any;

    let newDataResponse;
    if (newDataResponseAny.data) {
      newDataResponse = newDataResponseAny.data as GetDonationsResponse;
    }

    if (newDataResponse && newDataResponse && newDataResponse.donations) {
      const newData = newDataResponse.donations;

      if (newData.length < chunkSize) {
        setHasMore(false);
      }

      setData((prevData) => {
        const combinedData = [...prevData];
        newData.forEach((item, index) => {
          const i = startIndex + index;
          if (!combinedData[i]) {
            combinedData[i] = item;
          }
        });
        return combinedData;
      });
    }

    setIsLoading(false);
  };

  const renderRow = ({
    index,
    key,
    style,
  }: {
    index: number;
    key: string;
    style: React.CSSProperties;
  }) => {
    const row = data[index];
    if (!row) return <div key={key} style={style} id={`row-${index}`}></div>;

    const colStyle = {
      fontWeight:
        data[index].walletAddress == walletAddress ? "bold" : "normal",
    };

    return (
      <div key={key} style={style} id={`row-${index}`}>
        <div
          className={
            "w-full h-full flex flex-row justify-between border-t border-baseline-neutral-black border-opacity-20 py-3"
          }
        >
          <span
            style={colStyle}
            className={
              "text-xs text-gray-300 font-manrope leading-5 tracking-wider-sm w-52 inline-block break-words line-clamp-2 overflow-ellipsis"
            }
          >
            {row.walletAddress}
          </span>
          <span
            style={colStyle}
            className={
              "text-xs text-gray-300 font-manrope leading-5 tracking-wider-sm w-20"
            }
          >
            {row.denom.name}{" "}
            {formatAmount(
              row.amount,
              row.denom.decimals,
              Math.min(2, row.denom.decimals),
            )}
          </span>
          <span
            style={colStyle}
            className={
              "text-xs text-gray-300 font-manrope leading-5 tracking-wider-sm w-28 inline-block break-words line-clamp-2 overflow-ellipsis"
            }
          >
            {t(("donation_type_" + row.type) as any)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={"relative flex flex-col gap-4 w-full items-center"}>
      <div className={"w-full flex flex-row justify-between"}>
        <span
          className={
            "text-xs lg:text-sm text-gray-300 font-manrope font-bold leading-6 tracking-wider-sm w-52 inline-block break-words"
          }
        >
          {t("wallet" as any)}
        </span>
        <span
          className={
            "text-xs lg:text-sm text-gray-300 font-manrope font-bold leading-6 tracking-wider-sm w-20"
          }
        >
          {t("amount" as any)}
        </span>
        <span
          className={
            "text-xs lg:text-sm text-gray-300 font-manrope font-bold leading-6 tracking-wider-sm w-28"
          }
        >
          {t("donation_type" as any)}
        </span>
      </div>

      {data && (
        <AutoSizedList
          listId={"donations-list"}
          data={data}
          chunkSize={chunkSize}
          loadMoreRows={loadMoreRows}
          renderRow={renderRow}
          enableInfiniteScrolling
          preventOverscrolling
        />
      )}

      <div className={"flex gap-2 mt-4"}>
        <Button
          label={t("make_donation" as any)}
          onClick={() => {
            setDonationOpen(true);
          }}
          disabled={!walletAddress}
          className="button--icon-right uppercase"
        >
          <ReactIcon iconPath={"/icons/basics/plus-circle.svg"} />
        </Button>
      </div>

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
