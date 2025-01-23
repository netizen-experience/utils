import { GetObjectCommand, GetObjectCommandInput, PutObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface CreatePreSignedUrlParams {
  client: S3Client;
  bucket: string;
  key: string;
  expiresIn?: number;
}

export interface CreatePreSignedGetUrlParams extends CreatePreSignedUrlParams {
  requestParams?: Omit<GetObjectCommandInput, "Bucket" | "Key">;
}

export async function createPreSignedUrl(params: CreatePreSignedGetUrlParams) {
  const command = new GetObjectCommand({
    Bucket: params.bucket,
    Key: params.key,
    ...(params.requestParams ?? {}),
  });
  return getSignedUrl(params.client, command, { expiresIn: params.expiresIn ?? 3600 });
}

export async function createUploadUrl(params: CreatePreSignedUrlParams) {
  const command = new PutObjectCommand({ Bucket: params.bucket, Key: params.key });
  return getSignedUrl(params.client, command, { expiresIn: params.expiresIn ?? 3600 });
}
