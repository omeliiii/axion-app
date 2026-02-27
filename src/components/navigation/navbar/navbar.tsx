"use client";

import { SignInButton } from "@/components/buttons/signin/signin-button";
import { NavbarButton } from "@/components/navigation/navbar/navbar-button";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useEffect, useState } from "react";
import { MobileNavbar } from "@/components/navigation/navbar/mobile-navbar";

interface NavbarMandatoryProps {
  lng: string;
}

interface NavbarOptionalProps {}

export type NavbarProps = NavbarMandatoryProps & Partial<NavbarOptionalProps>;

export const Navbar = ({ lng }: NavbarProps) => {
  const [isMobile, setMobile] = useState(false);
  const { getSize } = useBreakpoint();

  useEffect(() => {
    const handleResize = () => {
      setMobile(getSize({ others: "mobile", lg: "desktop" }) == "mobile");
    };

    handleResize();

    typeof window !== "undefined" &&
      window.addEventListener("resize", handleResize);
    return () => {
      typeof window !== "undefined" &&
        window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      {isMobile ? (
        <MobileNavbar lng={lng} />
      ) : (
        <nav
          className={
            "flex flex-row gap-12 xl:gap-14 2xl:gap-16 items-center overflow-visible"
          }
          aria-label={"Main Navigation"}
        >
          <div
            className={
              "flex flex-row gap-12 xl:gap-14 2xl:gap-16 items-center overflow-hidden"
            }
          >
            <NavbarButton lng={lng} type={"how_it_works"} />
            <NavbarButton lng={lng} type={"leagues"} />
          </div>
          <SignInButton lng={lng} />
        </nav>
      )}
    </div>
  );
};
