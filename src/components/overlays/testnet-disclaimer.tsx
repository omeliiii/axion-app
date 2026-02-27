"use client";

import { Disclaimer } from "@/components/overlays/disclaimer";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectTestnetMessageShown,
  showTestnetMessage,
} from "@/redux/slices/configs-slice";
import { useEffect, useState } from "react";
import clsx from "clsx";

export interface TestnetDisclaimer {
  lng: string;
}

export const TestnetDisclaimer = ({ lng }: TestnetDisclaimer) => {
  const { t } = useTranslation(lng);
  const dispatch = useAppDispatch();
  const shown = useAppSelector(selectTestnetMessageShown);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!shown) {
      setOpen(true);
    }
  }, [shown]);

  const close = () => {
    dispatch(showTestnetMessage());
    setOpen(false);
  };

  return (
    <div
      className={clsx(
        "fixed top-0 left-0" as any,
        { "-z-10": !open, "z-50": open } as any,
      )}
    >
      <Disclaimer
        title={t("testnet_popup_title" as any) as string}
        description={t("testnet_popup_description" as any) as string}
        open={open}
        action={close}
        close={close}
        buttonText={t("testnet_popup_button" as any) as string}
        buttonIcon={"/icons/authoring/eye.svg"}
      />
    </div>
  );
};
