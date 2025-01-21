import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

let dynamo: DynamoDBDocumentClient;
let s3: S3Client;

export function getAwsClients() {
  if (dynamo && s3) return { dynamo, s3 };

  dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  s3 = new S3Client({});
  return { dynamo, s3 };
}
