
"use client";

import { useMemo, useState } from "react";
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
} from "lucide-react";

type TransactionType =
  | "Deposit"
  | "Withdrawal"
  | "Transfer"
  | "Loan Repayment";

type TransactionStatus = "Completed" | "Pending" | "Failed";

type Transaction = {
  id: string;
  type: TransactionType;
  description: string;
  accountNumber: string;
  amount: number;
  date: string;
  time: string;
  status: TransactionStatus;
  reference: string;
  recipient?: string;
  sender?: string;
};

const initialTransactions: Transaction[] = [
  {
    id: "TRX-2026-00125",
    type: "Transfer",
    description: "Transfer to Michael Chen",
    accountNumber: "TRS-1000-4521",
    amount: 12000,
    date: "2026-11-22",
    time: "10:45 AM",
    status: "Completed",
    reference: "REF-TR-00125",
    recipient: "Michael Chen",
  },
  {
    id: "TRX-2026-00124",
    type: "Deposit",
    description: "Monthly savings deposit",
    accountNumber: "TRS-1000-4521",
    amount: 25000,
    date: "2026-11-22",
    time: "09:30 AM",
    status: "Pending",
    reference: "REF-DP-00124",
  },
  {
    id: "TRX-2026-00123",
    type: "Withdrawal",
    description: "ATM cash withdrawal",
    accountNumber: "TRS-1000-7832",
    amount: 5000,
    date: "2026-11-20",
    time: "03:15 PM",
    status: "Completed",
    reference: "REF-WD-00123",
  },
  {
    id: "TRX-2026-00122",
    type: "Loan Repayment",
    description: "Monthly personal loan installment",
    accountNumber: "TRS-1000-4521",
    amount: 8500,
    date: "2026-11-18",
    time: "11:20 AM",
    status: "Completed",
    reference: "REF-LN-00122",
  },
  {
    id: "TRX-2026-00121",
    type: "Transfer",
    description: "Transfer to Emma Williams",
    accountNumber: "TRS-1000-7832",
    amount: 15000,
    date: "2026-11-16",
    time: "01:40 PM",
    status: "Failed",
    reference: "REF-TR-00121",
    recipient: "Emma Williams",
  },
  {
    id: "TRX-2026-00120",
    type: "Deposit",
    description: "Cash deposit",
    accountNumber: "TRS-1000-2165",
    amount: 80000,
    date: "2026-11-14",
    time: "12:10 PM",
    status: "Completed",
    reference: "REF-DP-00120",
  },
  {
    id: "TRX-2026-00119",
    type: "Withdrawal",
    description: "Branch cash withdrawal",
    accountNumber: "TRS-1000-4521",
    amount: 10000,
    date: "2026-11-12",
    time: "02:05 PM",
    status: "Completed",
    reference: "REF-WD-00119",
  },
  {
    id: "TRX-2026-00118",
    type: "Transfer",
    description: "Transfer to David Miller",
    accountNumber: "TRS-1000-4521",
    amount: 7500,
    date: "2026-11-10",
    time: "04:25 PM",
    status: "Completed",
    reference: "REF-TR-00118",
    recipient: "David Miller",
  },
  {
    id: "TRX-2026-00117",
    type: "Loan Repayment",
    description: "Education loan installment",
    accountNumber: "TRS-1000-7832",
    amount: 12000,
    date: "2026-11-08",
    time: "10:00 AM",
    status: "Completed",
    reference: "REF-LN-00117",
  },
  {
    id: "TRX-2026-00116",
    type: "Deposit",
    description: "Online deposit request",
    accountNumber: "TRS-1000-4521",
    amount: 15000,
    date: "2026-11-05",
    time: "09:15 AM",
    status: "Rejected",
    reference: "REF-DP-00116",
  },
];

