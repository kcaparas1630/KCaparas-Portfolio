import 'server-only';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { env } from './env';

// AWS S3 in production. Locally, S3_ENDPOINT points at MinIO, which addresses
// buckets by path rather than by subdomain.
const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  ...(env.S3_ENDPOINT && { endpoint: env.S3_ENDPOINT, forcePathStyle: true }),
});

export async function putObject(key: string, body: string, contentType = 'text/markdown; charset=utf-8') {
  await s3.send(new PutObjectCommand({ Bucket: env.AWS_S3_BUCKET, Key: key, Body: body, ContentType: contentType }));
}

export async function getObjectText(key: string): Promise<string> {
  const object = await s3.send(new GetObjectCommand({ Bucket: env.AWS_S3_BUCKET, Key: key }));
  if (!object.Body) throw new Error(`S3 object has no body: ${key}`);
  return object.Body.transformToString('utf-8');
}
