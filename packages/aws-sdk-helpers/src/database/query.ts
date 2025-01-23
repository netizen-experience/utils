import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { NativeAttributeValue } from "@aws-sdk/util-dynamodb";
import { z } from "zod";
import { PartialRecord } from "@netizen-experience/types";
import { DynamoError } from "./errors";
import type { BaseItem, TableDef } from "./types";

function generateQueryExpression<IndexNames extends string, Item extends BaseItem>(params: {
  table: TableDef<IndexNames>;
  attributes: Partial<Item>;
  indexName?: IndexNames;
}) {
  let { partitionKey, sortKey } = params.table.primaryKey;
  if (params.indexName !== undefined) {
    const secondaryIndex = params.table.secondaryIndex[params.indexName];
    if (!secondaryIndex) throw new DynamoError("Secondary index not found");
    ({ partitionKey, sortKey } = secondaryIndex);
  }

  if (params.attributes[partitionKey] === undefined)
    throw new DynamoError("Partition key is required for query operation");

  const names: Record<string, string> = {
    [`#${partitionKey}`]: partitionKey,
    ...(sortKey && params.attributes[sortKey] && { [`#${sortKey}`]: sortKey }),
  };
  const values: BaseItem = {
    [`:${partitionKey}`]: params.attributes[partitionKey],
    ...(sortKey && params.attributes[sortKey] && { [`:${sortKey}`]: params.attributes[sortKey] }),
  };
  const keyExpression = `#${partitionKey} = :${partitionKey}${
    sortKey && params.attributes[sortKey] ? ` AND #${sortKey} = :${sortKey}` : ""
  }`;
  const filterExpression = Object.entries(params.attributes)
    .reduce<string[]>((conditions, [key, value]) => {
      if (key !== partitionKey && key !== sortKey) {
        names[`#${key}`] = key;
        values[`:${key}`] = value;
        conditions.push(`#${key} = :${key}`);
      }
      return conditions;
    }, [])
    .join(" AND ");

  return {
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    KeyConditionExpression: keyExpression,
    ...(filterExpression ? { FilterExpression: filterExpression } : {}),
  };
}

export interface QueryParams<
  IndexNames extends string,
  Table extends TableDef<IndexNames>,
  Item extends BaseItem,
  Schema extends z.ZodType<Item>,
> {
  client: DynamoDBDocumentClient;
  table: Table;
  schema: Schema;
  indexName?: IndexNames;
  attributes: PartialRecord<keyof z.infer<Schema>, NativeAttributeValue>;
  keyConditionExpression?: string;
  expressionAttributeNames?: Record<string, string>;
  expressionAttributeValues?: BaseItem;
  filterExpression?: string;
  order?: "ascending" | "descending";
  limit?: number;
  cursor?: Partial<z.infer<Schema>>;
}

export async function query<
  IndexNames extends string,
  Table extends TableDef<IndexNames>,
  Item extends BaseItem,
  Schema extends z.ZodType<Item>,
>(params: QueryParams<IndexNames, Table, Item, Schema>) {
  const expression = generateQueryExpression({
    table: params.table,
    attributes: params.attributes,
    indexName: params.indexName,
  });
  const command = {
    TableName: params.table.name,
    IndexName: params.indexName,
    ExpressionAttributeNames: params.expressionAttributeNames ?? expression.ExpressionAttributeNames,
    ExpressionAttributeValues: params.expressionAttributeValues ?? expression.ExpressionAttributeValues,
    KeyConditionExpression: params.keyConditionExpression ?? expression.KeyConditionExpression,
    FilterExpression: params.filterExpression ?? expression.FilterExpression,
    ScanIndexForward: params.order === undefined ? undefined : params.order === "ascending",
    Limit: params.limit,
    ExclusiveStartKey: params.cursor,
  };

  try {
    const result = await params.client.send(new QueryCommand(command));
    const parsedResult = params.schema.array().safeParse(result.Items ?? []);
    if (!parsedResult.success) throw new DynamoError("Query result does not match schema");
    return {
      data: parsedResult.data,
      ...(result.LastEvaluatedKey && { lastEvaluatedKey: result.LastEvaluatedKey }),
    };
  } catch {
    throw new DynamoError("Failed to perform query command");
  }
}

export async function queryByPrefix<
  IndexNames extends string,
  Table extends TableDef<IndexNames>,
  Item extends BaseItem,
  Schema extends z.ZodType<Item>,
>(params: QueryParams<IndexNames, Table, Item, Schema>) {
  let { partitionKey, sortKey } = params.table.primaryKey;
  if (params.indexName !== undefined) {
    const secondaryIndex = params.table.secondaryIndex[params.indexName];
    if (!secondaryIndex) throw new DynamoError("Secondary index not found");
    ({ partitionKey, sortKey } = secondaryIndex);
  }
  if (sortKey === undefined)
    throw new DynamoError("`queryByPrefix` operation can only be performed on indexes with sort key");

  return query({
    ...params,
    keyConditionExpression:
      params.keyConditionExpression ?? `#${partitionKey} = :${partitionKey} AND begins_with(#${sortKey}, :${sortKey})`,
  });
}
