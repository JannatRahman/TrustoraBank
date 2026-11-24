import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/rbac";
import { KycDocumentService } from "@/services/kycDocumentService";
import { BadRequestError, NotFoundError, ForbiddenError } from "@/server/auth/errors";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth();

    const body = await req.json().catch(() => null);
    if (!body || !body.uploadToken) {
      return NextResponse.json({ error: "uploadToken is required." }, { status: 400 });
    }

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    const result = await KycDocumentService.submitUploadedDocument({
      userId: auth.user.id,
      userEmail: auth.user.email,
      uploadToken: body.uploadToken,
      ipAddress,
      userAgent,
    });

    return NextResponse.json(result, { status: 200 });
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
