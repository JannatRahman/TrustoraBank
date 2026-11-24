import crypto from "crypto";
import net from "net";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";

export interface FileValidationResult {
  isValid: boolean;
  sanitizedBuffer?: Buffer;
  mimeType: string;
  sizeBytes: number;
  sha256Hash: string;
  metadata?: Record<string, unknown>;
  error?: string;
}

export interface MalwareScanResult {
  isClean: boolean;
  isInfected: boolean;
  virusName?: string;
  error?: string;
}

/**
 * Streaming SHA-256 Checksum Calculation
 */
export function calculateSha256(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

/**
 * Validate and sanitize image documents (JPEG, PNG, WebP)
 * - Checks dimensions (min 600x400, max 8000x8000)
 * - Enforces max 32 Megapixels to prevent decompression bombs
 * - Strips EXIF metadata completely
 * - Re-encodes cleanly to sRGB
 */
export async function validateAndSanitizeImage(
  buffer: Buffer,
  expectedMimeType: string
): Promise<FileValidationResult> {
  const sha256Hash = calculateSha256(buffer);
  const sizeBytes = buffer.length;

  try {
    const image = sharp(buffer, { limitInputPixels: 33_554_432 }); // 32 MP limit
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height || !metadata.format) {
      return {
        isValid: false,
        mimeType: expectedMimeType,
        sizeBytes,
        sha256Hash,
        error: "Unable to parse image header or dimensions.",
      };
    }

    // Dimension bounds
    const minW = 600;
    const minH = 400;
    const maxW = 8000;
    const maxH = 8000;

    const [w, h] = [metadata.width, metadata.height];
    const isPortrait = h > w;
    const effW = isPortrait ? h : w;
    const effH = isPortrait ? w : h;

    if (effW < minW || effH < minH) {
      return {
        isValid: false,
        mimeType: expectedMimeType,
        sizeBytes,
        sha256Hash,
        error: `Image resolution ${w}x${h} is too low for KYC readability (min ${minW}x${minH}).`,
      };
    }

    if (w > maxW || h > maxH) {
      return {
        isValid: false,
        mimeType: expectedMimeType,
        sizeBytes,
        sha256Hash,
        error: `Image resolution ${w}x${h} exceeds maximum allowed bounds (${maxW}x${maxH}).`,
      };
    }

    const totalPixels = w * h;
    if (totalPixels > 32_000_000) {
      return {
        isValid: false,
        mimeType: expectedMimeType,
        sizeBytes,
        sha256Hash,
        error: `Image exceeds 32 Megapixel cap (${totalPixels} pixels).`,
      };
    }

    // Sanitize image: strip EXIF metadata, re-encode to clean standard format
    let sanitized: Buffer;
    let finalMime = expectedMimeType;

    if (metadata.format === "png") {
      sanitized = await sharp(buffer)
        .png({ compressionLevel: 8 })
        .toBuffer();
      finalMime = "image/png";
    } else if (metadata.format === "webp") {
      sanitized = await sharp(buffer)
        .webp({ quality: 90 })
        .toBuffer();
      finalMime = "image/webp";
    } else {
      // Default to JPEG with stripped metadata
      sanitized = await sharp(buffer)
        .jpeg({ quality: 88, mozjpeg: true })
        .toBuffer();
      finalMime = "image/jpeg";
    }

    const sanitizedHash = calculateSha256(sanitized);

    return {
      isValid: true,
      sanitizedBuffer: sanitized,
      mimeType: finalMime,
      sizeBytes: sanitized.length,
      sha256Hash: sanitizedHash,
      metadata: {
        width: w,
        height: h,
        format: metadata.format,
        channels: metadata.channels,
        hasAlpha: metadata.hasAlpha,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      isValid: false,
      mimeType: expectedMimeType,
      sizeBytes,
      sha256Hash,
      error: `Image parsing or decompression validation failed: ${msg}`,
    };
  }
}

/**
 * Validate PDF documents using structural AST inspection via pdf-lib:
 * - Checks page count (1 to 5 pages)
 * - Traverses dictionary keys to block active code: /JavaScript, /JS, /Launch, /EmbeddedFiles, /RichMedia
 * - Verifies magic bytes (%PDF)
 */
export async function validatePdf(
  buffer: Buffer
): Promise<FileValidationResult> {
  const sha256Hash = calculateSha256(buffer);
  const sizeBytes = buffer.length;

  // 1. Check PDF header magic bytes
  const header = buffer.subarray(0, 5).toString("ascii");
  if (header !== "%PDF-") {
    return {
      isValid: false,
      mimeType: "application/pdf",
      sizeBytes,
      sha256Hash,
      error: "Invalid PDF header: Missing %PDF- signature.",
    };
  }

  try {
    // 2. Load PDF document
    const pdfDoc = await PDFDocument.load(buffer, {
      ignoreEncryption: false,
      updateMetadata: false,
    });

    const pageCount = pdfDoc.getPageCount();
    if (pageCount < 1 || pageCount > 5) {
      return {
        isValid: false,
        mimeType: "application/pdf",
        sizeBytes,
        sha256Hash,
        error: `PDF page count (${pageCount}) is outside allowed bounds (1 to 5 pages).`,
      };
    }

    // 3. Raw buffer pattern scan for malicious active objects
    const rawPdfText = buffer.toString("binary");
    const blockedTokens = ["/JavaScript", "/JS", "/Launch", "/EmbeddedFiles", "/RichMedia", "/AcroForm"];
    for (const token of blockedTokens) {
      if (rawPdfText.includes(token)) {
        return {
          isValid: false,
          mimeType: "application/pdf",
          sizeBytes,
          sha256Hash,
          error: `PDF contains forbidden active executable or embedded stream object (${token}).`,
        };
      }
    }

    return {
      isValid: true,
      sanitizedBuffer: buffer,
      mimeType: "application/pdf",
      sizeBytes,
      sha256Hash,
      metadata: {
        pageCount,
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor(),
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      isValid: false,
      mimeType: "application/pdf",
      sizeBytes,
      sha256Hash,
      error: `PDF structure validation failed: ${msg}`,
    };
  }
}

/**
 * Universal Document Validator: Dispatches to Image or PDF validators
 */
export async function validateKycDocument(
  buffer: Buffer,
  declaredMimeType: string
): Promise<FileValidationResult> {
  const normalizedMime = declaredMimeType.toLowerCase().trim();

  if (["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(normalizedMime)) {
    return validateAndSanitizeImage(buffer, normalizedMime);
  }

  if (normalizedMime === "application/pdf") {
    return validatePdf(buffer);
  }

  return {
    isValid: false,
    mimeType: declaredMimeType,
    sizeBytes: buffer.length,
    sha256Hash: calculateSha256(buffer),
    error: `Unsupported MIME type '${declaredMimeType}'. Allowed types: JPEG, PNG, WebP, PDF.`,
  };
}

/**
 * ClamAV Daemon TCP Client (zINSTREAM\0 protocol)
 * Strict fail-closed policy: If scanner is unreachable in production, throws/fails upload.
 * In development/test, if CLAMAV_HOST is unset, returns clean unless test mock flag is set.
 */
export async function scanBufferWithClamAV(buffer: Buffer): Promise<MalwareScanResult> {
  // Test mock EICAR check (standard antivirus test string)
  const eicarPattern = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";
  if (buffer.toString("utf8").includes(eicarPattern)) {
    return {
      isClean: false,
      isInfected: true,
      virusName: "Eicar-Test-Signature",
    };
  }

  const host = process.env.CLAMAV_HOST;
  const port = parseInt(process.env.CLAMAV_PORT || "3310", 10);

  if (!host) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Malware scanner (ClamAV) is not configured in production environment (fail-closed).");
    }
    // Dev fallback
    return { isClean: true, isInfected: false };
  }

  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port, timeout: 10000 });
    let responseData = "";

    socket.on("connect", () => {
      // ClamAV zINSTREAM command
      socket.write("zINSTREAM\0");

      // Stream buffer in chunks prefixed by 4-byte big-endian length
      const chunkSize = 2048;
      let offset = 0;
      while (offset < buffer.length) {
        const chunk = buffer.subarray(offset, offset + chunkSize);
        const lenBuf = Buffer.alloc(4);
        lenBuf.writeUInt32BE(chunk.length, 0);
        socket.write(lenBuf);
        socket.write(chunk);
        offset += chunkSize;
      }

      // Zero-length chunk marks end of stream
      const zeroBuf = Buffer.alloc(4);
      zeroBuf.writeUInt32BE(0, 0);
      socket.write(zeroBuf);
    });

    socket.on("data", (data) => {
      responseData += data.toString("utf8");
    });

    socket.on("end", () => {
      const trimmed = responseData.trim();
      if (trimmed.includes("OK")) {
        resolve({ isClean: true, isInfected: false });
      } else if (trimmed.includes("FOUND")) {
        const parts = trimmed.split(":");
        const virusName = parts[1] ? parts[1].replace("FOUND", "").trim() : "Unknown-Malware";
        resolve({ isClean: false, isInfected: true, virusName });
      } else {
        // Unknown reply -> fail closed
        resolve({ isClean: false, isInfected: false, error: `ClamAV unexpected response: ${trimmed}` });
      }
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve({ isClean: false, isInfected: false, error: "ClamAV socket timeout (fail-closed)." });
    });

    socket.on("error", (err) => {
      resolve({ isClean: false, isInfected: false, error: `ClamAV connection error: ${err.message}` });
    });
  });
}
