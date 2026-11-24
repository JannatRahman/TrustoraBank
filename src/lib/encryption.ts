import crypto from "crypto";
import { EncryptedField } from "@/types";

/**
 * Key Management:
 * In production, KYC_FIELD_ENCRYPTION_KEY is a 64-character hex string (32 bytes)
 * representing the Master Key-Encryption-Key (KEK).
 * If not provided in development/test, a fallback derivation is used with a warning.
 */
function getMasterKek(): Buffer {
  const hexKey = process.env.KYC_FIELD_ENCRYPTION_KEY;
  if (hexKey && hexKey.length === 64) {
    return Buffer.from(hexKey, "hex");
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("KYC_FIELD_ENCRYPTION_KEY must be a 64-char hex string (32 bytes) in production");
  }
  // Deterministic fallback for dev/test environments
  return crypto.scryptSync(process.env.BETTER_AUTH_SECRET || "trustora-bank-kek-secret", "trustora-salt", 32);
}

/**
 * Envelope Encryption for sensitive PII (e.g. documentNumber):
 * 1. Generate an ephemeral 256-bit Data Encryption Key (DEK).
 * 2. Encrypt plaintext with DEK using AES-256-GCM.
 * 3. Encrypt DEK with Master KEK using AES-256-GCM.
 * 4. Return EncryptedField object containing encryptedData, encryptedKey, IVs, and authTags.
 */
export function encryptEnvelope(plainText: string): EncryptedField {
  const masterKek = getMasterKek();

  // 1. Generate ephemeral DEK (32 bytes) and DEK IV (12 bytes)
  const dek = crypto.randomBytes(32);
  const dataIv = crypto.randomBytes(12);

  // 2. Encrypt data with DEK
  const cipher = crypto.createCipheriv("aes-256-gcm", dek, dataIv);
  let encryptedData = cipher.update(plainText, "utf8", "base64");
  encryptedData += cipher.final("base64");
  const dataTag = cipher.getAuthTag().toString("base64");

  // 3. Encrypt DEK with Master KEK
  const keyIv = crypto.randomBytes(12);
  const keyCipher = crypto.createCipheriv("aes-256-gcm", masterKek, keyIv);
  let encryptedDek = keyCipher.update(dek.toString("base64"), "utf8", "base64");
  encryptedDek += keyCipher.final("base64");
  const keyTag = keyCipher.getAuthTag().toString("base64");

  return {
    encryptedData,
    encryptedKey: encryptedDek,
    iv: dataIv.toString("base64"),
    authTag: dataTag,
    keyIv: keyIv.toString("base64"),
    keyAuthTag: keyTag,
    algorithm: "aes-256-gcm",
    version: 1,
  };
}

/**
 * Envelope Decryption:
 * 1. Decrypt DEK using Master KEK.
 * 2. Decrypt data using decrypted DEK.
 */
export function decryptEnvelope(field: EncryptedField): string {
  const masterKek = getMasterKek();

  // 1. Decrypt DEK
  const keyIv = Buffer.from(field.keyIv, "base64");
  const keyTag = Buffer.from(field.keyAuthTag, "base64");
  const keyDecipher = crypto.createDecipheriv("aes-256-gcm", masterKek, keyIv);
  keyDecipher.setAuthTag(keyTag);

  let dekBase64 = keyDecipher.update(field.encryptedKey, "base64", "utf8");
  dekBase64 += keyDecipher.final("utf8");
  const dek = Buffer.from(dekBase64, "base64");

  // 2. Decrypt data
  const dataIv = Buffer.from(field.iv, "base64");
  const dataTag = Buffer.from(field.authTag, "base64");
  const dataDecipher = crypto.createDecipheriv("aes-256-gcm", dek, dataIv);
  dataDecipher.setAuthTag(dataTag);

  let plainText = dataDecipher.update(field.encryptedData, "base64", "utf8");
  plainText += dataDecipher.final("utf8");

  return plainText;
}

/**
 * Mask document numbers for safe non-privileged display (e.g., "••••-••••-7890")
 */
export function maskDocumentNumber(docNum: string): string {
  if (!docNum) return "";
  const cleaned = docNum.trim();
  if (cleaned.length <= 4) return "••••" + cleaned;
  const visible = cleaned.slice(-4);
  return "••••-••••-" + visible;
}
