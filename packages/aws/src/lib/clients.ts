import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { SESv2Client } from "@aws-sdk/client-sesv2";
import { SFNClient } from "@aws-sdk/client-sfn";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

let dynamo: DynamoDBDocumentClient;
let s3: S3Client;
let ses: SESv2Client;
let sfn: SFNClient;

export function getAwsClients() {
  if (dynamo && s3 && ses && sfn) return { dynamo, s3, ses, sfn };

  dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  s3 = new S3Client({});
  ses = new SESv2Client();
  sfn = new SFNClient();
  return { dynamo, s3, ses, sfn };
}
