import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, selectAddress } from "@/redux/slices/login-slice";
import React, { useContext, useEffect, useState } from "react";
import { AdapterContext } from "@/contexts/adapterProvider";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import clsx from "clsx";
import { ReactIcon } from "@/components/misc/react-icon";
import { SignInContent } from "@/components/buttons/signin/signin-button";
import { ToastProps } from "@/components/overlays/toast";
import { openToast } from "@/redux/slices/configs-slice";
import { Button } from "@/components/buttons/button";

interface MobileNavbarMandatoryProps {
  lng: string;
}

interface MobileNavbarOptionalProps { }

export type MobileNavbarProps = MobileNavbarMandatoryProps &
  Partial<MobileNavbarOptionalProps>;

export const MobileNavbar = ({ lng }: MobileNavbarProps) => {
  const walletAddress = useAppSelector(selectAddress);
  const dispatch = useAppDispatch();
  const { wallet } = useContext(AdapterContext);
  const router = useRouter();

  const [isSigningIn, setSigningIn] = useState(false);
  const { t } = useTranslation(lng, "navigation");
  const { t: errors } = useTranslation(lng, "errors");
  const [isOpen, setOpen] = useState(false);

  const lineStyle =
    "h-0.5 w-5 rounded-full bg-baseline-neutral-white transition-transform duration-200 origin-center group-hover:will-change-transform";
  const firstLineStyle = clsx(
    lineStyle as any,
    { "rotate-45 translate-y-2": isOpen } as any,
  );
  const secondLineStyle = clsx(
    lineStyle as any,
    { "scale-x-0": isOpen } as any,
  );
  const thirdLineStyle = clsx(
    lineStyle as any,
    { "-rotate-45 -translate-y-2": isOpen } as any,
  );

  const mobileNavbarStyle = clsx(
    "fixed top-0 left-0 h-screen w-screen transition-opacity duration-200 bg-baseline-neutral-black flex flex-col gap-24 py-24 items-center" as any,
    {
      "opacity-0 -z-50": !isOpen,
      "opacity-100 z-40": isOpen,
    } as any,
  );

  const socials = [
    {
      label: "Twitter X",
      callback: () => {
        typeof window !== "undefined" &&
          window.open("https://x.com/AxionLeagues", "_blank");
      },
    },
    {
      label: "Telegram",
      callback: () => {
        typeof window !== "undefined" &&
          window.open("https://t.me/AxionLeagues", "_blank");
      },
    },
    {
      label: "Winkhub",
      callback: () => { },
    },
  ];

  const toggleOpen = () => {
    setOpen(!isOpen);
    setSigningIn(false);
  };

  const toggleSigningIn = () => {
    if (!walletAddress) {
      setSigningIn(!isSigningIn);
    }
  };

  const scrollTo = (id: string) => {
    setOpen(false);
    setSigningIn(false);

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#" + id);
    }
  };

  const openToastError = () => {
    dispatch(
      openToast({
        toast: {
          open: true,
          level: "error",
          duration: "short",
          title: errors("sign_in_title" as any) as string,
          description: errors("sign_in_description" as any) as string,
        } as ToastProps,
      }),
    );
  };

  useEffect(() => {
    if (walletAddress) {
      setSigningIn(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <nav className={"relative"} aria-label={"Main Navigation"}>
      <button
        onClick={toggleOpen}
        className="relative group grid justify-items-center gap-1.5 z-50"
      >
        <span className={firstLineStyle} />
        <span className={secondLineStyle} />
        <span className={thirdLineStyle} />
      </button>

      <div className={mobileNavbarStyle}>
        <button
          className={"flex flex-row gap-2 items-center"}
          onClick={toggleSigningIn}
        >
          <span
            className={
              "text-baseline-secondary text-4xl font-manrope uppercase font-semibold leading-10"
            }
          >
            {walletAddress
              ? walletAddress.substring(0, 10) + "..."
              : t("sign_in" as any)}
          </span>
          <ReactIcon
            iconPath={"/icons/authoring/link.svg"}
            className={"w-6 h-6 stroke-baseline-secondary"}
          />
        </button>

        {isSigningIn ? (
          <div className={"w-80"}>
            <SignInContent
              lng={lng}
              alignment={"center"}
              openToastError={openToastError}
              setOpen={setOpen}
            />
          </div>
        ) : (
          <div className={"flex flex-col justify-center items-center gap-24"}>
            <button
              onClick={() => scrollTo("how_it_works")}
              className={
                "text-baseline-neutral-white text-4xl font-manrope uppercase font-semibold leading-10"
              }
            >
              {t("how_it_works" as any)}
            </button>
            <button
              onClick={() => scrollTo("leagues")}
              className={
                "text-baseline-neutral-white text-4xl font-manrope uppercase font-semibold leading-10"
              }
            >
              {t("leagues" as any)}
            </button>

            {walletAddress && (
              <Button
                label={t("sign_out" as any)}
                className="button--transparent button--small"
                onClick={() => {
                  wallet?.disconnect();
                  dispatch(logout());
                }}
              >
                <ReactIcon iconPath={"/icons/arrows/logout.svg"} />
              </Button>
            )}
          </div>
        )}

        <div
          className={
            "flex flex-row gap-8 absolute bottom-8 left-1/2 -translate-x-1/2"
          }
        >
          {socials.map((social, i) => (
            <button
              className={
                "text-xs text-gray-300 font-manrope leading-4 tracking-wider-sm"
              }
              onClick={social.callback}
              key={i}
            >
              {social.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
