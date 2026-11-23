import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin, handleApiError } from "@/server/auth";
import { AdminService } from "@/services/adminService";
import { validateAccountStatusPayload } from "@/validators/adminValidator";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ accountNumber: string }> }
) {
  try {
    const { user } = await requireStaffOrAdmin();
    const { accountNumber } = await params;
    const body = await request.json();

    const payload = validateAccountStatusPayload(body);
    const updated = await AdminService.updateAccountStatus(
      accountNumber,
      payload.status,
      payload.reason,
      user.email
    );

    return NextResponse.json({
      success: true,
      message: `Account ${accountNumber} status updated to ${payload.status}.`,
      data: updated,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
