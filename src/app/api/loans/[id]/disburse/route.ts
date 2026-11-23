import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, handleApiError } from "@/server/auth";
import { LoanService } from "@/services/loanService";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Only Admin can trigger loan disbursement
    const { user } = await requireAdmin();
    const { id } = await params;

    const result = await LoanService.disburseLoan(id, user.email);

    return NextResponse.json({
      success: true,
      message: "Loan disbursed successfully. Account has been credited.",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
