interface ScrollingTextAccordionMandatoryProps {
  value: string;
}

interface ScrollingTextAccordionOptionalProps {
  label: string;
}

export type ScrollingTextAccordionProps = ScrollingTextAccordionMandatoryProps &
  Partial<ScrollingTextAccordionOptionalProps>;

export const ScrollingTextAccordion = ({
  label,
  value,
}: ScrollingTextAccordionProps) => {
  return (
    <div className={"z-10 flex flex-row gap-2 items-center"}>
      {label && (
        <span
          className={
            "z-10 text-sm text-gray-300 font-manrope leading-6 tracking-wider"
          }
        >
          {label}
        </span>
      )}

      <div className={"z-10 px-2 py-1 border border-light-blue-900 rounded-lg"}>
        <span
          className={
            "select-none text-sm text-gray-300 font-manrope font-bold leading-6 tracking-wider"
          }
        >
          {value}
        </span>
      </div>
    </div>
  );
};
