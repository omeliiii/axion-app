import { ReactIcon } from "@/components/misc/react-icon";

interface RoadmapCardMandatoryProps {
  title: string;
  content: string;
  iconPath: string;
}

interface RoadmapCardOptionalProps {}

export type RoadmapCardProps = RoadmapCardMandatoryProps &
  Partial<RoadmapCardOptionalProps>;

export const RoadmapCard = ({ title, content, iconPath }: RoadmapCardProps) => {
  return (
    <div
      className={
        "grid grid-flow-row grid-cols-[max-content,1fr] lg:grid-cols-[1fr,max-content,1fr] grid-rows-[1fr,1fr] lg:grid-rows-1 lg:items-center justify-start gap-12 lg:gap-28 lg:px-20"
      }
    >
      <h2
        className={
          "text-2xl lg:text-5xl text-baseline-neutral-white font-manrope font-light leading-7 lg:leading-19.2 row-start-1 col-start-2 lg:row-start-auto lg:col-start-auto self-end lg:self-auto"
        }
      >
        {title}
      </h2>
      <div className={"row-span-2 col-start-1 lg:row-span-1 lg:col-start-auto"}>
        <Divider iconPath={iconPath} />
      </div>
      <h3
        className={
          "text-sm lg:text-xl text-baseline-neutral-white font-manrope font-extralight leading-5 lg:leading-10 row-start-2 col-start-2 lg:row-start-auto lg:col-start-auto self-start lg:self-auto"
        }
      >
        {content}
      </h3>
    </div>
  );
};

interface DividerProps {
  iconPath: string;
}

const Divider = ({ iconPath }: DividerProps) => {
  return (
    <div className={"flex flex-col gap-4 items-center"}>
      <div className={"w-0.5 h-28 bg-light-blue-600"} />
      <ReactIcon
        iconPath={iconPath}
        className={"w-14 h-14 stroke-light-blue-600"}
      />
      <div className={"w-0.5 h-28 bg-light-blue-600"} />
    </div>
  );
};
