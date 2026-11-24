import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { PinRecoveryService } from "@/services/pinRecoveryService";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await request.json().catch(() => ({}));
    const { code, newPin } = body;

    await PinRecoveryService.confirmRecovery(user.email, code, newPin);

    return NextResponse.json({
      success: true,
      message: "Transaction PIN reset successfully. You can now authorize transactions with your new PIN.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
