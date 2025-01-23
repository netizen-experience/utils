import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { DynamoError } from "./errors";
import { BaseItem, TableDef } from "./types";

export interface CreateParams<
  IndexNames extends string,
  Table extends TableDef<IndexNames>,
  Item extends BaseItem,
  Schema extends z.ZodType<Item>,
> {
  client: DynamoDBDocumentClient;
  table: Table;
  schema: Schema;
  item: z.infer<Schema>;
}

export async function create<
  IndexNames extends string,
  Table extends TableDef<IndexNames>,
  Item extends BaseItem,
  Schema extends z.ZodType<Item>,
>(params: CreateParams<IndexNames, Table, Item, Schema>) {
  const parsedItem = params.schema.safeParse(params.item);
  if (!parsedItem.success) throw new DynamoError("Item does not match schema", { cause: parsedItem.error });

  try {
    await params.client.send(new PutCommand({ TableName: params.table.name, Item: parsedItem.data }));
    return parsedItem.data;
  } catch (e) {
    throw new DynamoError("Failed to perform put command", {
      ...(e instanceof Error && { cause: e }),
    });
  }
}
