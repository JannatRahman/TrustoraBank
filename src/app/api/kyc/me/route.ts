import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/rbac";
import { KycDocumentService } from "@/services/kycDocumentService";
import { ForbiddenError, isNextPrerenderSignal } from "@/server/auth/errors";

export async function GET() {
  try {
    const auth = await requireAuth();
    const status = await KycDocumentService.getCustomerKycStatus(auth.user.id);
    return NextResponse.json(status);
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