const accounts = [
  { number: "All Accounts", type: "All" },
  { number: "TRS-1000-4521", type: "Savings" },
  { number: "TRS-1000-7832", type: "Current" },
  { number: "TRS-1000-2165", type: "Business" },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function CustomerTransactionsPage() {
  const [transactions] = useState(initialTransactions);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [accountFilter, setAccountFilter] = useState("All Accounts");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const query = search.toLowerCase();

      const matchesSearch =
        transaction.id.toLowerCase().includes(query) ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.reference.toLowerCase().includes(query);

      const matchesType =
        typeFilter === "All" || transaction.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" || transaction.status === statusFilter;

      const matchesAccount =
        accountFilter === "All Accounts" ||
        transaction.accountNumber === accountFilter;

      const matchesStartDate =
        !startDate || transaction.date >= startDate;

      const matchesEndDate =
        !endDate || transaction.date <= endDate;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesAccount &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [
    transactions,
    search,
    typeFilter,
    statusFilter,
    accountFilter,
    startDate,
    endDate,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / itemsPerPage)
  );

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalDeposits = transactions
    .filter(
      (transaction) =>
        transaction.type === "Deposit" &&
        transaction.status === "Completed"
    )
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalWithdrawals = transactions
    .filter(
      (transaction) =>
        transaction.type === "Withdrawal" &&
        transaction.status === "Completed"
    )
    .reduce((total, transaction) => total + transaction.amount, 0);

  const completedCount = transactions.filter(
    (transaction) => transaction.status === "Completed"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setStatusFilter("All");
    setAccountFilter("All Accounts");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const exportCSV = () => {
    const headers = [
      "Transaction ID",
      "Type",
      "Description",
      "Account Number",
      "Amount",
      "Date",
      "Time",
      "Status",
      "Reference",
    ];

    const rows = filteredTransactions.map((transaction) => [
      transaction.id,
      transaction.type,
      transaction.description,
      transaction.accountNumber,
      String(transaction.amount),
      transaction.date,
      transaction.time,
      transaction.status,
      transaction.reference,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${value.replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "trustora-transactions.csv";
    link.click();

    URL.revokeObjectURL(url);
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
              View, search, filter, and download your transaction records.
            </p>
          </div>

          <button
            type="button"
            onClick={exportCSV}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4168]"
          >
            <Download size={17} />
            Export CSV
          </button>
        </div>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={<FileText size={21} />}
            label="Total Transactions"
            value={String(transactions.length)}
            description="All account activities"
            color="blue"
          />

          <SummaryCard
            icon={<ArrowDownLeft size={21} />}
            label="Total Deposits"
            value={formatCurrency(totalDeposits)}
            description="Completed deposits"
            color="green"
          />

          <SummaryCard
            icon={<ArrowUpRight size={21} />}
            label="Total Withdrawals"
            value={formatCurrency(totalWithdrawals)}
            description="Completed withdrawals"
            color="amber"
          />

          <SummaryCard
            icon={<CheckCircle2 size={21} />}
            label="Completed"
            value={String(completedCount)}
            description="Successfully processed"
            color="purple"
          />
        </section>

        {/* Filters */}
        <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter size={19} className="text-[#3F72AF]" />
              <h2 className="font-bold text-[#112D4E]">
                Filter Transactions
              </h2>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-[#3F72AF] hover:underline"
            >
              Clear Filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-semibold text-[#6B7280]">
                Search Transaction
              </label>

              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Transaction ID, description..."
                  className="w-full rounded-xl border border-[#DBE2EF] py-3 pl-10 pr-4 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-[#6B7280]">
                Account
              </label>

              <select
                value={accountFilter}
                onChange={(event) => {
                  setAccountFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-[#DBE2EF] bg-white px-4 py-3 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF]"
              >
                {accounts.map((account) => (
                  <option key={account.number} value={account.number}>
                    {account.number === "All Accounts"
                      ? "All Accounts"
                      : `${account.type} - ${account.number}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-[#6B7280]">
                Transaction Type
              </label>

              <select
                value={typeFilter}
                onChange={(event) => {
                  setTypeFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-[#DBE2EF] bg-white px-4 py-3 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF]"
              >
                <option value="All">All Types</option>
                <option value="Deposit">Deposit</option>
                <option value="Withdrawal">Withdrawal</option>
                <option value="Transfer">Transfer</option>
                <option value="Loan Repayment">Loan Repayment</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-[#6B7280]">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-[#DBE2EF] bg-white px-4 py-3 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF]"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-[#6B7280]">
                From Date
              </label>

              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => {
                  setStartDate(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-[#DBE2EF] bg-white px-4 py-3 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-[#6B7280]">
                To Date
              </label>

              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => {
                  setEndDate(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-[#DBE2EF] bg-white px-4 py-3 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF]"
              />
            </div>
          </div>
        </section>

        {/* Transaction Table */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-[#DBE2EF] p-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="font-bold text-[#112D4E]">
                All Transactions
              </h2>
              <p className="mt-1 text-xs text-[#9CA3AF]">
                Showing {filteredTransactions.length} matching records
              </p>
            </div>

            <span className="text-xs text-[#9CA3AF]">
              {filteredTransactions.length} results
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-[#F9F7F7]">
                <tr className="text-xs uppercase tracking-wide text-[#6B7280]">
                  <th className="px-6 py-4 font-semibold">Transaction</th>
                  <th className="px-6 py-4 font-semibold">Account</th>
                  <th className="px-6 py-4 font-semibold">Date & Time</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1F5F9]">
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="transition hover:bg-[#F9FAFB]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <TransactionIcon type={transaction.type} />

                          <div>
                            <p className="text-sm font-semibold text-[#112D4E]">
                              {transaction.type}
                            </p>
                            <p className="mt-1 text-xs text-[#9CA3AF]">
                              {transaction.id}
                            </p>
                            <p className="mt-1 text-xs text-[#6B7280]">
                              {transaction.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-[#6B7280]">
                          {transaction.accountNumber}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm text-[#112D4E]">
                          {formatDate(transaction.date)}
                        </p>
                        <p className="mt-1 text-xs text-[#9CA3AF]">
                          {transaction.time}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-bold ${
                            transaction.type === "Deposit"
                              ? "text-emerald-600"
                              : "text-[#112D4E]"
                          }`}
                        >
                          {transaction.type === "Deposit" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={transaction.status} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedTransaction(transaction)
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#DBE2EF] px-3 py-2 text-xs font-semibold text-[#3F72AF] transition hover:bg-blue-50"
                        >
                          <Eye size={14} />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-14 text-center">
                      <FileText
                        size={34}
                        className="mx-auto text-[#9CA3AF]"
                      />
                      <p className="mt-3 text-sm font-semibold text-[#112D4E]">
                        No transactions found
                      </p>
                      <p className="mt-1 text-xs text-[#9CA3AF]">
                        Try adjusting your filters or search terms.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-[#DBE2EF] p-4 sm:flex-row sm:px-6">
            <p className="text-xs text-[#6B7280]">
              Showing{" "}
              {filteredTransactions.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
              {" - "}
              {Math.min(
                currentPage * itemsPerPage,
                filteredTransactions.length
              )}{" "}
              of {filteredTransactions.length} transactions
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((previous) => Math.max(1, previous - 1))
                }
                className="rounded-lg border border-[#DBE2EF] px-3 py-2 text-xs font-semibold text-[#6B7280] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 min-w-9 rounded-lg px-3 text-xs font-semibold transition ${
                      currentPage === page
                        ? "bg-[#112D4E] text-white"
                        : "border border-[#DBE2EF] text-[#6B7280] hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((previous) =>
                    Math.min(totalPages, previous + 1)
                  )
                }
                className="rounded-lg border border-[#DBE2EF] px-3 py-2 text-xs font-semibold text-[#6B7280] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <p className="pb-3 text-center text-xs text-[#9CA3AF]">
          Trustora Bank · Customer Portal · Illustrative demo data
        </p>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#112D4E]/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#DBE2EF] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                  <Receipt size={21} />
                </div>
                <div>
                  <h2 className="font-bold text-[#112D4E]">
                    Transaction Details
                  </h2>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Transaction receipt information
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="rounded-lg p-2 text-[#6B7280] transition hover:bg-gray-100"
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <div className="text-center">
                <TransactionIcon type={selectedTransaction.type} />

                <p className="mt-3 text-sm font-semibold text-[#6B7280]">
                  {selectedTransaction.type}
                </p>

                <h3 className="mt-1 text-3xl font-bold text-[#112D4E]">
                  {selectedTransaction.type === "Deposit" ? "+" : "-"}
                  {formatCurrency(selectedTransaction.amount)}
                </h3>

                <div className="mt-3">
                  <StatusBadge status={selectedTransaction.status} />
                </div>
              </div>

              <div className="my-6 border-t border-dashed border-[#DBE2EF]" />

              <div className="space-y-4">
                <DetailRow
                  label="Transaction ID"
                  value={selectedTransaction.id}
                />
                <DetailRow
                  label="Reference Number"
                  value={selectedTransaction.reference}
                />
                <DetailRow
                  label="Transaction Type"
                  value={selectedTransaction.type}
                />
                <DetailRow
                  label="Account Number"
                  value={selectedTransaction.accountNumber}
                />
                <DetailRow
                  label="Description"
                  value={selectedTransaction.description}
                />
                {selectedTransaction.recipient && (
                  <DetailRow
                    label="Recipient"
                    value={selectedTransaction.recipient}
                  />
                )}
                <DetailRow
                  label="Date"
                  value={formatDate(selectedTransaction.date)}
                />
                <DetailRow
                  label="Time"
                  value={selectedTransaction.time}
                />
                <DetailRow
                  label="Amount"
                  value={formatCurrency(selectedTransaction.amount)}
                  strong
                />
                <DetailRow
                  label="Status"
                  value={selectedTransaction.status}
                />
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4168]"
              >
                <ArrowDownToLine size={17} />
                Print / Save Receipt
              </button>

              <p className="mt-3 text-center text-xs text-[#9CA3AF]">
                Illustrative transaction record. Not an official bank receipt.
              </p>
            </div>
          </div>
        </div>
      )}
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
  color: "blue" | "green" | "amber" | "purple";
}) {
  const colors = {
    blue: "bg-blue-50 text-[#3F72AF]",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
      <div className={`inline-flex rounded-xl p-3 ${colors[color]}`}>
        {icon}
      </div>
      <p className="mt-4 text-sm text-[#6B7280]">{label}</p>
      <h3 className="mt-1 text-2xl font-bold text-[#112D4E]">{value}</h3>
      <p className="mt-2 text-xs text-[#9CA3AF]">{description}</p>
    </div>
  );
}

function TransactionIcon({ type }: { type: TransactionType }) {
  const styles = {
    Deposit: "bg-emerald-50 text-emerald-600",
    Withdrawal: "bg-amber-50 text-amber-600",
    Transfer: "bg-blue-50 text-[#3F72AF]",
    "Loan Repayment": "bg-purple-50 text-purple-600",
  };

  return (
    <div
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles[type]}`}
    >
      {type === "Deposit" ? (
        <ArrowDownLeft size={19} />
      ) : type === "Withdrawal" ? (
        <ArrowUpRight size={19} />
      ) : type === "Transfer" ? (
        <ArrowLeftRight size={19} />
      ) : (
        <CreditCard size={19} />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Failed: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${styles[status]}`}
    >
      {status === "Completed" ? (
        <CheckCircle2 size={13} />
      ) : status === "Pending" ? (
        <Clock size={13} />
      ) : (
        <XCircle size={13} />
      )}
      {status}
    </span>
  );
}

function DetailRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-[#6B7280]">{label}</span>
      <span
        className={`max-w-[65%] break-all text-right text-xs ${
          strong
            ? "text-sm font-bold text-[#112D4E]"
            : "font-semibold text-[#112D4E]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
