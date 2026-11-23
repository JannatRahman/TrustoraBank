import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { AccountService } from "@/services/accountService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ accountNumber: string }> }
) {
  try {
    const { user } = await requireAuth();
    const { accountNumber } = await params;

    const account = await AccountService.validateAccountOwnership(
      accountNumber,
      user.email,
      user.role
    );

    return NextResponse.json({
      success: true,
      data: account,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
