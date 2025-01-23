import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { DynamoError } from "./errors";
import { BaseItem, ExtractPrimaryKey, TableDef } from "./types";

export interface GetParams<
  IndexNames extends string,
  Table extends TableDef<IndexNames>,
  Item extends BaseItem,
  Schema extends z.ZodType<Item>,
> {
  client: DynamoDBDocumentClient;
  table: Table;
  schema: Schema;
  key: ExtractPrimaryKey<Table["primaryKey"]>;
}

export async function get<
  IndexNames extends string,
  Table extends TableDef<IndexNames>,
  Item extends BaseItem,
  Schema extends z.ZodType<Item>,
>(params: GetParams<IndexNames, Table, Item, Schema>) {
  if (params.key[params.table.primaryKey.partitionKey] === undefined)
    throw new DynamoError("Partition key is required for get operation");
  if (params.table.primaryKey.sortKey && params.key[params.table.primaryKey.sortKey] === undefined)
    throw new DynamoError("Sort key is required for get operation");

  try {
    const { Item: item } = await params.client.send(
      new GetCommand({
        TableName: params.table.name,
        Key: params.key,
      }),
    );

    if (item === undefined) return undefined;

    const parsedItem = params.schema.safeParse(item);
    if (!parsedItem.success) throw new DynamoError("Query result does not match schema");

    return parsedItem.data as z.output<Schema>;
  } catch {
    throw new DynamoError("Failed to perform get command");
  }
}
