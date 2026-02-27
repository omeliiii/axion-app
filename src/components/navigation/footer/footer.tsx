import { useTranslation } from "@/app/i18n";
import { ScrollingTextAccordion } from "@/components/accordions/scrolling-text-accordion";
import { ReactIcon } from "@/components/misc/react-icon";
import {
  FooterButton,
  FooterButtonType,
} from "@/components/navigation/footer/footer-button";

interface FooterMandatoryProps {
  lng: string;
}

interface FooterOptionalProps {}

export type FooterProps = FooterMandatoryProps & Partial<FooterOptionalProps>;

export const Footer = async ({ lng }: FooterProps) => {
  const { t } = await useTranslation(lng, "navigation");

  return (
    <footer
      className={"flex flex-col gap-4 lg:gap-6 items-center"}
      aria-label={"Socials and Documentation"}
    >
      <Body lng={lng} />

      <p
        className={
          "text-gray-400 text-xs font-manrope leading-5 tracking-wider self-stretch text-center"
        }
      >
        {t("copyright" as any)}
      </p>
    </footer>
  );
};

interface BodyProps {
  lng: string;
}

const Body = async ({ lng }: BodyProps) => {
  const { t } = await useTranslation(lng, "navigation");

  const types: FooterButtonType[] = ["terms_conditions"]; // , 'documentation'
  const socials: FooterButtonType[] = ["twitter", "telegram"]; // , 'winkhub'

  return (
    <div
      className={
        "relative rounded-lg bg-baseline-neutral-black overflow-hidden w-full"
      }
    >
      <div
        className={
          "flex flex-col lg:flex-row lg:px-12 pb-12 lg:pb-8 pt-12 lg:pt-64 w-full gap-4 lg:gap-20 justify-center items-center"
        }
      >
        <ScrollingTextAccordion
          label={t("connected_to" as any)}
          value={process.env.NEXT_PUBLIC_DISPLAY_NETWORK!}
        />
        {types.map((type, i) => (
          <FooterButton lng={lng} type={type} key={i} />
        ))}
        <div
          className={
            "flex flex-row gap-4 lg:gap-20 justify-center items-center mt-12 lg:mt-0"
          }
        >
          {socials.map((type, i) => (
            <FooterButton lng={lng} type={type} key={i} />
          ))}
        </div>
      </div>

      <ReactIcon
        iconPath={"/logo/togyo-orange-gradient.svg"}
        className={
          "absolute z-0 opacity-60 top-[50%] left-[50%] w-screen lg:w-[68rem] -translate-x-[50%] -translate-y-[50%]"
        }
      />
    </div>
  );
};
