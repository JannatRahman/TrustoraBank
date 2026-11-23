import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin, requireAdmin, handleApiError } from "@/server/auth";
import { AccountService } from "@/services/accountService";
import { AdminService } from "@/services/adminService";
import { validateCreateAccountPayload } from "@/validators/adminValidator";
import type { AccountType, AccountStatus } from "@/types";

export async function GET(request: NextRequest) {
  try {
    await requireStaffOrAdmin();
    const searchParams = request.nextUrl.searchParams;

    const owner = searchParams.get("owner") || undefined;
    const type = (searchParams.get("type") as AccountType) || undefined;
    const status = (searchParams.get("status") as AccountStatus) || undefined;
    const search = searchParams.get("search") || undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;

    const result = await AccountService.listAccounts({
      owner,
      type,
      status,
      search,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.accounts,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin();
    const body = await request.json();
    const payload = validateCreateAccountPayload(body);

    const account = await AdminService.createBankAccount(payload, user.email);

    return NextResponse.json(
      {
        success: true,
        message: "Bank account created successfully.",
        data: account,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
