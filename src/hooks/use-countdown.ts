import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";

const useCountdown = (targetDate: Date, lng: string) => {
  const { t } = useTranslation(lng);

  const d = t("days_short" as any);
  const h = t("hours_short" as any);
  const min = t("minutes_short" as any);

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance <= 0) {
      return "0 " + min;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    return `${days} ${d} ${hours} ${h} ${minutes} ${min}`;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  return timeLeft;
};

export default useCountdown;
