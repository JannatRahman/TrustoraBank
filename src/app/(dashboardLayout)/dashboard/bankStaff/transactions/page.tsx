"use client";

import { useMemo, useState, useEffect, type ReactNode } from "react";
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  X,
  Flag,
  CalendarDays,
  Wallet,
  Loader2,
  XCircle,
  FileText,
} from "lucide-react";

type TransactionType = "Deposit" | "Withdrawal" | "Transfer";

type TransactionStatus =
  | "Completed"
  | "Pending"
  | "Failed"
  | "Flagged"
  | "Approved"
  | "Rejected";

type ItemRecord = {
  id: string;
  customer: string;
  customerId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  date: string;
  accountNumber: string;
  description: string;
  status: TransactionStatus;
  rejectionReason?: string;
  isRequest?: boolean;
};

const statusStyles: Record<TransactionStatus, string> = {
  Completed: "bg-green-50 text-green-700",
  Approved: "bg-green-50 text-green-700",
  Pending: "bg-amber-50 text-amber-700",
  Failed: "bg-red-50 text-red-700",
  Rejected: "bg-red-50 text-red-700",
  Flagged: "bg-orange-50 text-orange-700",
};

const typeIcons: Record<TransactionType, ReactNode> = {
  Deposit: <ArrowDownLeft size={17} />,
  Withdrawal: <ArrowUpRight size={17} />,
  Transfer: <ArrowLeftRight size={17} />,
};

const typeStyles: Record<TransactionType, string> = {
  Deposit: "bg-green-50 text-green-700",
  Withdrawal: "bg-red-50 text-red-600",
  Transfer: "bg-blue-50 text-[#3F72AF]",
};

