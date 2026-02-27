import { ReactNode } from "react";

interface PartnerCompositeMandatoryProps {
  cards: ReactNode[];
}

interface PartnerCompositeOptionalProps {}

export type PartnerCompositeProps = PartnerCompositeMandatoryProps &
  Partial<PartnerCompositeOptionalProps>;

export const PartnerComposite = ({ cards }: PartnerCompositeProps) => {
  return (
    <div
      className={
        "flex flex-row lg:gap-32 items-center w-full lg:w-auto justify-between lg:justify-center"
      }
    >
      {cards.map((card, i) => (
        <div key={i}>{card}</div>
      ))}
    </div>
  );
};
