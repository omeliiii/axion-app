"use client";

import { ReactIcon } from "@/components/misc/react-icon";
import { Navbar } from "@/components/navigation/navbar/navbar";
import { useRouter } from "next/navigation";

export interface HeaderTitleProps {
  lng: string;
}

export const HeaderTitle = ({ lng }: HeaderTitleProps) => {
  const router = useRouter();

  return (
    <div className={"z-40 flex flex-row w-full justify-between items-center"}>
      <button
        className={"flex flex-row items-center gap-1"}
        onClick={() => router.push("/")}
      >
        <ReactIcon
          iconPath={"/logo/togyo-blue-gradient.svg"}
          className={"w-7 lg:w-[3vw] 2xl:w-12"}
        />
        <ReactIcon
          iconPath={"/logo/axion.svg"}
          className={"fill-baseline-neutral-offwhite w-16 lg:w-[7vw] 2xl:w-28"}
        />
      </button>

      <Navbar lng={lng} />
    </div>
  );
};
