import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/server/auth/rbac";
import { KycDocumentService } from "@/services/kycDocumentService";
import { ForbiddenError, NotFoundError, BadRequestError } from "@/server/auth/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireStaffOrAdmin();
    const { id } = await params;

    const result = await KycDocumentService.getSubmissionDetails(id);
    return NextResponse.json(result);
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
