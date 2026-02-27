"use client";

import { AutoSizer, List, ListRowRenderer } from "react-virtualized";
import { useEffect, useState } from "react";
import {SizesType, useBreakpoint} from "@/hooks/use-breakpoint";

interface AutoSizedListMandatoryProps {
  data: any[];
  renderRow: ListRowRenderer;
  listId: string;
}

interface AutoSizedListOptionalProps {
  enableInfiniteScrolling: boolean;
  loadMoreRows: (startIndex: number) => Promise<void>;
  chunkSize: number;
  rowHeight: SizesType;
  listClassName: string
  preventOverscrolling: boolean
}

export type AutoSizedListProps = AutoSizedListMandatoryProps &
  Partial<AutoSizedListOptionalProps>;

export const AutoSizedList = ({data,
                                chunkSize = 100,
                                loadMoreRows,
                                renderRow,
                                enableInfiniteScrolling = false,
                                listId,
                                rowHeight: externalRowHeight = { others: "65" } as SizesType,
                                listClassName = 'w-[100%] h-80 overflow-hidden',
                                preventOverscrolling = false
                              }: AutoSizedListProps) => {
  const { getSize } = useBreakpoint();

  const overscanRowCount = 5;

  const [rowHeight, setRowHeight] = useState(getSize(externalRowHeight!));

  useEffect(() => {
    if (preventOverscrolling) {
      const listElement = document.getElementById(listId);
      if (listElement) {
        listElement.style.overscrollBehavior = "contain";
      }
    }

    const handleResize = () => {
      setRowHeight(getSize(externalRowHeight!));
    };

    typeof window !== "undefined" &&
      window.addEventListener("resize", handleResize);
    return () => {
      typeof window !== "undefined" &&
        window.removeEventListener("resize", handleResize);
    };
  }, []);

  const findFirstEmptyBeforeIndex = (index: number) => {
    for (let i = index - 1; i >= 0; i--) {
      if (!data[i]) {
        return i;
      }
    }
    return -1;
  };

  const handleScroll = ({
    scrollTop,
    clientHeight,
    scrollHeight,
  }: {
    scrollTop: number;
    clientHeight: number;
    scrollHeight: number;
  }) => {
    if (!enableInfiniteScrolling || !loadMoreRows) return;

    // Scroll down - infinite scrolling
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      return loadMoreRows(data.length);
    }

    // Scroll up from user's position
    const currentScrollIndex = Math.floor(scrollTop / +rowHeight);
    const lastNonLoadedElement = findFirstEmptyBeforeIndex(currentScrollIndex);

    if (
      lastNonLoadedElement != -1 &&
      Math.abs(lastNonLoadedElement - currentScrollIndex) < overscanRowCount * 2
    ) {
      return loadMoreRows(
        Math.floor(lastNonLoadedElement / chunkSize) * chunkSize,
      );
    }
  };

  return (
    <div className={listClassName}>
      <AutoSizer>
        {({ height, width }) => (
            <List
                id={listId}
                width={width}
                height={height}
                rowHeight={Number.parseInt(rowHeight)}
                rowRenderer={renderRow}
                rowCount={data.length}
                onScroll={handleScroll}
                overscanRowCount={overscanRowCount}
            />
        )}
      </AutoSizer>
    </div>
  );
};
