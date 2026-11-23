import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin, handleApiError } from "@/server/auth";
import { KycService } from "@/services/kycService";
import { validateKycReviewPayload } from "@/validators/adminValidator";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireStaffOrAdmin();
    const { id } = await params;
    const body = await request.json();

    const payload = validateKycReviewPayload(body);
    const updated = await KycService.reviewKyc(
      id,
      payload.action,
      user.email,
      user.role,
      payload.rejectionReason
    );

    return NextResponse.json({
      success: true,
      message: `KYC for ${updated.email} has been ${payload.action === "VERIFY" ? "verified" : "rejected"}.`,
      data: {
        id: updated._id,
        email: updated.email,
        kycStatus: updated.kycStatus,
        reviewedAt: updated.kycReviewedAt,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
