import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/server/auth/rbac";
import { KycDocumentService } from "@/services/kycDocumentService";
import { ForbiddenError, NotFoundError, BadRequestError } from "@/server/auth/errors";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireStaffOrAdmin();
    const { id } = await params;

    const body = await req.json().catch(() => null);
    if (!body || !body.decision || !["VERIFY", "REJECT"].includes(body.decision)) {
      return NextResponse.json(
        { error: "decision is required and must be either 'VERIFY' or 'REJECT'." },
        { status: 400 }
      );
    }

    const updated = await KycDocumentService.reviewSubmission({
      submissionId: id,
      decision: body.decision,
      rejectionReason: body.rejectionReason,
      reviewerEmail: auth.user.email,
      reviewerRole: auth.user.role,
    });

    return NextResponse.json({
      message: `KYC submission successfully ${body.decision === "VERIFY" ? "verified" : "rejected"}.`,
      submission: {
        _id: updated._id?.toString(),
        status: updated.status,
        reviewedBy: updated.reviewedBy,
        reviewedAt: updated.reviewedAt,
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
