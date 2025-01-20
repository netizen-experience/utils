import { Join, Stringable } from "@netizen-experience/types";
import { DynamoError } from "./errors";

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
