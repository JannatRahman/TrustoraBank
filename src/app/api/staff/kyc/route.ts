import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin, handleApiError } from "@/server/auth";
import { KycService } from "@/services/kycService";
import type { KycStatus } from "@/types";

export async function GET(request: NextRequest) {
  try {
    await requireStaffOrAdmin();
    const searchParams = request.nextUrl.searchParams;

    const status = (searchParams.get("status") as KycStatus) || undefined;
    const search = searchParams.get("search") || undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;

    const result = await KycService.listKycRecords({ status, search, page, limit });

    return NextResponse.json({
      success: true,
      data: result.records,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
