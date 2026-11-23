import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { LoanService } from "@/services/loanService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAuth();
    const { id } = await params;

    const repayments = await LoanService.getLoanRepayments(id, user.email, user.role);

    return NextResponse.json({
      success: true,
      data: repayments,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
