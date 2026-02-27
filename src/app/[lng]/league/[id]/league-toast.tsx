"use client";

import { Toast, ToastProps } from "@/components/overlays/toast";
import { useEffect } from "react";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch } from "@/redux/hooks";
import { openToast } from "@/redux/slices/configs-slice";

interface LeagueToastProps {
  lng: string;
  error: { status: number; message?: string | undefined };
}

export const LeagueToast = ({ lng, error }: LeagueToastProps) => {
  const { t: errors } = useTranslation(lng, "errors");
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error && error.status != 404) {
      dispatch(
        openToast({
          toast: {
            open: true,
            level: "error",
            duration: "long",
            title: errors("league_title" as any) as string,
            description: errors("league_description" as any) as string,
          } as ToastProps,
        }),
      );
    }
  }, [error]);

  return <Toast lng={lng} />;
};
