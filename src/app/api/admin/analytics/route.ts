import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, handleApiError } from "@/server/auth";
import { AdminService } from "@/services/adminService";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const analytics = await AdminService.getAnalytics({ startDate, endDate });

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
