import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/rbac";
import { KycDocumentService } from "@/services/kycDocumentService";
import { BadRequestError, NotFoundError, ForbiddenError } from "@/server/auth/errors";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth();

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
    }

    const { documentType, documentNumber, fileName, contentType, contentLength } = body;

    if (!documentType || !["NID", "PASSPORT", "DRIVING_LICENSE"].includes(documentType)) {
      return NextResponse.json(
        { error: "Valid documentType is required ('NID', 'PASSPORT', or 'DRIVING_LICENSE')." },
        { status: 400 }
      );
    }

    if (!documentNumber || typeof documentNumber !== "string" || !documentNumber.trim()) {
      return NextResponse.json({ error: "documentNumber is required." }, { status: 400 });
    }

    if (!fileName || typeof fileName !== "string") {
      return NextResponse.json({ error: "fileName is required." }, { status: 400 });
    }

    if (!contentType || typeof contentType !== "string") {
      return NextResponse.json({ error: "contentType is required." }, { status: 400 });
    }

    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedMimes.includes(contentType.toLowerCase())) {
      return NextResponse.json(
        { error: `Unsupported contentType. Allowed: ${allowedMimes.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await KycDocumentService.createUploadIntent({
      userId: auth.user.id,
      userEmail: auth.user.email,
      documentType,
      documentNumber: documentNumber.trim(),
      fileName,
      contentType: contentType.toLowerCase(),
      contentLength: typeof contentLength === "number" ? contentLength : undefined,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err instanceof BadRequestError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
