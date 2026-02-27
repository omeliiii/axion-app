"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  GetLeagueByIdResponse,
  GetLeaguesByIdRequest,
  GetUserLeagueInfoRequest,
  GetUserLeagueInfoResponse,
  LeaguesState,
  loadLeagueData,
  resetUpdateLeagueData,
  selectUpdateLeagueData,
  setLeagueInfo,
  useGetLeagueByIdQuery,
  useGetUserLeagueInfoQuery,
} from "@/redux/slices/leagues-slice";
import { useEffect } from "react";
import { selectAddress } from "@/redux/slices/login-slice";

export const LeagueReduxAdapter = ({
  leagueId,
  participants,
  donators,
  estimatedRewards,
  totalValueLocked,
}: Partial<LeaguesState> & { leagueId: string }) => {
  const dispatch = useAppDispatch();
  const walletAddress = useAppSelector(selectAddress);
  const updateLeagueData = useAppSelector(selectUpdateLeagueData);

  const {
    data: {
      donator,
      participant,
      claimed,
      refunded,
    } = {} as GetUserLeagueInfoResponse,
  } = useGetUserLeagueInfoQuery(
    { leagueId, userWallet: walletAddress } as GetUserLeagueInfoRequest,
    { skip: !walletAddress },
  ) as { data: GetUserLeagueInfoResponse };

  const {
    isFetching,
    data: {
      participants: clientParticipants,
      donators: clientDonators,
      totalValueLocked: clientTotalValueLocked,
      estimatedRewards: clientEstimatedRewards,
    } = {} as GetLeagueByIdResponse,
  } = useGetLeagueByIdQuery(
    { leagueId, requireDetails: true } as GetLeaguesByIdRequest,
    { skip: !updateLeagueData },
  ) as { isFetching: boolean; data: GetLeagueByIdResponse };

  useEffect(() => {
    if (!isFetching) {
      dispatch(resetUpdateLeagueData());
    }
  }, [isFetching]);

  useEffect(() => {
    dispatch(
      loadLeagueData({
        participants: participants!,
        donators: donators!,
        estimatedRewards: estimatedRewards!,
        totalValueLocked: totalValueLocked!,
      }),
    );
  }, [participants, donators, estimatedRewards, totalValueLocked]);

  useEffect(() => {
    if (clientParticipants || clientParticipants == 0) {
      dispatch(
        loadLeagueData({
          participants: clientParticipants,
          donators: clientDonators,
          estimatedRewards: clientEstimatedRewards,
          totalValueLocked: clientTotalValueLocked,
        }),
      );
    }
  }, [
    clientParticipants,
    clientDonators,
    clientTotalValueLocked,
    clientEstimatedRewards,
  ]);

  useEffect(() => {
    dispatch(setLeagueInfo({ donator, participant, claimed, refunded }));
  }, [donator, participant, claimed, refunded]);

  return <></>;
};
