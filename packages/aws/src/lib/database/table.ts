import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { BatchWriteParams, batchWrite } from "./batch-write";
import { CreateParams, create } from "./create";
import { GetParams, get } from "./get";
import { QueryParams, query, queryByPrefix } from "./query";
import { RemoveParams, remove } from "./remove";
import { BaseItem, TableDef } from "./types";
import { UpdateParams, update } from "./update";

export function defineTable<IndexNames extends string, Table extends TableDef<IndexNames>>(
  client: DynamoDBDocumentClient,
  table: Table,
) {
  return {
    ...table,
    get<Item extends BaseItem, Schema extends z.ZodType<Item>>(
      params: Omit<GetParams<IndexNames, Table, Item, Schema>, "client" | "table">,
    ) {
      return get({ client, table, ...params });
    },
    query<Item extends BaseItem, Schema extends z.ZodType<Item>>(
      params: Omit<QueryParams<IndexNames, Table, Item, Schema>, "client" | "table">,
    ) {
      return query({ client, table, ...params });
    },
    queryByPrefix<Item extends BaseItem, Schema extends z.ZodType<Item>>(
      params: Omit<QueryParams<IndexNames, Table, Item, Schema>, "client" | "table">,
    ) {
      return queryByPrefix({ client, table, ...params });
    },
    create<Item extends BaseItem, Schema extends z.ZodType<Item>>(
      params: Omit<CreateParams<IndexNames, Table, Item, Schema>, "client" | "table">,
    ) {
      return create({ client, table, ...params });
    },
    update<Item extends BaseItem, Schema extends z.ZodObject<Item>>(
      params: Omit<UpdateParams<IndexNames, Table, Item, Schema>, "client" | "table">,
    ) {
      return update({ client, table, ...params });
    },
    remove(params: Omit<RemoveParams<IndexNames, Table>, "client" | "table">) {
      return remove({ client, table, ...params });
    },
    batchWrite(params: Omit<BatchWriteParams<IndexNames, Table>, "client" | "table">) {
      return batchWrite({ client, table, ...params });
    },
  };
}
