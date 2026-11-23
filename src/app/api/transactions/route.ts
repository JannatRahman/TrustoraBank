import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { TransactionService } from "@/services/transactionService";
import type { TransactionType, TransactionStatus } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const searchParams = request.nextUrl.searchParams;

    const accountNumber = searchParams.get("accountNumber") || undefined;
    const type = (searchParams.get("type") as TransactionType) || undefined;
    const status = (searchParams.get("status") as TransactionStatus) || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;

    const result = await TransactionService.getTransactionHistory(user.email, user.role, {
      accountNumber,
      type,
      status,
      startDate,
      endDate,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.transactions,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
