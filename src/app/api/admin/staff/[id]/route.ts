import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/rbac";
import { StaffService } from "@/services/staffService";
import { ForbiddenError, NotFoundError, BadRequestError } from "@/server/auth/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const member = await StaffService.getStaffMember(id);
    return NextResponse.json(member);
  } catch (err: unknown) {
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err instanceof NotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err instanceof BadRequestError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
