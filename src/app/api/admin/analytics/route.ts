import { NextResponse } from "next/server";
import { requireAdmin, handleApiError } from "@/server/auth";
import { AdminService } from "@/services/adminService";

export async function GET() {
  try {
    await requireAdmin();
    const analytics = await AdminService.getAnalytics();

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
