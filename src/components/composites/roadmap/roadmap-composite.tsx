import { ReactNode } from "react";
import { RoadmapBackground } from "@/components/composites/roadmap/roadmap-background";

interface RoadmapCompositeMandatoryProps {
  cards: ReactNode[];
}

interface RoadmapCompositeOptionalProps {}

export type RoadmapCompositeProps = RoadmapCompositeMandatoryProps &
  Partial<RoadmapCompositeOptionalProps>;

export const RoadmapComposite = ({ cards }: RoadmapCompositeProps) => {
  return (
    <div className={"relative overflow-hidden"}>
      <RoadmapBackground />

      <div className={"flex flex-col items-start lg:items-center z-10"}>
        {cards.map((card, i) => (
          <div key={i}>{card}</div>
        ))}
      </div>
    </div>
  );
};
