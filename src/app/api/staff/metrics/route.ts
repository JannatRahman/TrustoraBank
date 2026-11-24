import { NextResponse } from "next/server";
import { requireStaffOrAdmin, handleApiError } from "@/server/auth";
import { getDatabase } from "@/lib/mongodb";
import {
  COLLECTIONS,
  type DbUser,
  type DbLoan,
  type DbRequest,
  type DbKycDocument,
} from "@/types";

export async function GET() {
  try {
    const { user } = await requireStaffOrAdmin();
    const db = await getDatabase();

    const usersCol = db.collection<DbUser>(COLLECTIONS.USER);
    const loansCol = db.collection<DbLoan>(COLLECTIONS.LOANS);
    const requestsCol = db.collection<DbRequest>(COLLECTIONS.REQUESTS);
    const kycCol = db.collection<DbKycDocument>(COLLECTIONS.KYC_DOCUMENTS);

    const [
      totalCustomers,
      pendingDeposits,
      pendingWithdrawals,
      pendingLoans,
      pendingKyc,
      totalReviewedRequests,
      recentRequests,
      myReviewedRequests,
    ] = await Promise.all([
      // Total customers count
      usersCol.countDocuments({ role: "customer" }),
      // Pending Deposits
      requestsCol.countDocuments({ type: "DEPOSIT", status: "PENDING" }),
      // Pending Withdrawals
      requestsCol.countDocuments({ type: "WITHDRAWAL", status: "PENDING" }),
      // Pending Loan Applications
      loansCol.countDocuments({
        status: { $in: ["PENDING", "UNDER_REVIEW", "FORWARDED_TO_ADMIN"] },
      }),
      // Pending KYC Documents
      kycCol.countDocuments({ status: "PENDING_REVIEW" }),
      // Total reviewed requests (APPROVED or REJECTED)
      requestsCol.countDocuments({ status: { $in: ["APPROVED", "REJECTED"] } }),
      // Recent 6 requests across the bank
      requestsCol
        .find({})
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray(),
      // Requests reviewed by this staff user
      requestsCol.countDocuments({ reviewedBy: user.email }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalCustomers,
        pendingDeposits,
        pendingWithdrawals,
        pendingLoans,
        pendingKyc,
        totalReviewedRequests,
        myReviewedRequests,
        recentRequests: recentRequests.map((r) => ({
          id: r.requestId,
          customer: r.user,
          accountNumber: r.account,
          type: r.type === "DEPOSIT" ? "Deposit" : "Withdrawal",
          amount: r.amount,
          date: r.createdAt
            ? new Date(r.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "Recent",
          status:
            r.status === "APPROVED"
              ? "Completed"
              : r.status === "PENDING"
              ? "Pending"
              : "Failed",
        })),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
