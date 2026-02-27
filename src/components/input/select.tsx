"use client";

import { ReactIcon } from "@/components/misc/react-icon";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useClickOutside } from "@/hooks/use-click-outside";

export interface SelectItem {
  text: string;
  iconPath?: string;
}

interface SelectMandatoryProps {
  id: string;
  items: SelectItem[];
  setValue: (v: SelectItem) => void;
}

interface SelectOptionalProps {
  initialValueIndex: number;
}

export type SelectProps = SelectMandatoryProps & Partial<SelectOptionalProps>;

export const Select = ({
  id,
  items,
  setValue,
  initialValueIndex = 0,
}: SelectProps) => {
  const [currentSelectionIndex, setCurrentSelectionIndex] =
    useState(initialValueIndex);
  const [currentSelection, setCurrentSelection] = useState(
    items[initialValueIndex] as SelectItem,
  );
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);
  const closeDrop = () => setOpen(false);
  useClickOutside(dropdownRef, closeDrop);

  const arrowStyle = clsx(
    "ms-1 w-4 h-4 transition-transform duration-200 stroke-baseline-neutral-black" as any,
    {
      "rotate-180": open,
    } as any,
  );

  const dropdownStyle = clsx(
    "origin-top-right absolute left-0 top-8 bg-baseline-neutral-white rounded-xl origin-top transition-transform duration-200 z-40 flex flex-col items-start" as any,
    {
      "scale-100": open,
      "scale-0": !open,
    } as any,
  );

  useEffect(() => {
    const current = items[currentSelectionIndex];
    setCurrentSelection(current);
    setValue(current);
  }, [currentSelectionIndex, items, setValue]);

  useEffect(() => {
    const changeOnArrow = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setCurrentSelectionIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : 0,
        );
      } else if (e.key === "ArrowDown") {
        setCurrentSelectionIndex((prevIndex) =>
          prevIndex < items.length - 1 ? prevIndex + 1 : prevIndex,
        );
      }
    };

    const container = document.getElementById(id);

    if (container) {
      container.addEventListener("keydown", changeOnArrow);

      return () => {
        container.removeEventListener("keydown", changeOnArrow);
      };
    }
  }, []);

  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <div className={"flex items-center relative"}>
      <button
        id={id}
        className={"flex flex-row gap-2 items-center"}
        onClick={toggleDropdown}
      >
        {currentSelection?.iconPath && (
          <ReactIcon
            iconPath={currentSelection.iconPath}
            className={"w-6 h-6"}
          />
        )}
        <span
          className={
            "text-baseline-neutral-black text-sm lg:text-lg font-manrope leading-5 lg:leading-7"
          }
        >
          {currentSelection?.text}
        </span>
        {items?.length > 0 && (
          <ReactIcon
            iconPath={"/icons/arrows/arrow-down.svg"}
            className={arrowStyle}
          />
        )}
      </button>

      <div ref={dropdownRef} className={dropdownStyle}>
        {items.map((item, i) => {
          const selected = i == currentSelectionIndex;

          const buttonStyle = clsx(
            "w-full flex flex-row gap-2 py-1 px-4 items-center" as any,
            {
              "transition duration-200 hover:bg-baseline-neutral-light-black hover:bg-opacity-20":
                !selected,
            } as any,
          );

          const spanStyle = clsx(
            "text-baseline-neutral-black text-sm lg:text-lg font-manrope leading-5 lg:leading-7" as any,
            {
              "font-semibold": selected,
            } as any,
          );

          return (
            <button
              key={i}
              id={id}
              className={buttonStyle}
              onClick={() => {
                setCurrentSelectionIndex(i);
                closeDrop();
              }}
              disabled={i == currentSelectionIndex}
              aria-disabled={selected}
            >
              {item?.iconPath && (
                <ReactIcon iconPath={item.iconPath} className={"w-6 h-6"} />
              )}
              <span className={spanStyle}>{item?.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
