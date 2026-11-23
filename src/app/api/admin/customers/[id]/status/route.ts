import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, handleApiError } from "@/server/auth";
import { AdminService } from "@/services/adminService";
import { validateCustomerStatusPayload } from "@/validators/adminValidator";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAdmin();
    const { id } = await params;

    const body = await request.json().catch(() => ({}));
    const { status, reason } = validateCustomerStatusPayload(body);

    const updated = await AdminService.updateCustomerStatus(id, status, reason, user.email);

    return NextResponse.json({
      success: true,
      message: `Customer status updated to ${status} successfully.`,
      data: updated,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
