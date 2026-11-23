import { NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { KycService } from "@/services/kycService";

export async function GET() {
  try {
    const { user } = await requireAuth();
    const status = await KycService.getKycStatus(user.email);

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
