import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { DynamoError } from "./errors";
import { BaseItem, TableDef } from "./types";

function generateUpdateExpression(attributes: BaseItem) {
  const entries = Object.entries(attributes);
  if (entries.length === 0) throw new DynamoError("No attributes to update");

  const expressions = entries.reduce<{
    setExpression: string;
    removeExpression: string;
    names: Record<string, string>;
    values: BaseItem;
  }>(
    (acc, [key, value]) => {
      if (typeof value === "undefined") {
        acc.removeExpression += `${acc.removeExpression === "" ? "REMOVE" : ","} #${key}`;
        acc.names[`#${key}`] = key;
      } else {
        acc.setExpression += `${acc.setExpression === "" ? "SET" : ","} #${key} = :${key}`;
        acc.names[`#${key}`] = key;
        acc.values[`:${key}`] = value;
      }
      return acc;
    },
    {
      setExpression: "",
      removeExpression: "",
      names: {},
      values: {},
    },
  );

  return {
    UpdateExpression: [expressions.setExpression, expressions.removeExpression].join(" ").trim(),
    ExpressionAttributeNames: expressions.names,
    ExpressionAttributeValues: expressions.values,
  };
}

export interface UpdateParams<
  IndexNames extends string,
  Table extends TableDef<IndexNames>,
  Item extends BaseItem,
  Schema extends z.ZodObject<Item>,
> {
  client: DynamoDBDocumentClient;
  table: Table;
  schema: Schema;
  attributes: Partial<z.infer<Schema>>;
  updateExpression?: string;
}

export async function update<
  IndexNames extends string,
  Table extends TableDef<IndexNames>,
  Item extends BaseItem,
  Schema extends z.ZodObject<Item>,
>(params: UpdateParams<IndexNames, Table, Item, Schema>) {
  const { partitionKey, sortKey } = params.table.primaryKey;
  if (params.attributes[partitionKey] === undefined)
    throw new DynamoError("Partition key is required for update operation");

  if (sortKey && params.attributes[sortKey] === undefined)
    throw new DynamoError("Sort key is required for update operation");

  const parsedKey = params.schema.partial().safeParse({
    [partitionKey]: params.attributes[partitionKey],
    ...(sortKey && { [sortKey]: params.attributes[sortKey] }),
  });
  if (!parsedKey.success) throw new DynamoError("Key does not match schema");

  const parsedAttributes = params.schema.partial().safeParse(
    Object.entries(params.attributes).reduce<BaseItem>((acc, [key, value]) => {
      if (key !== partitionKey && key !== sortKey) acc[key] = value;
      return acc;
    }, {}),
  );
  if (!parsedAttributes.success) throw new DynamoError("Attributes does not match schema");

  const expression = generateUpdateExpression(parsedAttributes.data);

  try {
    await params.client.send(
      new UpdateCommand({
        TableName: params.table.name,
        Key: parsedKey.data,
        ...expression,
        UpdateExpression: params.updateExpression ?? expression.UpdateExpression,
      }),
    );

    return parsedAttributes.data;
  } catch {
    throw new DynamoError("Failed to perform update command");
  }
}
