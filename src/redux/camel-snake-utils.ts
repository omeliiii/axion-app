// ---------------------------------------------------------------------------
// Case transformation utilities for API request/response normalization
// ---------------------------------------------------------------------------

const toSnakeCaseKey = (camelCaseStr: string): string =>
  camelCaseStr.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const toCamelCaseKey = (snakeCaseStr: string): string =>
  snakeCaseStr.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());

/**
 * Recursively transforms all object keys from camelCase to snake_case.
 * Arrays are traversed element-by-element; primitives are returned as-is.
 */
export const transformToSnakeCase = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map((item) => transformToSnakeCase(item));
  }

  if (obj !== null && typeof obj === "object" && obj.constructor === Object) {
    return Object.keys(obj).reduce<Record<string, unknown>>(
      (accumulator, key) => {
        const snakeKey = toSnakeCaseKey(key);
        accumulator[snakeKey] = transformToSnakeCase(
          (obj as Record<string, unknown>)[key],
        );
        return accumulator;
      },
      {},
    );
  }

  return obj;
};

/**
 * Recursively transforms all object keys from snake_case to camelCase.
 * Arrays are traversed element-by-element; primitives are returned as-is.
 */
export const transformToCamelCase = (data: unknown): Record<string, unknown> | unknown => {
  if (data !== null && typeof data === "object") {
    if (Array.isArray(data)) {
      return data.map((item) => transformToCamelCase(item));
    }

    const transformedObject: Record<string, unknown> = {};
    for (const key in data as Record<string, unknown>) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const camelCaseKey = toCamelCaseKey(key);
        transformedObject[camelCaseKey] = transformToCamelCase(
          (data as Record<string, unknown>)[key],
        );
      }
    }
    return transformedObject;
  }

  return data;
};
