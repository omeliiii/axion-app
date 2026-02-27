"use client";

import useCountdown from "@/hooks/use-countdown";
import clsx from "clsx";

interface LeagueCountdownMandatoryProps {
  lng: string;
  leagueEndDate: Date;
  primary: boolean;
}

interface LeagueCountdownOptionalProps {}

export type LeagueCountdownProps = LeagueCountdownMandatoryProps &
  Partial<LeagueCountdownOptionalProps>;

export const LeagueCountdown = ({
  lng,
  leagueEndDate,
  primary,
}: LeagueCountdownProps) => {
  const timeLeft = useCountdown(leagueEndDate, lng);

  const spanStyle = clsx(
    "text-baseline-secondary font-manrope lg:font-medium leading-8 lg:leading-10" as any,
    {
      "text-lg lg:text-3.5xl": primary,
      "text-2xl": !primary,
    } as any,
  );

  return <span className={spanStyle}>{timeLeft}</span>;
};
