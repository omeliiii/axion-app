"use client";

import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import { ReactIcon } from "@/components/misc/react-icon";

export type NotFoundButtonType = "home" | "how_it_works" | "leagues";

interface NotFoundButtonMandatoryProps {
  lng: string;
  type: NotFoundButtonType;
}

interface NotFoundButtonOptionalProps {}

export type NotFoundButtonProps = NotFoundButtonMandatoryProps &
  Partial<NotFoundButtonOptionalProps>;

export const NotFoundButton = ({ lng, type }: NotFoundButtonProps) => {
  const { t } = useTranslation(lng, "notfound");
  const router = useRouter();

  const links = {
    home: {
      label: "home",
      callback: () => {
        router.push("/");
      },
    },
    how_it_works: {
      label: "how_it_works",
      callback: () => {
        router.push("/#how_it_works");
      },
    },
    leagues: {
      label: "leagues",
      callback: () => {
        router.push("/#leagues");
      },
    },
  };

  const link = links[type];

  return (
    <button
      onClick={link.callback}
      className={
        "ps-8 w-full flex flex-row justify-between items-center bg-gray-200 rounded-lg"
      }
    >
      <span
        className={
          "text-baseline-neutral-black text-xs lg:text-lg font-manrope leading-4 lg:leading-7 tracking-wider-sm"
        }
      >
        {t(link.label as any)}
      </span>
      <div
        className={
          "bg-baseline-secondary rounded-lg px-8 py-4 flex items-center justify-center"
        }
      >
        <ReactIcon
          className={"w-4 h-4 stroke-baseline-neutral-black"}
          iconPath={"/icons/arrows/top-right.svg"}
        />
      </div>
    </button>
  );
};
