import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { LoanService } from "@/services/loanService";
import { validateLoanApplicationPayload } from "@/validators/loanValidator";
import type { LoanStatus, LoanType } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const searchParams = request.nextUrl.searchParams;

    const status = (searchParams.get("status") as LoanStatus) || undefined;
    const type = (searchParams.get("type") as LoanType) || undefined;
    const applicant = searchParams.get("applicant") || undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;

    const result = await LoanService.listLoans(user.email, user.role, {
      status,
      type,
      applicant,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.loans,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await request.json().catch(() => ({}));
    const payload = validateLoanApplicationPayload(body);

    const loan = await LoanService.applyForLoan(user.email, user.role, payload);

    return NextResponse.json({
      success: true,
      message: "Loan application submitted successfully.",
      data: loan,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
