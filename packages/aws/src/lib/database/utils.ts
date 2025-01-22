import { DynamoError } from "./errors";

/**
 * Represents a type that can be converted to a string, including string, number, bigint, boolean, null, and undefined.
 */
type Stringable = string | number | bigint | boolean | null | undefined;

/**
 * Concatenates elements of an array into a string using a specified separator.
 */
type Join<A, Sep extends string = ""> = A extends [infer First, ...infer Rest]
  ? Rest extends []
    ? `${First & Stringable}`
    : `${First & Stringable}${Sep}${Join<Rest, Sep>}`
  : "";

export function generatePrefixedKey<Prefixes extends Stringable[], Value extends Stringable>(
  ...args: [...Prefixes, Value]
) {
  return args.join("#") as Join<[...Prefixes, Value], "#">;
}

// @TODO: better generics so return type can be inferred from provided "key"
export function parsePrefixedKey<Value extends string = string>(prefix: string, key: string) {
  const prefixComponent = `${prefix}#`;
  if (!key.startsWith(prefixComponent)) throw new DynamoError("Prefix not found", { context: { prefix, key } });
  return key.replace(prefixComponent, "") as Value;
}
