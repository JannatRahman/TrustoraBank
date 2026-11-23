import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { PinService } from "@/services/pinService";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await request.json().catch(() => ({}));
    const { newPin, currentPin } = body;

    await PinService.setTransactionPin(user.email, newPin, currentPin);

    return NextResponse.json({
      success: true,
      message: "Transaction PIN configured successfully.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
