import { useEffect, useState } from "react";

export interface UseLeagueStatusProps {
  startDate?: Date;
  endDate?: Date;
}

export type LeagueStatus = "in_progress" | "not_active" | "open";

export const useLeagueStatus = ({
  startDate,
  endDate,
}: UseLeagueStatusProps) => {
  const [status, setStatus] = useState(null as LeagueStatus | null);

  useEffect(() => {
    if (startDate && endDate) {
      const intervalId = setInterval(() => {
        const date = new Date();
        if (date < startDate) setStatus("open");
        else if (date > endDate) setStatus("not_active");
        else setStatus("in_progress");
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, []);

  return status;
};
