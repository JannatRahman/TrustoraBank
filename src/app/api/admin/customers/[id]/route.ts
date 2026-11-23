import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, handleApiError } from "@/server/auth";
import { AdminService } from "@/services/adminService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const details = await AdminService.getCustomerDetails(id);

    return NextResponse.json({
      success: true,
      data: details,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
