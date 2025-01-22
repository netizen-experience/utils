import { HeadObjectCommand, type S3Client } from "@aws-sdk/client-s3";

export interface HeadObjectParams {
  client: S3Client;
  bucket: string;
  key: string;
}

export async function headObject({ bucket, client, key }: HeadObjectParams) {
  return await client.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}
