"use client";

import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AdapterContext } from "@/contexts/adapterProvider";
import {
  GetUserRequest,
  GetUserResponse,
  login,
  logout,
  selectAddress,
  useGetUserQuery,
} from "@/redux/slices/login-slice";
import clsx from "clsx";
import { useClickOutside } from "@/hooks/use-click-outside";
import { ChainInfo } from "@keplr-wallet/types";
import {
  CHAIN_INFO,
  Keplr,
  Leap,
  LeapSnap,
  Sonar,
  Station,
  Xfi,
} from "kujira.js";
import log from "loglevel";
import { ResponseMetadata } from "@/model/response-metadata";
import { connectSonar } from "@/components/buttons/signin/adapters/sonar";
import { connectLeap } from "@/components/buttons/signin/adapters/leap";
import { connectXfi } from "@/components/buttons/signin/adapters/xfi";
import { connectKeplr } from "@/components/buttons/signin/adapters/keplr";
import { QR } from "react-qr-rounded";
import { ToastProps } from "@/components/overlays/toast";
import { ReactIcon } from "@/components/misc/react-icon";
import {
  configsApiSlice,
  openToast,
  WorkingRPCsRequest,
  WorkingRPCsResponse,
} from "@/redux/slices/configs-slice";
import { Button } from "../button";

interface WalletOption {
  detected: boolean | object | undefined;
  label: string;
  iconPath: string;
  callback: () => Promise<void>;
}

interface SignInButtonMandatoryProps {
  lng: string;
}

export type SignInButtonProps = SignInButtonMandatoryProps;

export const SignInButton = ({ lng }: SignInButtonProps) => {
  const walletAddress = useAppSelector(selectAddress);
  const { t } = useTranslation(lng, "login");
  const { t: errors } = useTranslation(lng, "errors");
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const toggleDropdown = () => setOpen(!open);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeDrop = () => setOpen(false);
  useClickOutside(dropdownRef, closeDrop);

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

  return (
    <div className={"flex items-center"}>
      <Button
        label={
          walletAddress
            ? walletAddress.substring(0, 10) + "..."
            : (t("sign_in") as string)
        }
        className="uppercase button--outline button--icon-right"
        onClick={toggleDropdown}
      >
        <ReactIcon iconPath={"/icons/authoring/link.svg"} />
      </Button>

      <Dropdown
        open={open}
        dropdownRef={dropdownRef}
        lng={lng}
        setOpen={setOpen}
        openToastError={openToastError}
      />
    </div>
  );
};

interface DropdownProps {
  lng: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
  openToastError: () => void;
}

const Dropdown = ({
  lng,
  open,
  setOpen,
  dropdownRef,
  openToastError,
}: DropdownProps) => {
  const divClassName =
    "origin-top-right absolute right-0 top-14 p-6 bg-gray-800 rounded-lg w-60 origin-top-right transition-transform duration-200 z-40";

  const outerStyle = clsx(divClassName, {
    "scale-100": open,
    "scale-0": !open,
  });

  return (
    <div ref={dropdownRef} className={outerStyle}>
      <SignInContent
        lng={lng}
        setOpen={setOpen}
        openToastError={openToastError}
      />
    </div>
  );
};

interface SignInContentProps {
  lng: string;
  alignment?: "start" | "center";
  setOpen: (open: boolean) => void;
  openToastError: () => void;
}

