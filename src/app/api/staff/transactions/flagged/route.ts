import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin, handleApiError } from "@/server/auth";
import { SuspiciousTxService } from "@/services/suspiciousTxService";

export async function GET(request: NextRequest) {
  try {
    await requireStaffOrAdmin();
    const searchParams = request.nextUrl.searchParams;

    const reviewStatus = searchParams.get("reviewStatus") || undefined;
    const riskLevel = searchParams.get("riskLevel") || undefined;
    const type = searchParams.get("type") || undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;

    const result = await SuspiciousTxService.listFlaggedTransactions({
      reviewStatus,
      riskLevel,
      type,
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
