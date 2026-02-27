"use client";

import type { AppStore } from "./store";
import { makeStore } from "./store";
import type { ReactNode } from "react";
import { useRef } from "react";
import { Provider } from "react-redux";

interface Props {
  readonly children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return (
    storeRef.current && (
      <Provider store={storeRef.current!}>{children}</Provider>
    )
  );
};
