import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { RequestService } from "@/services/requestService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAuth();
    const { id } = await params;

    const requestDoc = await RequestService.getRequestById(id, user.email, user.role);

    return NextResponse.json({
      success: true,
      data: requestDoc,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
