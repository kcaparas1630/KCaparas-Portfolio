// Starts MinIO and creates the bucket: `bun run s3:local`.
//
// Everything here is hardcoded to the local container, so this script can't
// touch AWS whatever .env contains.
import { spawnSync } from 'node:child_process';
import { CreateBucketCommand, S3Client } from '@aws-sdk/client-s3';

const ENDPOINT = 'http://127.0.0.1:9000';
const BUCKET = 'portfolio-content';

const started = spawnSync('docker', ['compose', 'up', '--detach', '--wait', 'minio'], { stdio: 'inherit' });
if (started.error) throw started.error;
if (started.status !== 0) {
  console.error('\nCould not start MinIO. Is Docker Desktop running?');
  process.exit(started.status ?? 1);
}

const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: ENDPOINT,
  forcePathStyle: true,
  credentials: { accessKeyId: 'minioadmin', secretAccessKey: 'minioadmin' },
});

try {
  await s3.send(new CreateBucketCommand({ Bucket: BUCKET }));
} catch (error) {
  if (error.name !== 'BucketAlreadyOwnedByYou') throw error;
}

console.log(`\nMinIO ready: ${ENDPOINT}, bucket "${BUCKET}", console at http://127.0.0.1:9001`);
