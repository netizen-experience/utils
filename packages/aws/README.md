# utils-aws

This library provides helper functions to interact with AWS S3 and DynamoDB, making it easier to perform common operations in S3 and DynamoDB.

## Table of Contents

- [Installation](#installation)
- [Usage and Examples](#usage-and-examples)
  - [Database (DynamoDB)](#database-dynamodb)
    - [Creating an Item](#creating-an-item)
    - [Getting an Item](#getting-an-item)
    - [Updating an Item](#updating-an-item)
    - [Deleting an Item](#deleting-an-item)
    - [Querying Items](#querying-items)
    - [Querying Items by Prefix](#querying-items-by-prefix)
    - [Batch Writing Items](#batch-writing-items)
    - [Error Handling](#error-handling)
    - [Utilities](#utilities)
  - [Storage (S3)](#storage-s3)
    - [Uploading an Object](#uploading-an-object)
    - [Getting an Object](#getting-an-object)
    - [Deleting an Object](#deleting-an-object)
    - [Checking if an Object Exists](#checking-if-an-object-exists)
    - [Creating a Pre-Signed URL for Download](#creating-a-pre-signed-url-for-download)
    - [Creating a Pre-Signed URL for Upload](#creating-a-pre-signed-url-for-upload)

## Installation

To install this library, run:

```bash
npm install @netizen-experience/aws
```

## Usage and Examples

Initialize AWS clients before using the library functions.

```typescript
const { dynamo, s3 } = getAwsClients();
```

### Database (DynamoDB)

Define DynamoDB tables with name, primary key, secondary search indexes (if any).

```typescript
const table = defineTable(dynamo, {
  name: "SOME_TABLE_NAME",
  primaryKey: { partitionKey: "pk", sortKey: "sk" },
  secondaryIndex: {
    firstGSI: { partitionKey: "pk2", sortKey: "sk2" },
    secondLSI: { partitionKey: "pk", sortKey: "sk3" },
  },
});
```

#### Creating an Item

```typescript
await table.create({
  schema: z.object({ partitionKey: z.string(), sortKey: z.string(), data: z.string() }),
  item: { partitionKey: "pk", sortKey: "sk", data: "example" },
});
```

#### Getting an Item

```typescript
const item = await table.get({
  schema: z.object({ partitionKey: z.string(), sortKey: z.string(), data: z.string() }),
  key: { partitionKey: "pk", sortKey: "sk" },
});
```

#### Updating an Item

```typescript
await table.update({
  schema: z.object({ partitionKey: z.string(), sortKey: z.string(), data: z.string().optional() }),
  attributes: { partitionKey: "pk", sortKey: "sk", data: "updated data" },
});
```

#### Deleting an Item

```typescript
await table.remove({
  key: { partitionKey: "pk", sortKey: "sk" },
});
```

#### Querying Items

```typescript
const items = await table.query({
  schema: z.object({ partitionKey: z.string(), sortKey: z.string(), data: z.string() }),
  attributes: { partitionKey: "pk" },
});
```

#### Querying Items by Prefix

```typescript
const items = await table.queryByPrefix({
  schema: z.object({ partitionKey: z.string(), sortKey: z.string(), data: z.string() }),
  attributes: { partitionKey: "pk", sortKey: "prefix" },
});
```

#### Batch Writing Items

```typescript
await table.batchWrite({
  items: [
    {
      type: "put",
      schema: z.object({ partitionKey: z.string(), sortKey: z.string(), data: z.string() }),
      data: { partitionKey: "pk1", sortKey: "sk1", data: "example1" },
    },
    {
      type: "delete",
      key: { partitionKey: "pk2", sortKey: "sk2" },
    },
  ],
});
```

#### Error Handling

All functions throw a `DynamoError` in case of an error. You can catch and handle these errors as follows:

```typescript
import { DynamoError } from "./lib/database/errors";

try {
  await table.create({
    schema: z.object({ partitionKey: z.string(), sortKey: z.string(), data: z.string() }),
    item: { partitionKey: "pk", sortKey: "sk", data: "example" },
  });
} catch (error) {
  if (error instanceof DynamoError) {
    console.error("DynamoDB Error:", error.message);
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

#### Utilities

This library also provides utility functions to help in generating and parsing prefixed keys.

```typescript
import { generatePrefixedKey, parsePrefixedKey } from "@netizen-experience/aws";

const prefixedKey = generatePrefixedKey("prefix", "key");
console.log(prefixedKey); // Output: "prefix#key"

const { prefix, key } = parsePrefixedKey("prefix#key");
console.log(prefix); // Output: "prefix"
console.log(key); // Output: "key"
```

### Storage (S3)

Define an S3 bucket with the client and bucket name.

```typescript
const bucket = defineBucket(s3, "your-bucket-name");
```

#### Uploading an Object

```typescript
await bucket.upload({
  key: "path/to/your/object",
  body: "Your object content",
});
```

#### Getting an Object

```typescript
const object = await bucket.get({
  key: "path/to/your/object",
});
```

#### Deleting an Object

```typescript
await bucket.delete({
  key: "path/to/your/object",
});
```

#### Checking if an Object Exists

```typescript
const head = await bucket.headObject({
  key: "path/to/your/object",
});
```

#### Creating a Pre-Signed URL for Download

```typescript
const url = await bucket.createPreSignedUrl({
  key: "path/to/your/object",
  expiresIn: 3600, // Optional, default is 3600 seconds
});
```

#### Creating a Pre-Signed URL for Upload

```typescript
const uploadUrl = await bucket.createUploadUrl({
  key: "path/to/your/object",
  expiresIn: 1200, // Optional, default is 3600 seconds
});
```
