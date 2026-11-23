import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { TransactionService } from "@/services/transactionService";
import { validateTransferPayload } from "@/validators/transactionValidator";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await request.json().catch(() => ({}));
    const payload = validateTransferPayload(body);

    const transaction = await TransactionService.executeTransfer(user.email, payload);

    return NextResponse.json({
      success: true,
      message: "Transfer completed successfully.",
      data: transaction,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
