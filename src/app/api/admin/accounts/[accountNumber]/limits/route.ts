import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, handleApiError } from "@/server/auth";
import { AdminService } from "@/services/adminService";
import { validateAccountLimitsPayload } from "@/validators/adminValidator";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ accountNumber: string }> }
) {
  try {
    const { user } = await requireAdmin();
    const { accountNumber } = await params;
    const body = await request.json();

    const payload = validateAccountLimitsPayload(body);
    const updated = await AdminService.updateAccountLimits(
      accountNumber,
      payload,
      user.email
    );

    return NextResponse.json({
      success: true,
      message: `Account ${accountNumber} limits updated successfully.`,
      data: updated,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
