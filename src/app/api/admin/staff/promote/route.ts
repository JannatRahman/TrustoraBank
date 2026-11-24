import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/rbac";
import { StaffService } from "@/services/staffService";
import { ForbiddenError, NotFoundError, BadRequestError, ConflictError } from "@/server/auth/errors";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();

    const body = await req.json().catch(() => null);
    if (!body || !body.candidateId) {
      return NextResponse.json({ error: "candidateId is required." }, { status: 400 });
    }

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined;

    const result = await StaffService.promoteCustomerToStaff({
      candidateId: body.candidateId,
      department: body.department,
      adminEmail: auth.user.email,
      ipAddress,
    });

    return NextResponse.json(result, { status: 200 });
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
    if (err instanceof ConflictError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
