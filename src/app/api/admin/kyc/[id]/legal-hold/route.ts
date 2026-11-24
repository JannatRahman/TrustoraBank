import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/rbac";
import { KycDocumentService } from "@/services/kycDocumentService";
import { ForbiddenError, NotFoundError, BadRequestError } from "@/server/auth/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    const { id } = await params;

    const body = await req.json().catch(() => null);
    if (!body || typeof body.legalHold !== "boolean") {
      return NextResponse.json(
        { error: "legalHold boolean field is required." },
        { status: 400 }
      );
    }

    if (!body.reason || typeof body.reason !== "string") {
      return NextResponse.json(
        { error: "A valid reason is required when toggling legal hold." },
        { status: 400 }
      );
    }

    const updated = await KycDocumentService.setLegalHold({
      submissionId: id,
      legalHold: body.legalHold,
      reason: body.reason,
      adminEmail: auth.user.email,
    });

    return NextResponse.json({
      message: `Legal hold successfully ${body.legalHold ? "applied" : "removed"}.`,
      submission: {
        _id: updated._id?.toString(),
        legalHold: updated.legalHold,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (err: unknown) {
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err instanceof NotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err instanceof BadRequestError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
