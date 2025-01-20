import { GetObjectCommand, type S3Client } from "@aws-sdk/client-s3";

export interface GetObjectParams {
  client: S3Client;
  bucket: string;
  key: string;
}

export async function getObject({ bucket, client, key }: GetObjectParams) {
  return await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}
