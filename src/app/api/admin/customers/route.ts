import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, handleApiError } from "@/server/auth";
import { AdminService } from "@/services/adminService";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;

    const result = await AdminService.listCustomers({ search, status, page, limit });

    return NextResponse.json({
      success: true,
      data: result.customers,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
