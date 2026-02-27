"use client";

import clsx from "clsx";
import { ReactIcon } from "@/components/misc/react-icon";
import { useTranslation } from "@/app/i18n/client";
import React, { useEffect, useState } from "react";
import { IntlFormattedFragment } from "@/components/misc/intl-formatted-fragment";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { closeToast, selectToast } from "@/redux/slices/configs-slice";

interface ToastMandatoryProps {
  level: "success" | "warning" | "error";
  open: boolean;
}

interface ToastOptionalProps {
  title: string;
  description: string;
  duration: "short" | "long";
}

export type ToastProps = ToastMandatoryProps & Partial<ToastOptionalProps>;

export const Toast = ({ lng }: { lng: string }) => {
  const { t } = useTranslation(lng);
  const dispatch = useAppDispatch();

  const [closeTimeout, setCloseTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const { level, open, title, description, duration } = useAppSelector(
    selectToast,
  ) as ToastProps;

  const close = () => {
    dispatch(closeToast());
  };

  const divStyle = clsx(
    "fixed z-[60] bottom-6 right-1/2 translate-x-1/2 lg:right-6 lg:translate-x-0 w-2/3 lg:w-[30rem] border rounded-2xl px-4 py-5 grid grid-flow-row grid-cols-[max-content,max-content,1fr] gap-y-2 gap-x-3 shadow-xl transition duration-200",
    {
      "grid-rows-1": !description,
      "grid-rows-[max-content,max-content]": description,
      "border-functional-positive bg-[#EBFFEF]": level === "success",
      "border-functional-warning bg-[#FFFCD7]": level === "warning",
      "border-functional-negative bg-[#FFEEE8]": level === "error",
      "scale-100": open,
      "scale-0": !open,
    },
  );

  const titleStyle = clsx("text-lg font-manrope leading-7", {
    "text-functional-positive": level === "success",
    "text-functional-warning": level === "warning",
    "text-functional-negative": level === "error",
  });

  useEffect(() => {
    if (open) {
      setCloseTimeout(setTimeout(close, duration == "short" ? 3000 : 6000));
    } else if (closeTimeout) {
      clearTimeout(closeTimeout);
    }
  }, [open]);

  return (
    <div className={divStyle}>
      <ReactIcon
        iconPath={"/icons/notifications/" + level + ".svg"}
        className={"w-7 h-7"}
      />
      <span className={titleStyle}>
        {title ? (
          <IntlFormattedFragment text={title} />
        ) : (
          t(("notification_" + level + "_title"))
        )}
      </span>
      <button className={"justify-self-end"} onClick={close}>
        <ReactIcon
          iconPath={"/icons/basics/x.svg"}
          className={"w-4 h-4 stroke-baseline-neutral-black"}
        />
      </button>

      {description && (
        <span
          className={
            "col-span-3 lg:col-span-1 lg:col-start-2 lg:col-end-2 text-center lg:text-start text-baseline-neutral-black font-manrope leading-6 inline-block break-words w-full lg:w-[20rem]"
          }
        >
          <IntlFormattedFragment text={description} />
        </span>
      )}
    </div>
  );
};
