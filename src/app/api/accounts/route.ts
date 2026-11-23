import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { AccountService } from "@/services/accountService";
import type { AccountType, AccountStatus } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const searchParams = request.nextUrl.searchParams;

    // Customer can only view their own accounts
    if (user.role === "customer") {
      const accounts = await AccountService.getAccountsByOwner(user.email);
      return NextResponse.json({
        success: true,
        data: accounts,
      });
    }

    // Banking Staff and Admins can query accounts
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
