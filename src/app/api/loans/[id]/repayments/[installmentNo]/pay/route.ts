import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { LoanService } from "@/services/loanService";
import { validatePayInstallmentPayload } from "@/validators/loanValidator";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; installmentNo: string }> }
) {
  try {
    const { user } = await requireAuth();
    const { id, installmentNo } = await params;
    const instNo = parseInt(installmentNo, 10);

    const body = await request.json().catch(() => ({}));
    const { pin, account } = validatePayInstallmentPayload(body);

    const result = await LoanService.payInstallment(
      id,
      instNo,
      user.email,
      pin,
      account
    );

    return NextResponse.json({
      success: true,
      message: `Installment #${instNo} paid successfully.`,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
