import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoError } from "./errors";
import { ExtractPrimaryKey, TableDef } from "./types";

export interface RemoveParams<IndexNames extends string, Table extends TableDef<IndexNames>> {
  client: DynamoDBDocumentClient;
  table: Table;
  key: ExtractPrimaryKey<Table["primaryKey"]>;
}

export async function remove<IndexNames extends string, Table extends TableDef<IndexNames>>(
  params: RemoveParams<IndexNames, Table>,
) {
  const { partitionKey, sortKey } = params.table.primaryKey;
  if (params.key[partitionKey] === undefined) throw new DynamoError("Partition key is required for remove operation");

  if (sortKey && params.key[sortKey] === undefined) throw new DynamoError("Sort key is required for remove operation");

  try {
    await params.client.send(new DeleteCommand({ TableName: params.table.name, Key: params.key }));
  } catch {
    throw new DynamoError("Failed to perform delete command");
  }
}
