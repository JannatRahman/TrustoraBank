import { NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { PinService } from "@/services/pinService";

export async function GET() {
  try {
    const { user } = await requireAuth();
    const status = await PinService.getPinStatus(user.email);

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
