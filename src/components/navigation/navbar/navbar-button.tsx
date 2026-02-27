"use client";

import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/buttons/button";
import { useRouter } from "next/navigation";

export type NavbarButtonType = "how_it_works" | "leagues";

interface NavbarButtonMandatoryProps {
  lng: string;
  type: NavbarButtonType;
}

interface NavbarButtonOptionalProps {}

export type NavbarButtonProps = NavbarButtonMandatoryProps &
  Partial<NavbarButtonOptionalProps>;

export const NavbarButton = ({ lng, type }: NavbarButtonProps) => {
  const { t } = useTranslation(lng, "navigation");
  const router = useRouter();

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#" + id);
    }
  };

  return (
    <Button
      label={t(type as any)}
      onClick={() => scrollTo(type)}
      className="button--transparent uppercase"
    />
  );
};
