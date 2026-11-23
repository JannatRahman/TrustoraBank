import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin, handleApiError } from "@/server/auth";
import { LoanService } from "@/services/loanService";
import { validateStaffNotePayload } from "@/validators/loanValidator";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireStaffOrAdmin();
    const { id } = await params;

    const body = await request.json().catch(() => ({}));
    const { note } = validateStaffNotePayload(body);

    const updated = await LoanService.addStaffNote(id, user.email, note);

    return NextResponse.json({
      success: true,
      message: "Staff note added successfully.",
      data: updated,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
