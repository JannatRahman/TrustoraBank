import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin, handleApiError } from "@/server/auth";
import { LoanService } from "@/services/loanService";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireStaffOrAdmin();
    const { id } = await params;

    const forwarded = await LoanService.forwardToAdmin(id, user.email);

    return NextResponse.json({
      success: true,
      message: "Loan application forwarded to admin.",
      data: forwarded,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
