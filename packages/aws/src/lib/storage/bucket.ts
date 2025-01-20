import { S3Client } from "@aws-sdk/client-s3";
import {
  CreatePreSignedGetUrlParams,
  CreatePreSignedUrlParams,
  createPreSignedUrl,
  createUploadUrl,
} from "./create-pre-signed-url";
import { deleteObject, DeleteObjectParams } from "./delete";
import { GetObjectParams, getObject } from "./get";
import { headObject, HeadObjectParams } from "./head-object";
import { UploadParams, upload } from "./upload";

export function defineBucket(client: S3Client, bucket: string) {
  return {
    get(params: Omit<GetObjectParams, "client" | "bucket">) {
      return getObject({ client, bucket, ...params });
    },
    upload(params: Omit<UploadParams, "client" | "bucket">) {
      return upload({ client, bucket, ...params });
    },
    delete(params: Omit<DeleteObjectParams, "client" | "bucket">) {
      return deleteObject({ client, bucket, ...params });
    },
    headObject(params: Omit<HeadObjectParams, "client" | "bucket">) {
      return headObject({ client, bucket, ...params });
    },
    createPreSignedUrl(params: Omit<CreatePreSignedGetUrlParams, "client" | "bucket">) {
      return createPreSignedUrl({ client, bucket, ...params });
    },
    createUploadUrl(params: Omit<CreatePreSignedUrlParams, "client" | "bucket">) {
      return createUploadUrl({ client, bucket, ...params });
    },
  };
}
