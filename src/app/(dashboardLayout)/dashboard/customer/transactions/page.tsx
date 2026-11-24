"use client";

import { useMemo, useState, useEffect } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Search,
  Download,
  Eye,
  X,
  CalendarDays,
  Wallet,
  CreditCard,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Receipt,
  ArrowDownToLine,
  Loader2,
  FileDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

type TransactionType =
  | "Deposit"
  | "Withdrawal"
  | "Transfer"
  | "Loan Disbursement"
  | "Loan Repayment";

type TransactionStatus = "Completed" | "Pending" | "Failed" | "Rejected";

interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  accountNumber: string;
  amount: number;
  fee?: number;
  date: string;
  time: string;
  status: TransactionStatus;
  reference: string;
  recipient?: string;
  sender?: string;
}

interface AccountOption {
  number: string;
  type: string;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export default function CustomerTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<AccountOption[]>([
    { number: "All Accounts", type: "All" },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState<"csv" | "pdf" | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [accountFilter, setAccountFilter] = useState("All Accounts");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // Fetch linked accounts for dropdown filter
  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounts");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped: AccountOption[] = [
          { number: "All Accounts", type: "All" },
          ...json.data.map((acc: { accountNumber: string; accountType?: string }) => ({
            number: acc.accountNumber,
            type: acc.accountType || "Savings",
          })),
        ];
        setAccounts(mapped);
      }
    } catch (err) {
      console.error("Failed to load customer accounts:", err);
    }
  };

  // Fetch real customer transactions
  const fetchTransactions = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(itemsPerPage));

      if (accountFilter !== "All Accounts") {
        params.append("accountNumber", accountFilter);
      }
      if (typeFilter !== "All") {
        const typeMap: Record<string, string> = {
          Deposit: "DEPOSIT",
          Withdrawal: "WITHDRAWAL",
          Transfer: "TRANSFER",
          "Loan Repayment": "LOAN_REPAYMENT",
          "Loan Disbursement": "LOAN_DISBURSEMENT",
        };
        if (typeMap[typeFilter]) params.append("type", typeMap[typeFilter]);
      }
      if (statusFilter !== "All") {
        params.append("status", statusFilter.toUpperCase());
      }
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await fetch(`/api/transactions?${params.toString()}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || "Failed to load transactions.");
      }

      if (Array.isArray(json.data)) {
        const mapped: Transaction[] = json.data.map(
          (t: {
            transactionId?: string;
            id?: string;
            type?: string;
            amount: number;
            fee?: number;
            createdAt?: string;
            senderAccount?: string;
            receiverAccount?: string;
            description?: string;
            status?: string;
          }) => {
            const rawType = t.type || "TRANSFER";
            const displayType: TransactionType =
              rawType === "DEPOSIT"
                ? "Deposit"
                : rawType === "WITHDRAWAL"
                ? "Withdrawal"
                : rawType === "LOAN_REPAYMENT"
                ? "Loan Repayment"
                : rawType === "LOAN_DISBURSEMENT"
                ? "Loan Disbursement"
                : "Transfer";

            const rawStatus = t.status || "COMPLETED";
            const displayStatus: TransactionStatus =
              rawStatus === "COMPLETED" || rawStatus === "APPROVED"
                ? "Completed"
                : rawStatus === "PENDING"
                ? "Pending"
                : rawStatus === "REJECTED"
                ? "Rejected"
                : "Failed";

            const dt = t.createdAt ? new Date(t.createdAt) : new Date();

            return {
              id: t.transactionId || t.id || "TXN",
              type: displayType,
              description: t.description || `${displayType} operation`,
              accountNumber: t.senderAccount || t.receiverAccount || "N/A",
              amount: t.amount,
              fee: t.fee,
              date: dt.toISOString().slice(0, 10),
              time: dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
              status: displayStatus,
              reference: t.transactionId || t.id || "N/A",
              recipient: t.receiverAccount,
              sender: t.senderAccount,
            };
          }
        );
        setTransactions(mapped);
      }

      if (json.pagination) {
        setTotalPages(json.pagination.totalPages || 1);
        setTotalCount(json.pagination.total || 0);
        setCurrentPage(json.pagination.page || 1);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to fetch transaction records.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [typeFilter, statusFilter, accountFilter, startDate, endDate, currentPage]);

  const filteredTransactions = useMemo(() => {
    if (!search.trim()) return transactions;
    const query = search.toLowerCase();
    return transactions.filter(
      (t) =>
        t.id.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.accountNumber.toLowerCase().includes(query)
    );
  }, [transactions, search]);

  const totalDeposits = transactions
    .filter((t) => t.type === "Deposit" && t.status === "Completed")
    .reduce((total, t) => total + t.amount, 0);

  const totalWithdrawals = transactions
    .filter((t) => t.type === "Withdrawal" && t.status === "Completed")
    .reduce((total, t) => total + t.amount, 0);

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setStatusFilter("All");
    setAccountFilter("All Accounts");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  // Statement export triggered via secure API endpoint
  const handleExport = async (format: "csv" | "pdf") => {
    try {
      setIsExporting(format);
      const params = new URLSearchParams();
      params.append("format", format);

      if (accountFilter !== "All Accounts") {
        params.append("accountNumber", accountFilter);
      }
      if (typeFilter !== "All") {
        const typeMap: Record<string, string> = {
          Deposit: "DEPOSIT",
          Withdrawal: "WITHDRAWAL",
          Transfer: "TRANSFER",
          "Loan Repayment": "LOAN_REPAYMENT",
          "Loan Disbursement": "LOAN_DISBURSEMENT",
        };
        if (typeMap[typeFilter]) params.append("type", typeMap[typeFilter]);
      }
      if (statusFilter !== "All") {
        params.append("status", statusFilter.toUpperCase());
      }
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await fetch(`/api/transactions/statement?${params.toString()}`);
      if (!res.ok) throw new Error("Statement generation failed.");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Trustora_Statement_${Date.now()}.${format}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to download statement.");
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-[#3F72AF]">
              Customer Portal / Transactions
            </p>

            <h1 className="text-2xl font-bold text-[#112D4E] sm:text-3xl">
              Transaction History
            </h1>

            <p className="mt-2 text-sm text-[#6B7280]">
              Authoritative records, filters, and verified PDF/CSV statements.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleExport("csv")}
              disabled={isExporting !== null}
              className="flex items-center gap-1.5 rounded-xl border border-[#DBE2EF] bg-white px-4 py-2.5 text-xs font-semibold text-[#112D4E] transition hover:bg-gray-50 disabled:opacity-50"
            >
              {isExporting === "csv" ? (
                <Loader2 size={15} className="animate-spin text-[#3F72AF]" />
              ) : (
                <Download size={15} />
              )}
              Export CSV
            </button>

            <button
              type="button"
              onClick={() => handleExport("pdf")}
              disabled={isExporting !== null}
              className="flex items-center gap-1.5 rounded-xl bg-[#112D4E] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1D4168] disabled:opacity-50"
            >
              {isExporting === "pdf" ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <FileDown size={15} />
              )}
              Download PDF Statement
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle size={18} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Summary Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={<FileText size={21} />}
            label="Total Operations"
            value={String(totalCount)}
            description="Across linked accounts"
            color="blue"
          />

          <SummaryCard
            icon={<ArrowDownLeft size={21} />}
            label="Current Page Deposits"
            value={formatCurrency(totalDeposits)}
            description="Completed credits"
            color="green"
          />

          <SummaryCard
            icon={<ArrowUpRight size={21} />}
            label="Current Page Debits"
            value={formatCurrency(totalWithdrawals)}
            description="Completed debits"
            color="purple"
          />

          <SummaryCard
            icon={<CreditCard size={21} />}
            label="Active Accounts"
            value={String(accounts.length - 1)}
            description="Eligible for operations"
            color="amber"
          />
        </section>

        {/* Transactions Table & Filters */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          {/* Filter Bar */}
          <div className="space-y-4 border-b border-[#DBE2EF] p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold text-[#112D4E]">Search & Filter</h2>
                <p className="mt-1 text-xs text-[#9CA3AF]">
                  Scope by date range, account, or transaction type.
                </p>
              </div>

              {(search ||
                typeFilter !== "All" ||
                statusFilter !== "All" ||
                accountFilter !== "All Accounts" ||
                startDate ||
                endDate) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-semibold text-[#3F72AF] hover:underline"
                >
                  Reset All Filters
                </button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {/* Search */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                />
                <input
                  type="text"
                  placeholder="Search ID, desc..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-[#DBE2EF] py-2 pl-9 pr-3 text-xs text-[#112D4E] outline-none focus:border-[#3F72AF]"
                />
              </div>

              {/* Account Dropdown */}
              <select
                value={accountFilter}
                onChange={(e) => {
                  setAccountFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-[#DBE2EF] bg-white px-3 py-2 text-xs text-[#112D4E] outline-none focus:border-[#3F72AF]"
              >
                {accounts.map((acc) => (
                  <option key={acc.number} value={acc.number}>
                    {acc.number} {acc.type !== "All" ? `(${acc.type})` : ""}
                  </option>
                ))}
              </select>

              {/* Type Dropdown */}
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-[#DBE2EF] bg-white px-3 py-2 text-xs text-[#112D4E] outline-none focus:border-[#3F72AF]"
              >
                <option value="All">All Types</option>
                <option value="Deposit">Deposit</option>
                <option value="Withdrawal">Withdrawal</option>
                <option value="Transfer">Transfer</option>
                <option value="Loan Repayment">Loan Repayment</option>
                <option value="Loan Disbursement">Loan Disbursement</option>
              </select>

              {/* Status Dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-[#DBE2EF] bg-white px-3 py-2 text-xs text-[#112D4E] outline-none focus:border-[#3F72AF]"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
                <option value="Failed">Failed</option>
              </select>

              {/* Date Filters */}
              <div className="flex items-center gap-1.5 rounded-xl border border-[#DBE2EF] px-2 py-1 text-xs text-gray-500">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent outline-none text-[11px]"
                  aria-label="Start Date Filter"
                />
                <span>-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent outline-none text-[11px]"
                  aria-label="End Date Filter"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead className="bg-[#F9FAFB]">
                <tr className="text-xs uppercase tracking-wider text-[#6B7280]">
                  <th className="px-6 py-4 font-semibold">Transaction ID</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Account</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1F5F9]">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-xs text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin text-[#3F72AF]" size={18} />
                        <span>Loading authoritative transaction ledger...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="transition hover:bg-gray-50/70">
                      <td className="px-6 py-4 text-xs font-semibold text-[#3F72AF]">
                        {tx.id}
                      </td>

                      <td className="px-6 py-4 text-xs font-medium text-[#112D4E]">
                        {tx.type}
                      </td>

                      <td className="px-6 py-4 text-xs text-[#6B7280]">
                        <span className="line-clamp-1">{tx.description}</span>
                      </td>

                      <td className="px-6 py-4 text-xs font-mono text-[#112D4E]">
                        {tx.accountNumber}
                      </td>

                      <td
                        className={`px-6 py-4 text-xs font-bold ${
                          tx.type === "Deposit" || tx.type === "Loan Disbursement"
                            ? "text-emerald-600"
                            : tx.type === "Withdrawal" || tx.type === "Loan Repayment"
                            ? "text-rose-600"
                            : "text-[#112D4E]"
                        }`}
                      >
                        {tx.type === "Withdrawal" || tx.type === "Loan Repayment"
                          ? "- "
                          : "+ "}
                        {formatCurrency(tx.amount)}
                      </td>

                      <td className="px-6 py-4 text-xs text-[#6B7280]">
                        {formatDate(tx.date)}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={tx.status} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedTransaction(tx)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#DBE2EF] px-2.5 py-1 text-xs font-semibold text-[#3F72AF] transition hover:bg-gray-50"
                        >
                          <Eye size={13} />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-xs text-gray-400">
                      <Receipt size={28} className="mx-auto mb-2 text-gray-300" />
                      No transaction records found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-[#DBE2EF] px-6 py-4 text-xs text-gray-500 sm:flex-row">
            <span>
              Showing {filteredTransactions.length} of {totalCount} records (Page {currentPage} of {totalPages})
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1 || isLoading}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft size={14} />
                Previous
              </button>

              <button
                type="button"
                disabled={currentPage >= totalPages || isLoading}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* Modal: Transaction Details */}
        {selectedTransaction && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#112D4E]/50 p-4"
            onClick={() => setSelectedTransaction(null)}
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-7"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#3F72AF]">
                    Transaction Statement Record
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-[#112D4E]">
                    {selectedTransaction.id}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTransaction(null)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <DetailRow label="Operation Type" value={selectedTransaction.type} />
                <DetailRow label="Associated Account" value={selectedTransaction.accountNumber} />
                <DetailRow
                  label="Transaction Amount"
                  value={formatCurrency(selectedTransaction.amount)}
                />
                {selectedTransaction.fee !== undefined && selectedTransaction.fee > 0 && (
                  <DetailRow label="Processing Fee" value={formatCurrency(selectedTransaction.fee)} />
                )}
                <DetailRow label="Posting Date" value={`${formatDate(selectedTransaction.date)} · ${selectedTransaction.time}`} />
                <DetailRow label="Description" value={selectedTransaction.description} />
                <DetailRow label="Status" value={selectedTransaction.status} />
              </div>

              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="mt-6 w-full rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Close Record
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  description,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  color: "blue" | "green" | "purple" | "amber";
}) {
  const colors = {
    blue: "bg-blue-50 text-[#3F72AF]",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
      <div className={`inline-flex rounded-xl p-3 ${colors[color]}`}>
        {icon}
      </div>

      <p className="mt-4 text-xs text-[#6B7280]">{label}</p>
      <h3 className="mt-1 text-2xl font-bold text-[#112D4E]">{value}</h3>
      <p className="mt-1 text-xs text-[#9CA3AF]">{description}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  const styles: Record<TransactionStatus, string> = {
    Completed: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Rejected: "bg-red-50 text-red-700",
    Failed: "bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status]}`}
    >
      {status === "Completed" ? (
        <CheckCircle2 size={12} />
      ) : status === "Pending" ? (
        <Clock size={12} />
      ) : (
        <XCircle size={12} />
      )}
      {status}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-2.5 text-xs">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-[#112D4E] text-right">{value}</span>
    </div>
  );
}