export default function TransactionManagementPage() {
  const [items, setItems] = useState<ItemRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedItem, setSelectedItem] = useState<ItemRecord | null>(null);

  // Review states
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const fetchData = async () => {
    try {
      // Fetch both pending/processed requests and completed transactions
      const [reqRes, txnRes] = await Promise.all([
        fetch("/api/requests?limit=100"),
        fetch("/api/transactions?limit=100").catch(() => null),
      ]);

      const merged: ItemRecord[] = [];

      if (reqRes.ok) {
        const reqData = await reqRes.json();
        if (reqData.success && Array.isArray(reqData.data)) {
          reqData.data.forEach(
            (r: {
              requestId: string;
              user?: string;
              account: string;
              type: "DEPOSIT" | "WITHDRAWAL";
              amount: number;
              createdAt?: string;
              description?: string;
              status: string;
              rejectionReason?: string;
            }) => {
              merged.push({
                id: r.requestId,
                customer: r.user || "Customer",
                customerId: r.user || "N/A",
                type: r.type === "DEPOSIT" ? "Deposit" : "Withdrawal",
                amount: r.amount,
                currency: "BDT",
                date: r.createdAt ? r.createdAt.substring(0, 10) : new Date().toISOString().substring(0, 10),
                accountNumber: r.account,
                description: r.description || `${r.type} Request`,
                status:
                  r.status === "PENDING"
                    ? "Pending"
                    : r.status === "APPROVED"
                    ? "Approved"
                    : "Rejected",
                rejectionReason: r.rejectionReason,
                isRequest: true,
              });
            }
          );
        }
      }

      if (txnRes && txnRes.ok) {
        const txnData = await txnRes.json();
        if (txnData.success && Array.isArray(txnData.data)) {
          txnData.data.forEach(
            (t: {
              transactionId?: string;
              id?: string;
              account?: string;
              type?: string;
              amount: number;
              createdAt?: string;
              description?: string;
              status?: string;
              counterpartyAccount?: string;
            }) => {
              const id = t.transactionId || t.id || "TXN";
              // Avoid duplicates if a request has the same ID
              if (!merged.some((m) => m.id === id)) {
                merged.push({
                  id,
                  customer: "Customer",
                  customerId: t.account || "N/A",
                  type:
                    t.type === "DEPOSIT"
                      ? "Deposit"
                      : t.type === "WITHDRAWAL"
                      ? "Withdrawal"
                      : "Transfer",
                  amount: t.amount,
                  currency: "BDT",
                  date: t.createdAt ? t.createdAt.substring(0, 10) : new Date().toISOString().substring(0, 10),
                  accountNumber: t.account || "N/A",
                  description: t.description || "Transaction",
                  status:
                    t.status === "COMPLETED" || t.status === "APPROVED"
                      ? "Completed"
                      : t.status === "FAILED"
                      ? "Failed"
                      : "Pending",
                  isRequest: false,
                });
              }
            }
          );
        }
      }

      setItems(merged);
    } catch (err) {
      console.error("Error fetching transactions/requests:", err);
    }
  };

  useEffect(() => {
    fetchData().finally(() => setIsLoading(false));
  }, []);

  const handleReviewAction = async (action: "APPROVE" | "REJECT") => {
    if (!selectedItem) return;
    setReviewError("");
    setReviewSuccess("");

    if (action === "REJECT" && !showRejectInput) {
      setShowRejectInput(true);
      return;
    }

    if (action === "REJECT" && !rejectReason.trim()) {
      setReviewError("Please provide a reason for rejection.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/requests/${selectedItem.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          rejectionReason: action === "REJECT" ? rejectReason.trim() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || `Failed to ${action.toLowerCase()} request.`);
      }

      setReviewSuccess(
        `Request ${selectedItem.id} has been ${action === "APPROVE" ? "approved" : "rejected"} successfully.`
      );
      setShowRejectInput(false);
      setRejectReason("");

      // Refresh list
      await fetchData();

      // Update selected modal item status
      setSelectedItem((prev) =>
        prev
          ? {
              ...prev,
              status: action === "APPROVE" ? "Approved" : "Rejected",
              rejectionReason: action === "REJECT" ? rejectReason.trim() : prev.rejectionReason,
            }
          : null
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setReviewError(err.message);
      } else {
        setReviewError("An error occurred during review.");
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const searchMatch =
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.customer.toLowerCase().includes(search.toLowerCase()) ||
        item.customerId.toLowerCase().includes(search.toLowerCase()) ||
        item.accountNumber.toLowerCase().includes(search.toLowerCase());

      const typeMatch = typeFilter === "All" || item.type === typeFilter;

      const statusMatch =
        statusFilter === "All" ||
        item.status === statusFilter ||
        (statusFilter === "Completed" && item.status === "Approved");

      const dateMatch = !dateFilter || item.date === dateFilter;

      return searchMatch && typeMatch && statusMatch && dateMatch;
    });
  }, [items, search, typeFilter, statusFilter, dateFilter]);

  const pendingCount = items.filter((item) => item.status === "Pending").length;
  const completedCount = items.filter(
    (item) => item.status === "Completed" || item.status === "Approved"
  ).length;
  const flaggedCount = items.filter((item) => item.status === "Flagged").length;
  const totalVolume = items.reduce((total, item) => total + item.amount, 0);

  const toggleFlag = (id: string) => {
    setItems((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          status: item.status === "Flagged" ? "Pending" : "Flagged",
        };
      })
    );
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === "Flagged" ? "Pending" : "Flagged",
            }
          : null
      );
    }
  };

  const formatAmount = (amount: number, currency: string) =>
    `${currency} ${amount.toLocaleString("en-BD")}`;

  return (
    <div className="min-h-screen bg-[#F9F7F7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* HEADER */}
        <div>
          <p className="text-sm font-medium text-[#3F72AF]">
            BANKING STAFF / TRANSACTIONS & REQUESTS
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#112D4E] sm:text-3xl">
            Transaction & Request Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Review and authorize customer deposit and withdrawal requests, monitor transaction activity, and audit records.
          </p>
        </div>

        {/* STATISTICS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Operations"
            value={items.length.toString()}
            icon={<Wallet size={21} />}
            iconBg="bg-blue-50"
            iconColor="text-[#3F72AF]"
          />

          <StatCard
            title="Pending Review"
            value={pendingCount.toString()}
            icon={<Clock size={21} />}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />

          <StatCard
            title="Completed / Approved"
            value={completedCount.toString()}
            icon={<CheckCircle2 size={21} />}
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />

          <StatCard
            title="Flagged"
            value={flaggedCount.toString()}
            icon={<AlertTriangle size={21} />}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
          />
        </div>

        {/* TRANSACTION VOLUME */}
        <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Volume Processed</p>

          <h2 className="mt-2 text-2xl font-bold text-[#112D4E]">
            {formatAmount(totalVolume, "BDT")}
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Combined value of real deposit/withdrawal requests and transaction activity.
          </p>
        </div>

        {/* TABLE SECTION */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          {/* FILTERS */}
          <div className="space-y-4 border-b border-gray-100 p-5 sm:p-6">
            <div>
              <h2 className="font-bold text-[#112D4E]">
                All Requests & Transactions
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Filter by transaction type, approval status, or date.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search ID or account..."
                  className="w-full rounded-xl border border-[#DBE2EF] py-2.5 pl-10 pr-4 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF]"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-xl border border-[#DBE2EF] bg-white px-3 py-2.5 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF]"
              >
                <option value="All">All Operation Types</option>
                <option value="Deposit">Deposit</option>
                <option value="Withdrawal">Withdrawal</option>
                <option value="Transfer">Transfer</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-[#DBE2EF] bg-white px-3 py-2.5 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF]"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending Review</option>
                <option value="Completed">Completed / Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Flagged">Flagged</option>
              </select>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full rounded-xl border border-[#DBE2EF] py-2.5 pl-10 pr-4 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF]"
                  aria-label="Filter transactions by date"
                />
              </div>
            </div>

            {(search || typeFilter !== "All" || statusFilter !== "All" || dateFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("All");
                  setStatusFilter("All");
                  setDateFilter("");
                }}
                className="text-xs font-semibold text-[#3F72AF] hover:text-[#112D4E]"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-[#F9F7F7]">
                <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Customer / Account</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin text-[#3F72AF]" size={20} />
                        <span>Loading records from MongoDB...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="transition hover:bg-[#F9F7F7]/70">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#112D4E]">
                          {item.id}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {item.isRequest ? "Bank Request" : "Direct Transaction"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#112D4E]">
                          {item.customer}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {item.accountNumber}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${typeStyles[item.type]}`}
                        >
                          {typeIcons[item.type]}
                          {item.type}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-[#112D4E]">
                        {formatAmount(item.amount, item.currency)}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.date}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status]}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedItem(item);
                            setReviewError("");
                            setReviewSuccess("");
                            setShowRejectInput(false);
                            setRejectReason("");
                          }}
                          className="inline-flex items-center gap-2 rounded-lg border border-[#DBE2EF] px-3 py-2 text-xs font-semibold text-[#3F72AF] transition hover:bg-[#DBE2EF]/40"
                        >
                          <Eye size={15} />
                          {item.status === "Pending" ? "Review & Action" : "View"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}

                {!isLoading && filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                      <FileText size={28} className="mx-auto mb-2 text-gray-300" />
                      No transactions or requests found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 px-6 py-4">
            <p className="text-xs text-gray-500">
              Showing {filteredItems.length} of {items.length} records
            </p>
          </div>
        </section>

        <p className="text-xs text-gray-400">
          Trustora Bank · Banking Staff Operations · Real Database Integration
        </p>
      </div>

      {/* REVIEW & DETAIL MODAL */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#112D4E]/50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#3F72AF]">
                  {selectedItem.isRequest ? "Bank Request Review" : "Transaction Details"}
                </p>

                <h3 className="mt-1 text-xl font-bold text-[#112D4E]">
                  {selectedItem.id}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Error or Success alerts */}
            {reviewSuccess && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>{reviewSuccess}</span>
              </div>
            )}
            {reviewError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <XCircle size={18} className="text-red-600 shrink-0" />
                <span>{reviewError}</span>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <DetailRow label="Customer" value={selectedItem.customer} />
              <DetailRow label="Account Number" value={selectedItem.accountNumber} />
              <DetailRow label="Operation Type" value={selectedItem.type} />
              <DetailRow
                label="Amount"
                value={formatAmount(selectedItem.amount, selectedItem.currency)}
              />
              <DetailRow label="Description" value={selectedItem.description} />
              <DetailRow label="Date" value={selectedItem.date} />
              <DetailRow label="Status" value={selectedItem.status} />
              {selectedItem.rejectionReason && (
                <DetailRow
                  label="Rejection Reason"
                  value={selectedItem.rejectionReason}
                />
              )}
            </div>

            {/* ACTION BUTTONS FOR PENDING REQUESTS */}
            {selectedItem.isRequest && selectedItem.status === "Pending" && (
              <div className="mt-6 space-y-3">
                {showRejectInput && (
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#112D4E]">
                      Reason for Rejection
                    </label>
                    <textarea
                      rows={2}
                      maxLength={150}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Specify reason for rejecting this request..."
                      className="w-full rounded-xl border border-[#DBE2EF] p-3 text-sm text-[#112D4E] outline-none focus:border-red-500"
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  {!showRejectInput ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleReviewAction("APPROVE")}
                        disabled={isSubmittingReview}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {isSubmittingReview ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={17} />
                        )}
                        Approve Request
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReviewAction("REJECT")}
                        disabled={isSubmittingReview}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                      >
                        <XCircle size={17} />
                        Reject Request
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowRejectInput(false)}
                        disabled={isSubmittingReview}
                        className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReviewAction("REJECT")}
                        disabled={isSubmittingReview}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {isSubmittingReview && (
                          <Loader2 size={16} className="animate-spin" />
                        )}
                        Confirm Rejection
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Non-request or already processed items flag action */}
            {!selectedItem.isRequest && (
              <button
                type="button"
                onClick={() => toggleFlag(selectedItem.id)}
                disabled={
                  selectedItem.status === "Completed" ||
                  selectedItem.status === "Failed"
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Flag size={17} />
                {selectedItem.status === "Flagged"
                  ? "Remove Flag"
                  : "Flag for Admin Review"}
              </button>
            )}

            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-[#112D4E]">{value}</p>
        </div>

        <div className={`rounded-xl p-3 ${iconBg} ${iconColor}`}>{icon}</div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="break-all text-right text-sm font-medium text-[#112D4E]">
        {value}
      </p>
    </div>
  );
}
