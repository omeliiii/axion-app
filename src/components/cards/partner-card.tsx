import { ReactIcon } from "@/components/misc/react-icon";

interface PartnerCardMandatoryProps {
  iconPath: string;
  name: string;
}

interface PartnerCardOptionalProps {}

export type PartnerCardProps = PartnerCardMandatoryProps &
  Partial<PartnerCardOptionalProps>;

export const PartnerCard = ({ iconPath, name }: PartnerCardProps) => {
  return (
    <div className={"flex flex-col lg:flex-row items-center gap-2"}>
      <ReactIcon iconPath={iconPath} className={"w-8 h-8 lg:w-14 lg:h-14"} />
      <h4
        className={
          "text-baseline-neutral-white text-base lg:text-2xl font-manrope font-light leading-6 lg:leading-11.2 lg:tracking-widest"
        }
      >
        {name}
      </h4>
    </div>
  );
};