export const SignInContent = ({
  lng,
  alignment = "start",
  setOpen,
  openToastError,
}: SignInContentProps) => {
  const { t } = useTranslation(lng, "login");
  const walletAddress = useAppSelector(selectAddress);
  const { wallet, setWallet, setFastestClient } = useContext(AdapterContext);
  const [sonarLink, setSonarLink] = useState("");
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<string | null>(null);
  const [isClient] = useState(typeof window !== "undefined");
  const [detectedWallets, setDetectedWallets] = useState<WalletOption[]>([]);
  const [undetectedWallets, setUndetectedWallets] = useState<WalletOption[]>([]);
  const dispatch = useAppDispatch();
  const {
    data: getUserResponse = {} as GetUserResponse & ResponseMetadata,
    isSuccess: isGetUserSuccess,
    isError: isGetUserError,
    error: getUserError,
  } = useGetUserQuery(
    { walletAddress: wallet?.account?.address } as GetUserRequest,
    { skip: !wallet?.account?.address },
  ) as unknown as {
    data: GetUserResponse & ResponseMetadata;
    isSuccess: boolean;
    isError: boolean;
    error: { status: number; data?: unknown };
  };

  const subDivClassName = "flex flex-col gap-2";

  useEffect(() => {
    if (isClient) {
      const wallets = [
        {
          detected: true,
          label: "SONAR",
          iconPath: "/wallets/sonar.svg",
          callback: async () => {
            setLoading("SONAR");
            const connectionParams = await getConnectionParams();
            connectSonar({
              ...connectionParams,
              onStart: (uri) => {
                setLoading(null);
                setSonarLink(uri);
              },
            });
          },
        },
        {
          detected: isClient && window.keplr,
          label: "KEPLR",
          iconPath: "/wallets/keplr.svg",
          callback: async () => {
            setLoading("KEPLR");
            const connectionParams = await getConnectionParams();
            connectKeplr(connectionParams);
          },
        },
        {
          detected: isClient && window.leap,
          label: "LEAP",
          iconPath: "/wallets/leap.svg",
          callback: async () => {
            setLoading("LEAP");
            const connectionParams = await getConnectionParams();
            connectLeap(connectionParams);
          },
        },
        {
          detected: isClient && window.xfi && window.xfi.keplr,
          label: "XDEFI",
          iconPath: "/wallets/xfi.svg",
          callback: async () => {
            setLoading("XDEFI");
            const connectionParams = await getConnectionParams();
            connectXfi(connectionParams);
          },
        },
      ];

      setDetectedWallets(wallets.filter((w) => w.detected));
      setUndetectedWallets(wallets.filter((w) => !w.detected));
    }
  }, [isClient]);

  useEffect(() => {
    const doLogin = async () => {
      dispatch(
        login({
          id: getUserResponse.id,
          address: getUserResponse.walletAddress,
          publicKey: publicKey!,
          newUser: getUserResponse.__httpResponseStatus__ == 201,
        }),
      );
    };

    const doLoginNewUser = async () => {
      dispatch(
        login({
          id: null,
          address: wallet?.account.address ?? "",
          publicKey: publicKey!,
          newUser: true,
        }),
      );
    };

    if (isGetUserSuccess) {
      doLogin().then(() => {
        log.info("connected to server with id " + getUserResponse.id);
        if (setOpen) setOpen(false);
      });
    } else if (isGetUserError) {
      if (getUserError.status == 404) {
        doLoginNewUser().then(() => {
          log.info("new user, not connected to server");
          if (setOpen) setOpen(false);
        });
      } else {
        doLogout();
        openToastError();
        log.error("Error signing in: " + JSON.stringify(getUserError));
        if (setOpen) setOpen(false);
      }
    }
  }, [isGetUserSuccess, isGetUserError]);

  const onSuccess = (
    wallet: Sonar | Keplr | Leap | Xfi | Station | LeapSnap,
    adapter: string,
  ) => {
    log.info("connected to chain with adapter " + adapter);
    setSonarLink("");
    setPublicKey(String.fromCharCode(...wallet.account.pubkey));
    setWallet(wallet as unknown as import("@/contexts/adapterProvider").Wallet);
    setLoading(null);
  };

  const onError = (error: unknown, adapter: string) => {
    setSonarLink("");
    log.error("not connected with " + adapter + ": " + JSON.stringify(error));
    setLoading(null);
  };

  const doLogout = () => {
    wallet?.disconnect();
    dispatch(logout());
    setWallet(null);
    if (setOpen) setOpen(false);
  };

  const getConnectionParams = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const RPCsResponseAny = await (dispatch as any)(
      configsApiSlice.endpoints.getWorkingRPCs.initiate({
        network: process.env.NEXT_PUBLIC_NETWORK ?? "",
      } as WorkingRPCsRequest),
    ) as { data?: WorkingRPCsResponse; isError?: boolean; error?: unknown };

    let RPCsResponse;
    if (RPCsResponseAny.data) {
      RPCsResponse = RPCsResponseAny.data as WorkingRPCsResponse;
    }

    if (!RPCsResponse || RPCsResponseAny.isError) {
      log.error(
        "Cannot retrieve working RPCs from server: " +
        JSON.stringify(RPCsResponseAny.error),
      );
      throw new Error("Cannot retrieve working RPCs from server");
    }

    const [, rpc] = await setFastestClient(RPCsResponse.RPCs);

    const chainInfo: ChainInfo = {
      ...(CHAIN_INFO as Record<string, ChainInfo>)[process.env.NEXT_PUBLIC_NETWORK ?? ""],
    };
    const chainInfoWithRpc = {
      ...chainInfo,
      rpc: rpc!,
      chainId:
        process.env.NEXT_PUBLIC_NETWORK == "pond-1"
          ? "kujira-1"
          : chainInfo.chainId,
    };

    log.info("got connection params");

    return { chainInfo: chainInfoWithRpc, onSuccess, onError };
  };

  return (
    <div>
      {sonarLink ? (
        <div className={"flex flex-col items-center gap-6"}>
          <div className={"flex flex-row justify-between items-center w-full"}>
            <button onClick={() => setSonarLink("")}>
              <ReactIcon
                className={"stroke-baseline-neutral-white w-8 h-8"}
                iconPath={"/icons/basics/arrow-left.svg"}
              />
            </button>
            <span
              className={"text-baseline-neutral-white text-xl font-manrope"}
            >
              {t("scan_qr") as string}
            </span>
          </div>

          <QR
            height={256}
            color="#ffffff"
            backgroundColor="transparent"
            rounding={100}
            errorCorrectionLevel="M"
            cutout={true}
            cutoutElement={<ReactIcon iconPath={"/wallets/sonar.svg"} />}
          >
            {sonarLink}
          </QR>
        </div>
      ) : walletAddress ? (
        <div className={subDivClassName}>
          <Button
            label={t("sign_out") as string}
            onClick={doLogout}
            className="button--transparent button--small button--icon-right"
          >
            <ReactIcon iconPath={"/icons/arrows/logout.svg"} />
          </Button>
        </div>
      ) : (
        <div className={subDivClassName}>
          <p className="text-baseline-neutral-white capitalize">
            {t("choose_wallet") as string}
          </p>

          {detectedWallets.map((wallet, i) => (
            <Button
              key={i}
              label={wallet.label}
              className="button--small button--white--outline gap-1"
              onClick={async () => {
                try {
                  await wallet.callback();
                } catch (e) {
                  log.error("Error signing in: " + (e as Error)?.message);
                  openToastError();
                  setLoading(null);
                }
              }}
            >
              {isLoading === wallet.label ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-blue-500 border-solid" />
              ) : (
                <ReactIcon iconPath={wallet.iconPath} />
              )}

            </Button>
          ))}

          {undetectedWallets.length > 0 && (
            <div className={subDivClassName}>
              <p className="capitalize text-baseline-neutral-white">
                {t("undetected_wallets") as string}
              </p>

              {undetectedWallets.map((wallet, i) => (
                <Button
                  key={i}
                  label={wallet.label}
                  disabled={true}
                  className="button--small button--white--outline gap-1"
                >
                  {isLoading === wallet.label ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-blue-500 border-solid" />
                  ) : (
                    <ReactIcon iconPath={wallet.iconPath} />
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
