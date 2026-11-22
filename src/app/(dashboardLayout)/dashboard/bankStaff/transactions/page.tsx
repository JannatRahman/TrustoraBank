
"use client";

import { useMemo, useState, type ReactNode } from "react";
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
} from "lucide-react";

type TransactionType = "Deposit" | "Withdrawal" | "Transfer";

type TransactionStatus =
  | "Completed"
  | "Pending"
  | "Failed"
  | "Flagged";

type Transaction = {
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
};

const initialTransactions: Transaction[] = [
  {
    id: "TXN-2026-001",
    customer: "Sarah Johnson",
    customerId: "CUS-1001",
    type: "Deposit",
    amount: 15000,
    currency: "BDT",
    date: "2026-11-22",
    accountNumber: "•••• 8921",
    description: "Cash deposit at branch",
    status: "Completed",
  },
  {
    id: "TXN-2026-002",
    customer: "Michael Chen",
    customerId: "CUS-1002",
    type: "Withdrawal",
    amount: 8500,
    currency: "BDT",
    date: "2026-11-22",
    accountNumber: "•••• 8922",
    description: "ATM withdrawal",
    status: "Pending",
  },
  {
    id: "TXN-2026-003",
    customer: "Emma Williams",
    customerId: "CUS-1003",
    type: "Transfer",
    amount: 25000,
    currency: "BDT",
    date: "2026-11-21",
    accountNumber: "•••• 8923",
    description: "Fund transfer",
    status: "Completed",
  },
  {
    id: "TXN-2026-004",
    customer: "David Miller",
    customerId: "CUS-1004",
    type: "Withdrawal",
    amount: 75000,
    currency: "BDT",
    date: "2026-11-21",
    accountNumber: "•••• 8924",
    description: "Large cash withdrawal",
    status: "Pending",
  },
  {
    id: "TXN-2026-005",
    customer: "Olivia Brown",
    customerId: "CUS-1005",
    type: "Deposit",
    amount: 12000,
    currency: "BDT",
    date: "2026-11-20",
    accountNumber: "•••• 8925",
    description: "Mobile banking deposit",
    status: "Failed",
  },
  {
    id: "TXN-2026-006",
    customer: "James Wilson",
    customerId: "CUS-1006",
    type: "Transfer",
    amount: 95000,
    currency: "BDT",
    date: "2026-11-20",
    accountNumber: "•••• 8926",
    description: "External fund transfer",
    status: "Flagged",
  },
  {
    id: "TXN-2026-007",
    customer: "Sarah Johnson",
    customerId: "CUS-1001",
    type: "Withdrawal",
    amount: 5000,
    currency: "BDT",
    date: "2026-11-19",
    accountNumber: "•••• 8921",
    description: "Branch cash withdrawal",
    status: "Completed",
  },
  {
    id: "TXN-2026-008",
    customer: "Michael Chen",
    customerId: "CUS-1002",
    type: "Transfer",
    amount: 42000,
    currency: "BDT",
    date: "2026-11-18",
    accountNumber: "•••• 8922",
    description: "Internal account transfer",
    status: "Pending",
  },
];

