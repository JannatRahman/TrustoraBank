import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { RequestService } from "@/services/requestService";
import { validateCreateRequestPayload } from "@/validators/requestValidator";
import type { RequestStatus, RequestType } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const searchParams = request.nextUrl.searchParams;

    const status = (searchParams.get("status") as RequestStatus) || undefined;
    const type = (searchParams.get("type") as RequestType) || undefined;
    const accountNumber = searchParams.get("accountNumber") || undefined;
    const userEmail = searchParams.get("userEmail") || undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;

    const result = await RequestService.listRequests(user.email, user.role, {
      status,
      type,
      accountNumber,
      userEmail,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.requests,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await request.json().catch(() => ({}));
    const payload = validateCreateRequestPayload(body);

    const requestDoc = await RequestService.createRequest(user.email, user.role, payload);

    return NextResponse.json({
      success: true,
      message: `${payload.type === "DEPOSIT" ? "Deposit" : "Withdrawal"} request submitted successfully.`,
      data: requestDoc,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
