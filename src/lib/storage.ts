import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPresignedPost, PresignedPost } from "@aws-sdk/s3-presigned-post";

const s3Endpoint = process.env.S3_ENDPOINT || process.env.AWS_ENDPOINT;
const s3Region = process.env.AWS_REGION || "auto";
const s3Bucket = process.env.S3_BUCKET_NAME || process.env.AWS_S3_BUCKET || "trustora-kyc-documents";
const storageProvider = (process.env.STORAGE_PROVIDER || "aws").toLowerCase(); // "aws" | "cloudflare_r2" | "mock"

export const s3Client = new S3Client({
  region: s3Region,
  endpoint: s3Endpoint || undefined,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "mock-access-key",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "mock-secret-key",
  },
  forcePathStyle: Boolean(s3Endpoint),
});

export interface UploadIntentPresigned {
  mode: "presigned_post" | "presigned_put";
  uploadUrl: string;
  fields?: Record<string, string>;
  headers?: Record<string, string>;
  expiresInSeconds: number;
  maxSizeBytes: number;
}

/**
 * Generate secure presigned upload destination based on provider:
 * - AWS S3: Presigned POST with content-length-range policy [1KB, 10MB] and starts-with Content-Type
 * - Cloudflare R2: Presigned PUT with client-bound Content-Length and Content-Type signed in URL
 */
export async function generatePresignedUploadUrl(params: {
  key: string;
  expectedContentType: string;
  maxSizeBytes?: number;
  contentLength?: number;
}): Promise<UploadIntentPresigned> {
  const maxSizeBytes = params.maxSizeBytes || 10 * 1024 * 1024; // 10MB
  const expiresInSeconds = 300; // 5 minutes

  // If storage is mock or not configured in dev, provide local mock endpoints
  if (storageProvider === "mock" || (!process.env.AWS_ACCESS_KEY_ID && process.env.NODE_ENV !== "production")) {
    return {
      mode: "presigned_put",
      uploadUrl: `/api/kyc/mock-upload?key=${encodeURIComponent(params.key)}`,
      headers: {
        "Content-Type": params.expectedContentType,
      },
      expiresInSeconds,
      maxSizeBytes,
    };
  }

  if (storageProvider === "cloudflare_r2") {
    // Cloudflare R2 does NOT support presigned POST policies. Use Presigned PUT.
    const command = new PutObjectCommand({
      Bucket: s3Bucket,
      Key: params.key,
      ContentType: params.expectedContentType,
      ContentLength: params.contentLength || maxSizeBytes,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
    return {
      mode: "presigned_put",
      uploadUrl,
      headers: {
        "Content-Type": params.expectedContentType,
      },
      expiresInSeconds,
      maxSizeBytes,
    };
  }

  // Default AWS S3: Presigned POST with content-length-range constraint
  const post = await createPresignedPost(s3Client, {
    Bucket: s3Bucket,
    Key: params.key,
    Conditions: [
      ["content-length-range", 1024, maxSizeBytes],
      ["starts-with", "$Content-Type", params.expectedContentType.split("/")[0]],
    ],
    Fields: {
      "Content-Type": params.expectedContentType,
    },
    Expires: expiresInSeconds,
  });

  return {
    mode: "presigned_post",
    uploadUrl: post.url,
    fields: post.fields,
    expiresInSeconds,
    maxSizeBytes,
  };
}

/**
 * Stream/Download object from S3/R2 quarantine or verified storage into memory Buffer for scanning/validation
 */
export async function getObjectBuffer(key: string): Promise<Buffer> {
  // Mock support for dev/testing when no live AWS credentials exist
  if (storageProvider === "mock" || (!process.env.AWS_ACCESS_KEY_ID && process.env.NODE_ENV !== "production")) {
    if (global._mockStorage?.has(key)) {
      return global._mockStorage.get(key)!;
    }
    throw new Error(`Mock storage object not found: ${key}`);
  }

  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: s3Bucket,
      Key: key,
    })
  );

  if (!response.Body) {
    throw new Error(`Empty body returned for storage key ${key}`);
  }

  const chunks: Uint8Array[] = [];
  // @ts-expect-error - Body is async iterable stream in Node
  for await (const chunk of response.Body) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

/**
 * Put validated & sanitized buffer into target destination (e.g., verified storage)
 */
export async function putObjectBuffer(params: {
  key: string;
  buffer: Buffer;
  contentType: string;
}): Promise<void> {
  if (storageProvider === "mock" || (!process.env.AWS_ACCESS_KEY_ID && process.env.NODE_ENV !== "production")) {
    if (!global._mockStorage) {
      global._mockStorage = new Map<string, Buffer>();
    }
    global._mockStorage.set(params.key, params.buffer);
    return;
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: s3Bucket,
      Key: params.key,
      Body: params.buffer,
      ContentType: params.contentType,
      ServerSideEncryption: "AES256",
    })
  );
}

/**
 * Delete object from storage (e.g. clean up quarantine or orphaned files)
 */
export async function deleteObject(key: string): Promise<void> {
  if (storageProvider === "mock" || (!process.env.AWS_ACCESS_KEY_ID && process.env.NODE_ENV !== "production")) {
    global._mockStorage?.delete(key);
    return;
  }

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: s3Bucket,
        Key: key,
      })
    );
  } catch (err) {
    console.warn(`Failed to delete object ${key}:`, err);
  }
}

/**
 * Generate secure presigned GET URL for staff inspection (15-minute expiry)
 * Attaches Content-Disposition: inline and security response headers
 */
export async function generateStaffViewUrl(params: {
  key: string;
  fileName: string;
  contentType: string;
  expiresInSeconds?: number;
}): Promise<string> {
  const expiresIn = params.expiresInSeconds || 900; // 15 mins

  if (storageProvider === "mock" || (!process.env.AWS_ACCESS_KEY_ID && process.env.NODE_ENV !== "production")) {
    return `/api/kyc/mock-view?key=${encodeURIComponent(params.key)}&token=staff-mock-token`;
  }

  const command = new GetObjectCommand({
    Bucket: s3Bucket,
    Key: params.key,
    ResponseContentDisposition: `inline; filename="${encodeURIComponent(params.fileName)}"`,
    ResponseContentType: params.contentType,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

// Global mock storage declare for dev/tests
declare global {
  // eslint-disable-next-line no-var
  var _mockStorage: Map<string, Buffer> | undefined;
}
