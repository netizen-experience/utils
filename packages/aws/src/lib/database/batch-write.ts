import { BatchWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { DynamoError } from "./errors";
import { BaseItem, ExtractPrimaryKey, TableDef } from "./types";

type RequestType = "put" | "delete";

// @TODO: generics for every element in the array (ref: https://stackoverflow.com/a/72517827)
interface BatchItemPutParams {
  type?: Extract<RequestType, "put">;
  schema: z.Schema;
  data: BaseItem;
}

interface BatchItemDeleteParams<IndexNames extends string, Table extends TableDef<IndexNames>> {
  type: Extract<RequestType, "delete">;
  key: ExtractPrimaryKey<Table["primaryKey"]>;
}

export type BatchItemParams<
  IndexNames extends string = string,
  Table extends TableDef<IndexNames> = TableDef<IndexNames>,
> = { type?: RequestType } & (BatchItemPutParams | BatchItemDeleteParams<IndexNames, Table>);

export interface BatchWriteParams<IndexNames extends string, Table extends TableDef<IndexNames>> {
  client: DynamoDBDocumentClient;
  table: Table;
  items: BatchItemParams<IndexNames, Table>[];
}
export async function batchWrite<IndexNames extends string, Table extends TableDef<IndexNames>>(
  params: BatchWriteParams<IndexNames, Table>,
) {
  await Promise.all(
    params.items
      .reduce<BatchItemParams<IndexNames, Table>[][]>((requests, item, index) => {
        if (index % 25 === 0) requests.push([]);
        requests[requests.length - 1].push(item);
        return requests;
      }, [])
      .map(
        (requests) =>
          new BatchWriteCommand({
            RequestItems: {
              [params.table.name]: requests.map((request) => {
                if (request.type === "delete") {
                  const { partitionKey, sortKey } = params.table.primaryKey;
                  if (request.key[partitionKey] === undefined)
                    throw new DynamoError("Partition key is required for a delete request in batch write operation", {
                      context: { partitionKey },
                    });
                  if (sortKey && request.key[sortKey] === undefined)
                    throw new DynamoError("Sort key is required for a delete request in batch write operation", {
                      context: { partitionKey, sortKey },
                    });

                  return { DeleteRequest: { Key: request.key } };
                } else {
                  const parsedItem = request.schema.safeParse(request.data);
                  if (!parsedItem.success)
                    throw new DynamoError("Item does not match schema", { cause: parsedItem.error });

                  return { PutRequest: { Item: parsedItem.data } };
                }
              }),
            },
          }),
      )
      .map((command) => params.client.send(command)),
  );
}
