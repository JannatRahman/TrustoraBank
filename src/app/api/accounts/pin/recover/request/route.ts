import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { PinRecoveryService } from "@/services/pinRecoveryService";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await request.json().catch(() => ({}));
    
    // Default to the authenticated user's email; if an email is provided, ensure it matches the user's email
    // to strictly enforce ownership and prevent cross-user PIN resets
    const requestedEmail = body.email ? String(body.email).trim().toLowerCase() : user.email.toLowerCase();

    if (requestedEmail !== user.email.toLowerCase()) {
      // In accordance with security requirements, prevent PIN changes for another user's account
      return NextResponse.json(
        {
          success: false,
          error: "You can only request PIN recovery for your own authenticated account.",
        },
        { status: 403 }
      );
    }

    const result = await PinRecoveryService.requestRecovery(requestedEmail);

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
