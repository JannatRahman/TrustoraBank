import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin, handleApiError, NotFoundError } from "@/server/auth";
import { AccountService } from "@/services/accountService";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ accountNumber: string }> }
) {
  try {
    await requireStaffOrAdmin();
    const { accountNumber } = await params;

    const account = await AccountService.getAccountByNumber(accountNumber);
    if (!account) {
      throw new NotFoundError(`Account ${accountNumber} was not found.`);
    }

    return NextResponse.json({
      success: true,
      data: account,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
