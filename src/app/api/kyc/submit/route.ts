import { NextRequest, NextResponse } from "next/server";
import { requireCustomer, handleApiError } from "@/server/auth";
import { KycService } from "@/services/kycService";
import { validateKycSubmitPayload } from "@/validators/adminValidator";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireCustomer();
    const body = await request.json();

    const payload = validateKycSubmitPayload(body);
    const updated = await KycService.submitKyc(
      user.email,
      payload.documentType,
      payload.documentNumber
    );

    return NextResponse.json({
      success: true,
      message: "KYC documents submitted successfully. Verification is pending review.",
      data: {
        kycStatus: updated.kycStatus,
        kycDocumentType: updated.kycDocumentType,
        kycSubmittedAt: updated.kycSubmittedAt,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
