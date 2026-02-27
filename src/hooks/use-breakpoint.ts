export interface SizesType {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  xl2?: string;
  others: string;
}

export const useBreakpoint = () => {
  const breakpoints = {
    xl2: 1536,
    xl: 1280,
    lg: 1024,
    md: 768,
    sm: 640,
  } as const;

  const getSize = (sizes: SizesType): string => {
    if (typeof window === "undefined") {
      return sizes.others;
    }

    const breakpointsKeys = Object.keys(breakpoints) as Array<
      keyof typeof breakpoints
    >;

    const actualBreakpoint = breakpointsKeys.find(
      (breakpoint) => window.innerWidth >= breakpoints[breakpoint],
    );

    let sizeToPick: keyof SizesType = "others";

    if (actualBreakpoint) {
      const highestSize = breakpointsKeys.filter(
        (breakpoint, i) =>
          i >= breakpointsKeys.indexOf(actualBreakpoint) && sizes[breakpoint],
      );

      if (highestSize.length > 0)
        sizeToPick = highestSize[0] as keyof SizesType;
    }

    return sizes[sizeToPick] || sizes.others;
  };

  return {
    getSize,
  };
};
