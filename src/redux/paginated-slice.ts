// ---------------------------------------------------------------------------
// Paginated RTK Query helpers for infinite-scroll style data merging
// ---------------------------------------------------------------------------

export interface PaginatedCache {
  results?: unknown[];
  [key: string]: unknown;
}

/**
 * Strips pagination params from cache keys so that pages share a single
 * cache entry — required for infinite-scroll merge behavior.
 */
export const paginatedSerializeQueryArgs = <
  T extends { pagination?: { pageIndex: number; pageSize: number } },
>({
  queryArgs,
}: {
  queryArgs: T;
}) => {
  const { pagination, ...rest } = queryArgs;
  return rest;
};

/**
 * Merges new page results into the existing cache by appending to
 * the `results` array. Falls back to replacing the cache entirely
 * on first load (when `currentCache.results` is absent).
 */
export const paginatedMerge = (
  currentCache: PaginatedCache,
  newItems: PaginatedCache,
): PaginatedCache => {
  if (currentCache.results && newItems.results) {
    return {
      ...currentCache,
      ...newItems,
      results: [...currentCache.results, ...newItems.results],
    };
  }
  return newItems;
};

