import { PutObjectCommand, type PutObjectCommandInput, type S3Client } from "@aws-sdk/client-s3";

export interface UploadParams {
  client: S3Client;
  bucket: string;
  key: string;
  body: PutObjectCommandInput["Body"];
}

export async function upload(params: UploadParams) {
  await params.client.send(
    new PutObjectCommand({
      Bucket: params.bucket,
      Key: params.key,
      Body: params.body,
    }),
  );
}
