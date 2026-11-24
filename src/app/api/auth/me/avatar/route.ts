import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { requireAuth, handleApiError } from "@/server/auth";
import { BadRequestError } from "@/server/auth/errors";
import { getDatabase } from "@/lib/mongodb";
import { COLLECTIONS, type DbUser } from "@/types";

const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

/**
 * Validates image magic bytes to ensure file content matches image format.
 */
function isValidImageMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;
  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return true;
  // WEBP: RIFF ... WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return true;
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();

    const formData = await request.formData();
    const file = (formData.get("file") || formData.get("image") || formData.get("avatar")) as File | null;

    if (!file || typeof file === "string") {
      throw new BadRequestError("Please select an image file to upload.");
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      throw new BadRequestError("Profile picture cannot exceed 2MB.");
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      throw new BadRequestError("Only JPEG, PNG, and WebP images are supported.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    if (!isValidImageMagicBytes(rawBuffer)) {
      throw new BadRequestError("Invalid image file contents. File does not match expected image format.");
    }

    // Process image with sharp:
    // - Strips all EXIF, GPS, and device metadata
    // - Resizes and crops to a clean 400x400 square avatar
    // - Converts to optimized WebP format
    const processedBuffer = await sharp(rawBuffer)
      .rotate() // auto-orient based on EXIF before stripping
      .resize(400, 400, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 85 })
      .toBuffer();

    const base64DataUri = `data:image/webp;base64,${processedBuffer.toString("base64")}`;

    const db = await getDatabase();
    await db.collection<DbUser>(COLLECTIONS.USER).updateOne(
      { email: user.email.toLowerCase() },
      {
        $set: {
          image: base64DataUri,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Profile picture updated successfully.",
      image: base64DataUri,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE() {
  try {
    const { user } = await requireAuth();

    const db = await getDatabase();
    await db.collection<DbUser>(COLLECTIONS.USER).updateOne(
      { email: user.email.toLowerCase() },
      {
        $set: {
          image: null,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Profile picture removed successfully.",
      image: null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
