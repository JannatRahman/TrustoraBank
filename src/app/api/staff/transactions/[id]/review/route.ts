import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin, handleApiError } from "@/server/auth";
import { SuspiciousTxService } from "@/services/suspiciousTxService";
import { validateReviewFlaggedPayload } from "@/validators/adminValidator";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireStaffOrAdmin();
    const { id } = await params;
    const body = await request.json();

    const payload = validateReviewFlaggedPayload(body);
    const updated = await SuspiciousTxService.reviewFlaggedTransaction(
      id,
      user.email,
      user.role,
      payload.action,
      payload.notes,
      payload.reversalReason
    );

    return NextResponse.json({
      success: true,
      message: `Transaction ${id} review processed: ${payload.action}.`,
      data: {
        transactionId: updated.transactionId,
        status: updated.status,
        reviewStatus: updated.reviewStatus,
        reviewedBy: updated.reviewedBy,
        reviewedAt: updated.reviewedAt,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
