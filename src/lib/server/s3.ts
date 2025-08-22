import { S3Client, CreateBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config'

// @todo: throw a proper error if .env doesn't exist or has unset values
const client = new S3Client({
  endpoint: process.env.S3_ENDPOINT!,
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_APP_ACCESS_KEY!,
    secretAccessKey: process.env.S3_APP_PRIVATE_KEY!
  }
});

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME!;

interface S3FileUploadResponse {
    url: string,
    key: string,
    bucket: string,
    region: string
}

export async function uploadFile(data: Uint8Array | Buffer, key: string, mimetype: string): Promise<S3FileUploadResponse> {
    // @todo: proper error handling if the s3 command fails?
    await client.send(new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
        Body: data,
        ContentType: mimetype,
    }));

    return {
        url: `${process.env.S3_BUCKET_PUBLIC_URL_PREFIX}` + key,
        key: key,
        bucket: S3_BUCKET_NAME,
        region: process.env.S3_REGION!
    };
}
