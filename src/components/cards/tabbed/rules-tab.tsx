"use client";

import { AutoSizedList } from "@/components/misc/auto-sized-list";
import React, {useEffect, useState} from "react";
import {useTranslation} from "@/app/i18n/client";

interface RulesTabMandatoryProps {
  rules: string[];
  type: 'participation'|'points'|'claim'
  lng: string
}

interface RulesTabOptionalProps {}

export type RulesTabProps = RulesTabMandatoryProps &
  Partial<RulesTabOptionalProps>;

export const RulesTab = ({ rules, type, lng }: RulesTabProps) => {
  const [list, setList] = useState([] as string[])
  const {t} = useTranslation(lng, 'rules')

  useEffect(() => {
    switch (type) {
      case 'participation':
        setList(Array.from({ length: 6 }, (_, i) => t(`participation_${i + 1}` as any)))
        break

      case 'points':
        setList(rules)
        break

      case 'claim':
        setList(Array.from({ length: 5 }, (_, i) => t(`claim_${i + 1}` as any)))
        break
    }
  }, [type, rules, t]);

  const renderRow = ({
    index,
    key,
    style,
  }: {
    index: number;
    key: string;
    style: React.CSSProperties;
  }) => {
    const row = list[index];

    return (
      <div key={key} style={style} id={`row-${index}`}>
        <div className={"w-full h-full flex flex-row gap-2 items-center border-t border-baseline-neutral-black border-opacity-20 py-3"}>
          <div className={"flex justify-center items-center w-5 h-5 bg-gray-200 rounded"}>
            <span className={"text-gray-800 text-xs font-manrope leading-5 tracking-wider-sm"}>{index + 1}</span>
          </div>
          <span
            className={
              "text-xs text-gray-300 font-manrope leading-5 tracking-wider-sm w-full inline-block break-words line-clamp-2 overflow-ellipsis"
            }
          >
            {row}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={"flex flex-col gap-6 w-full justify-center"}>
      <span className={'text-baseline-neutral-white text-sm font-manrope font-light'}>{t(`${type}_description` as any)}</span>

      {list && (
        <AutoSizedList
          listId={type + "-rules-list"}
          data={list}
          renderRow={renderRow}
          preventOverscrolling
        />
      )}
    </div>
  );
};
