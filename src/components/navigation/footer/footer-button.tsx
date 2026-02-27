"use client";

import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/buttons/button";
import { useRouter } from "next/navigation";
import { ElementType } from "react";

export type FooterButtonType =
  | "documentation"
  | "terms_conditions"
  | "privacy_policy"
  | "twitter"
  | "telegram"
  | "winkhub";

interface FooterButtonMandatoryProps {
  lng: string;
  type: FooterButtonType;
}

interface FooterButtonOptionalProps {}

export type FooterButtonProps = FooterButtonMandatoryProps &
  Partial<FooterButtonOptionalProps>;

export const FooterButton = ({ lng, type }: FooterButtonProps) => {
  const { t } = useTranslation(lng, "navigation");

  type LinkType = { label: string; callback: () => void };
  type LinksType = {
    documentation: LinkType;
    terms_conditions: LinkType;
    twitter: LinkType;
    telegram: LinkType;
    winkhub: LinkType;
  };
  const links = {
    /*documentation: {
            label: 'documentation',
            callback: () => {}
        },*/
    terms_conditions: {
      label: "terms_conditions",
      callback: () => {
        router.push("/terms");
      },
    },
    twitter: {
      label: "Twitter X",
      callback: () => {
        typeof window !== "undefined" &&
          window.open("https://x.com/AxionLeagues", "_blank");
      },
    },
    telegram: {
      label: "Telegram",
      callback: () => {
        typeof window !== "undefined" &&
          window.open("https://t.me/AxionLeagues", "_blank");
      },
    },
    /*winkhub: {
            label: 'Winkhub',
            callback: () => {}
        }*/
  } as LinksType;

  const link = links[type as keyof LinksType];
  const router = useRouter();

  return (
    <Button
      as={"a" as ElementType}
      label={t(link.label as any)}
      onClick={link.callback}
      className={"button--xsmall button--transparent"}
    />
  );
};
