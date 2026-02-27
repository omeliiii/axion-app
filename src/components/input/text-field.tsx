"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface TextFieldMandatoryProps {
  setValue: (v: any) => void;
}

interface TextFieldOptionalProps {
  id: string;
  initialValue: string | number;
  placeholder: string;
  type: "number" | "text" | "password";
  pattern: string;
  disabled: boolean;
  children: ReactNode;
}

export type TextFieldProps = TextFieldMandatoryProps &
  Partial<TextFieldOptionalProps>;

export const TextField = ({
  setValue,
  id,
  initialValue,
  placeholder,
  type = "text",
  pattern = "",
  disabled = false,
  children,
}: TextFieldProps) => {
  const textChanged = (e: { target?: { value: string } }) => {
    if (e?.target?.value == undefined) return;

    if (type == "number") {
      const numericValue = parseFloat(e.target.value);
      setValue(isNaN(numericValue) ? 0 : numericValue);
    } else {
      setValue(e.target.value);
    }
  };

  const outerDivStyle = clsx(
    "px-8 py-2 bg-baseline-neutral-white flex flex-row justify-between items-center rounded-lg" as any,
    {
      "opacity-50": disabled,
      "opacity-100": !disabled,
    } as any,
  );

  return (
    <div id={id} className={outerDivStyle}>
      <input
        className={
          "w-full focus:outline-none text-baseline-neutral-black placeholder:text-opacity-60 text-sm lg:text-lg font-manrope leading-5 lg:leading-7"
        }
        placeholder={placeholder}
        aria-placeholder={placeholder}
        pattern={pattern}
        inputMode={type == "number" ? "numeric" : "text"}
        disabled={disabled}
        aria-disabled={disabled}
        value={initialValue}
        onChange={textChanged}
        style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
      />

      {children}
    </div>
  );
};
