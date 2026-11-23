import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleApiError, ForbiddenError } from "@/server/auth";
import { LoanService } from "@/services/loanService";
import { validateAdminReviewPayload } from "@/validators/loanValidator";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAuth();
    const { id } = await params;

    const body = await request.json().catch(() => ({}));
    const { action, rejectionReason, approvedAmount, interestRate, durationMonths } =
      validateAdminReviewPayload(body);

    if (action === "APPROVE") {
      // Only Admin can approve loans
      if (user.role !== "admin") {
        throw new ForbiddenError("Only Administrators have permission to approve loans.");
      }

      const approved = await LoanService.approveLoan(id, user.email, {
        approvedAmount,
        interestRate,
        durationMonths,
      });

      return NextResponse.json({
        success: true,
        message: "Loan approved successfully.",
        data: approved,
      });
    }

    // Action is REJECT (Admin or Banking Staff can reject)
    if (user.role !== "admin" && user.role !== "banking-staff") {
      throw new ForbiddenError("Access denied. Insufficient permissions to reject loans.");
    }

    const rejected = await LoanService.rejectLoan(
      id,
      user.email,
      user.role,
      rejectionReason || "Declined by bank."
    );

    return NextResponse.json({
      success: true,
      message: "Loan application rejected.",
      data: rejected,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
