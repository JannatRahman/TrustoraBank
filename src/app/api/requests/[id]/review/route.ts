import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin, handleApiError } from "@/server/auth";
import { RequestService } from "@/services/requestService";
import { validateReviewRequestPayload } from "@/validators/requestValidator";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Only Banking Staff and Admin can review and approve/reject requests
    const { user } = await requireStaffOrAdmin();
    const { id } = await params;

    const body = await request.json().catch(() => ({}));
    const { action, rejectionReason } = validateReviewRequestPayload(body);

    if (action === "APPROVE") {
      const result = await RequestService.approveRequest(id, user.email, user.role);
      return NextResponse.json({
        success: true,
        message: "Request approved and processed successfully.",
        data: result,
      });
    }

    const rejected = await RequestService.rejectRequest(
      id,
      user.email,
      user.role,
      rejectionReason
    );

    return NextResponse.json({
      success: true,
      message: "Request rejected successfully.",
      data: rejected,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
