import { DeleteObjectCommand, type S3Client } from "@aws-sdk/client-s3";

export interface DeleteObjectParams {
  client: S3Client;
  bucket: string;
  key: string;
}

export async function deleteObject({ bucket, client, key }: DeleteObjectParams) {
  return await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}
