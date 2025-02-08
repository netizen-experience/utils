import type { NativeAttributeValue } from "@aws-sdk/util-dynamodb";

export type BaseItem = Record<string, NativeAttributeValue>;

export type ExtractPrimaryKey<T> = T extends {
  partitionKey: infer PK extends string;
  sortKey: infer SK extends string;
}
  ? Record<PK | SK, NativeAttributeValue>
  : T extends { partitionKey: infer PK extends string }
    ? Record<PK, NativeAttributeValue>
    : never;

export interface PrimaryKey {
  partitionKey: string;
  sortKey?: string;
}

export interface TableDef<IndexNames extends string> {
  name: string;
  primaryKey: PrimaryKey;
  secondaryIndex: Record<IndexNames, PrimaryKey>;
}
