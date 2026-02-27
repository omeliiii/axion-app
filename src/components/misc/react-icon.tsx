"use client";

import { useEffect, useState } from "react";
import log from "loglevel";

interface ReactIconProps {
  iconPath: string;
  className?: string;
  style?: any;
}

export const ReactIcon = ({ iconPath, className, style }: ReactIconProps) => {
  const [Icon, setIcon] = useState(null as null | any);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        const { ReactComponent } = await import(
          `@/../public${iconPath}` as any
        );
        setIcon(() => ReactComponent);
      } catch (error) {
        log.error("Error loading icon:", error);
      }
    };
    loadIcon();
  }, [iconPath]);

  return <span>{Icon && <Icon style={style} className={className} />}</span>;
};
