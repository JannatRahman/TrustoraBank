import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin, handleApiError } from "@/server/auth";
import { SuspiciousTxService } from "@/services/suspiciousTxService";
import { validateFlagTransactionPayload } from "@/validators/adminValidator";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireStaffOrAdmin();
    const { id } = await params;
    const body = await request.json();

    const payload = validateFlagTransactionPayload(body);
    const updated = await SuspiciousTxService.flagTransaction(
      id,
      user.email,
      user.role,
      payload.reason,
      payload.riskLevel
    );

    return NextResponse.json({
      success: true,
      message: `Transaction ${id} has been flagged for investigation.`,
      data: {
        transactionId: updated.transactionId,
        flagged: updated.flagged,
        flagReason: updated.flagReason,
        riskLevel: updated.riskLevel,
        reviewStatus: updated.reviewStatus,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
