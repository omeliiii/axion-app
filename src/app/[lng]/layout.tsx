import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/redux/store-provider";
import AdapterProvider from "@/contexts/adapterProvider";
import log, { LogLevelDesc } from "loglevel";
import { dir } from "i18next";
import { languages } from "@/app/i18n/settings";
import { ClientParallaxProvider } from "@/contexts/client-parallax-provider";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Axion Leagues",
  description:
    "Join Axion leagues to win prizes without risking your entry ticket",
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

interface RootLayoutProps {
  children: ReactNode;
  params: { lng: string };
}

export default function RootLayout({
  children,
  params: { lng },
}: RootLayoutProps) {
  let logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevelDesc;
  if (!logLevel) logLevel = "info";
  log.setLevel(logLevel);

  return (
    <html lang={lng} dir={dir(lng)}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <meta
          name="description"
          content="Join zero-loss leagues where your entry is guaranteed. Compete, test your skills and earn rewards in every round."
        />
        <meta
          name="keywords"
          content="leagues, competitions, kujira, thorchain, zero-loss, earn"
        />
        <meta property="og:title" content="Axion Leagues" />
        <meta
          property="og:description"
          content="Join Axion leagues, win awesome prizes without risking your entry ticket, that will be refunded at the end of the league."
        />
      </head>
      <body className={"bg-baseline-neutral-light-black"}>
        <StoreProvider>
          <AdapterProvider>
            <ClientParallaxProvider>{children}</ClientParallaxProvider>
          </AdapterProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