const statusStyles: Record<TransactionStatus, string> = {
  Completed: "bg-green-50 text-green-700",
  Pending: "bg-amber-50 text-amber-700",
  Failed: "bg-red-50 text-red-700",
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
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchMatch =
        transaction.id.toLowerCase().includes(search.toLowerCase()) ||
        transaction.customer.toLowerCase().includes(search.toLowerCase()) ||
        transaction.customerId.toLowerCase().includes(search.toLowerCase());

      const typeMatch =
        typeFilter === "All" || transaction.type === typeFilter;

      const statusMatch =
        statusFilter === "All" || transaction.status === statusFilter;

      const dateMatch =
        !dateFilter || transaction.date === dateFilter;

      return searchMatch && typeMatch && statusMatch && dateMatch;
    });
  }, [transactions, search, typeFilter, statusFilter, dateFilter]);

  const pendingCount = transactions.filter(
    (item) => item.status === "Pending"
  ).length;

  const completedCount = transactions.filter(
    (item) => item.status === "Completed"
  ).length;

  const flaggedCount = transactions.filter(
    (item) => item.status === "Flagged"
  ).length;

  const totalVolume = transactions.reduce(
    (total, item) => total + item.amount,
    0
  );

  const toggleFlag = (id: string) => {
    setTransactions((previous) =>
      previous.map((transaction) => {
        if (transaction.id !== id) return transaction;

        return {
          ...transaction,
          status:
            transaction.status === "Flagged"
              ? "Pending"
              : "Flagged",
        };
      })
    );

    setSelectedTransaction(null);
  };

  const formatAmount = (amount: number, currency: string) =>
    `${currency} ${amount.toLocaleString("en-BD")}`;

  return (
    <div className="min-h-screen bg-[#F9F7F7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* HEADER */}
        <div>
          <p className="text-sm font-medium text-[#3F72AF]">
            BANKING STAFF / TRANSACTIONS
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#112D4E] sm:text-3xl">
            Transaction Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Monitor customer transactions, review pending activity, and flag suspicious transactions.
          </p>
        </div>

        {/* STATISTICS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Transactions"
            value={transactions.length.toString()}
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
            title="Completed"
            value={completedCount.toString()}
            icon={<CheckCircle2 size={21} />}
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />

          <StatCard
            title="Flagged Transactions"
            value={flaggedCount.toString()}
            icon={<AlertTriangle size={21} />}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
          />
        </div>

        {/* TRANSACTION VOLUME */}
        <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Illustrative transaction volume
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#112D4E]">
            {formatAmount(totalVolume, "BDT")}
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Combined value of the sample transactions shown on this page.
          </p>
        </div>

        {/* TRANSACTION TABLE */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">

          {/* FILTERS */}
          <div className="space-y-4 border-b border-gray-100 p-5 sm:p-6">
            <div>
              <h2 className="font-bold text-[#112D4E]">
                All Transactions
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Search and filter customer transaction records.
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
                  placeholder="Search transaction ID..."
                  className="form-input pl-10"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="form-input"
              >
                <option value="All">All Transaction Types</option>
                <option value="Deposit">Deposit</option>
                <option value="Withdrawal">Withdrawal</option>
                <option value="Transfer">Transfer</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
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
                  className="form-input pl-10"
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
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition hover:bg-[#F9F7F7]/70"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#112D4E]">
                        {transaction.id}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {transaction.accountNumber}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#112D4E]">
                        {transaction.customer}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {transaction.customerId}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${typeStyles[transaction.type]}`}
                      >
                        {typeIcons[transaction.type]}
                        {transaction.type}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-[#112D4E]">
                      {formatAmount(transaction.amount, transaction.currency)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(`${transaction.date}T00:00:00`).toLocaleDateString(
                        "en-GB",
                        { day: "2-digit", month: "short", year: "numeric" }
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[transaction.status]}`}
                      >
                        {transaction.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedTransaction(transaction)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#DBE2EF] px-3 py-2 text-xs font-semibold text-[#3F72AF] transition hover:bg-[#DBE2EF]/40"
                      >
                        <Eye size={15} />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                      No transactions found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 px-6 py-4">
            <p className="text-xs text-gray-500">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
          </div>
        </section>

        <p className="text-xs text-gray-400">
          Prototype interface — all transaction records and amounts are illustrative mock data. No real financial transactions are processed.
        </p>
      </div>

      {/* TRANSACTION REVIEW MODAL */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#112D4E]/50 p-4"
          onClick={() => setSelectedTransaction(null)}
        >
          <div
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#3F72AF]">
                  Transaction Review
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#112D4E]">
                  Transaction Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close transaction review"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 rounded-xl bg-[#F9F7F7] p-5">
              <p className="text-xs text-gray-500">Transaction Amount</p>

              <h3 className="mt-2 text-2xl font-bold text-[#112D4E]">
                {formatAmount(
                  selectedTransaction.amount,
                  selectedTransaction.currency
                )}
              </h3>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedTransaction.status]}`}
              >
                {selectedTransaction.status}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <DetailRow
                label="Transaction ID"
                value={selectedTransaction.id}
              />

              <DetailRow
                label="Customer Name"
                value={selectedTransaction.customer}
              />

              <DetailRow
                label="Customer ID"
                value={selectedTransaction.customerId}
              />

              <DetailRow
                label="Account Number"
                value={selectedTransaction.accountNumber}
              />

              <DetailRow
                label="Transaction Type"
                value={selectedTransaction.type}
              />

              <DetailRow
                label="Description"
                value={selectedTransaction.description}
              />

              <DetailRow
                label="Transaction Date"
                value={selectedTransaction.date}
              />
            </div>

            {selectedTransaction.status === "Pending" && (
              <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-4">
                <div className="flex gap-2">
                  <Clock size={18} className="shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      Pending Transaction
                    </p>
                    <p className="mt-1 text-xs leading-5 text-amber-700">
                      This transaction is awaiting further processing. Staff can review it or flag it for admin attention.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedTransaction.status === "Flagged" && (
              <div className="mt-6 rounded-xl border border-orange-100 bg-orange-50 p-4">
                <div className="flex gap-2">
                  <AlertTriangle size={18} className="shrink-0 text-orange-600" />
                  <div>
                    <p className="text-sm font-semibold text-orange-800">
                      Flagged for Admin Review
                    </p>
                    <p className="mt-1 text-xs leading-5 text-orange-700">
                      This transaction has been marked for further investigation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => toggleFlag(selectedTransaction.id)}
              disabled={
                selectedTransaction.status === "Completed" ||
                selectedTransaction.status === "Failed"
              }
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Flag size={17} />
              {selectedTransaction.status === "Flagged"
                ? "Remove Flag"
                : "Flag for Admin Review"}
            </button>

            <button
              type="button"
              onClick={() => setSelectedTransaction(null)}
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
          <p className="mt-2 text-2xl font-bold text-[#112D4E]">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="break-all text-right text-sm font-medium text-[#112D4E]">
        {value}
      </p>
    </div>
  );
}
