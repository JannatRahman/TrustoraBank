import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { TransactionService } from "@/services/transactionService";
import { StatementService } from "@/services/statementService";
import { AccountService } from "@/services/accountService";
import type { TransactionType, TransactionStatus, DbBankAccount } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const searchParams = request.nextUrl.searchParams;

    const format = (searchParams.get("format") || "csv").toLowerCase();
    const accountNumber = searchParams.get("accountNumber") || undefined;
    const type = (searchParams.get("type") as TransactionType) || undefined;
    const status = (searchParams.get("status") as TransactionStatus) || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    // Fetch transactions strictly scoped to this authenticated user (limit up to 1000 for statements)
    const result = await TransactionService.getTransactionHistory(user.email, user.role, {
      accountNumber,
      type,
      status,
      startDate,
      endDate,
      page: 1,
      limit: 1000,
    });

    let selectedAccount: DbBankAccount | null = null;
    if (accountNumber) {
      selectedAccount = await AccountService.getAccountByNumber(accountNumber);
    }

    if (format === "pdf") {
      const pdfBytes = await StatementService.generateStatementPdf({
        customerName: user.name || "Customer",
        customerEmail: user.email,
        account: selectedAccount,
        transactions: result.transactions,
        startDate,
        endDate,
      });

      return new NextResponse(Buffer.from(pdfBytes), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="Trustora_Statement_${Date.now()}.pdf"`,
        },
      });
    }

    // Default: CSV format
    const csvContent = StatementService.generateStatementCsv(result.transactions);

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="Trustora_Statement_${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
