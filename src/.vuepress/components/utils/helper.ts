export const isString = (val: unknown): val is string =>
  typeof val === "string";

export const startsWith = (str: unknown, prefix: string): boolean =>
  isString(str) && str.startsWith(prefix);

export const endsWith = (str: unknown, suffix: string): boolean =>
  isString(str) && str.endsWith(suffix);

export const keys = Object.keys;