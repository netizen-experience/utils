/**
 * Represents a type that can be converted to a string, including string, number, bigint, boolean, null, and undefined.
 */
export type Stringable = string | number | bigint | boolean | null | undefined;

/**
 * Represents a type that can be converted to a JSON value.
 */
export type Jsonable =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly Jsonable[]
  | { readonly [key: string]: Jsonable }
  | { toJSON(): Jsonable };

/**
 * Concatenates elements of an array into a string using a specified separator.
 */
export type Join<A, Sep extends string = ""> = A extends [infer First, ...infer Rest]
  ? Rest extends []
    ? `${First & Stringable}`
    : `${First & Stringable}${Sep}${Join<Rest, Sep>}`
  : "";
