import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { TransactionService } from "@/services/transactionService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAuth();
    const { id } = await params;

    const transaction = await TransactionService.getTransactionById(id, user.email, user.role);

    return NextResponse.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
