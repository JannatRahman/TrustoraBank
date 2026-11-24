import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/server/auth/rbac";
import { KycDocumentService } from "@/services/kycDocumentService";
import { KycProcessingStatus } from "@/types";
import { ForbiddenError, isNextPrerenderSignal } from "@/server/auth/errors";

export async function GET(req: NextRequest) {
  try {
    await requireStaffOrAdmin();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as KycProcessingStatus | undefined;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const result = await KycDocumentService.listSubmissions({
      status,
      search,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    if (isNextPrerenderSignal(err)) {
      throw err;
    }
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
