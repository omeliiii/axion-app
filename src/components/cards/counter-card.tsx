import clsx from "clsx";
import { ReactIcon } from "@/components/misc/react-icon";

interface CounterCardMandatoryProps {
  content: string;
  iconPath: string;
  title: string;
  size: "sm" | "md" | "lg";
}

interface CounterCardOptionalProps {}

export type CounterCardProps = CounterCardMandatoryProps &
  Partial<CounterCardOptionalProps>;

export const CounterCard = ({
  content,
  iconPath,
  title,
  size,
}: CounterCardProps) => {
  const contentStyle = clsx(
    "col-span-2 text-baseline-secondary font-manrope font-medium" as any,
    {
      "text-3.5xl leading-10": size === "sm",
      "text-6.5xl leading-19.2": size === "md",
      "text-7.5xl leading-27": size === "lg",
    } as any,
  );

  const containerStyle = clsx(
    "bg-background-gradient rounded-lg inline-grid p-6 grid-cols-[max-content,max-content] grid-rows-[min-content,min-content] grid-flow-row gap-2 items-center" as any,
    {
      "gap-x-2": size !== "sm",
    } as any,
  );

  const titleStyle = clsx(
    "text-baseline-neutral-white font-manrope font-bold tracking-wider" as any,
    {
      "text-sm leading-6": size === "sm",
      "text-xs leading-5": size !== "sm",
    } as any,
  );

  return (
    <div className={containerStyle}>
      <span className={contentStyle}>{content}</span>
      <ReactIcon
        iconPath={iconPath}
        className={"stroke-baseline-neutral-white w-4 h-4"}
      />
      <span className={titleStyle}>{title}</span>
    </div>
  );
};
