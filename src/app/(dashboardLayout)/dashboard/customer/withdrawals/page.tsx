
"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Wallet,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  CalendarDays,
  AlertCircle,
  X,
  ShieldCheck,
  Banknote,
} from "lucide-react";

type WithdrawalStatus = "Pending" | "Approved" | "Rejected";

type WithdrawalRequest = {
  id: string;
  accountNumber: string;
  accountType: string;
  amount: number;
  date: string;
  description: string;
  status: WithdrawalStatus;
};

const accounts = [
  {
    id: "1",
    accountNumber: "TRS-1000-4521",
    type: "Savings",
    balance: 245000,
    status: "Active",
  },
  {
    id: "2",
    accountNumber: "TRS-1000-7832",
    type: "Current",
    balance: 580000,
    status: "Active",
  },
  {
    id: "3",
    accountNumber: "TRS-1000-2165",
    type: "Business",
    balance: 125500,
    status: "Active",
  },
];

const initialRequests: WithdrawalRequest[] = [
  {
    id: "WDR-2026-00125",
    accountNumber: "TRS-1000-4521",
    accountType: "Savings",
    amount: 10000,
    date: "22 Nov 2026",
    description: "Personal cash withdrawal",
    status: "Pending",
  },
  {
    id: "WDR-2026-00119",
    accountNumber: "TRS-1000-7832",
    accountType: "Current",
    amount: 30000,
    date: "19 Nov 2026",
    description: "Business expenses",
    status: "Approved",
  },
  {
    id: "WDR-2026-00111",
    accountNumber: "TRS-1000-4521",
    accountType: "Savings",
    amount: 5000,
    date: "13 Nov 2026",
    description: "Emergency cash",
    status: "Rejected",
  },
  {
    id: "WDR-2026-00104",
    accountNumber: "TRS-1000-2165",
    accountType: "Business",
    amount: 20000,
    date: "07 Nov 2026",
    description: "Office expenses",
    status: "Approved",
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

export default function CustomerWithdrawalRequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [accountId, setAccountId] = useState(accounts[0].id);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const selectedAccount =
    accounts.find((account) => account.id === accountId) ?? accounts[0];

  const totalPending = requests
    .filter((request) => request.status === "Pending")
    .reduce((total, request) => total + request.amount, 0);

  const totalApproved = requests
    .filter((request) => request.status === "Approved")
    .reduce((total, request) => total + request.amount, 0);

  const filteredRequests = requests.filter((request) => {
    const matchesFilter =
      filter === "All" || request.status === filter;

    const query = search.toLowerCase();

    const matchesSearch =
      request.id.toLowerCase().includes(query) ||
      request.accountNumber.toLowerCase().includes(query) ||
      request.description.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    const numericAmount = Number(amount);

    if (!amount.trim() || !Number.isFinite(numericAmount)) {
      setError("Please enter a valid withdrawal amount.");
      return;
    }

    if (numericAmount < 100) {
      setError("Minimum withdrawal request amount is ৳100.");
      return;
    }

    if (numericAmount > 200000) {
      setError("Maximum withdrawal request amount is ৳200,000.");
      return;
    }

    if (numericAmount > selectedAccount.balance) {
      setError("Insufficient available balance in this account.");
      return;
    }

    if (selectedAccount.status !== "Active") {
      setError("This account is not active.");
      return;
    }

    if (description.length > 100) {
      setError("Description cannot exceed 100 characters.");
      return;
    }

    const newRequest: WithdrawalRequest = {
      id: `WDR-2026-${String(requests.length + 126).padStart(5, "0")}`,
      accountNumber: selectedAccount.accountNumber,
      accountType: selectedAccount.type,
      amount: numericAmount,
      date: "22 Nov 2026",
      description: description.trim() || "Withdrawal request",
      status: "Pending",
    };

    setRequests((previous) => [newRequest, ...previous]);
    setAmount("");
    setDescription("");
    setShowForm(false);
    setFilter("All");
    setSearch("");

    setSuccessMessage(
      `Your withdrawal request for ${formatCurrency(numericAmount)} has been submitted successfully.`
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-[#3F72AF]">
              Customer Portal / Withdrawals
            </p>

            <h1 className="text-2xl font-bold text-[#112D4E] sm:text-3xl">
              Withdrawal Requests
            </h1>

            <p className="mt-2 text-sm text-[#6B7280]">
              Request withdrawals from your accounts and track their status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setError("");
              setSuccessMessage("");
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4168]"
          >
            <Plus size={18} />
            New Withdrawal Request
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-emerald-600"
              />
              <p className="text-sm text-emerald-800">
                {successMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              className="text-emerald-700"
              aria-label="Dismiss message"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Summary Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={<FileText size={21} />}
            label="Total Requests"
            value={String(requests.length)}
            description="All withdrawal requests"
            color="blue"
          />

          <SummaryCard
            icon={<Clock size={21} />}
            label="Pending Requests"
            value={String(
              requests.filter((request) => request.status === "Pending")
                .length
            )}
            description={`${formatCurrency(totalPending)} awaiting review`}
            color="amber"
          />

          <SummaryCard
            icon={<CheckCircle2 size={21} />}
            label="Approved Withdrawals"
            value={formatCurrency(totalApproved)}
            description="Total approved request value"
            color="green"
          />

          <SummaryCard
            icon={<Wallet size={21} />}
            label="Available Accounts"
            value={String(accounts.length)}
            description="Your active banking accounts"
            color="purple"
          />
        </section>

        {/* Account Overview */}
        <section>
          <div className="mb-4">
            <h2 className="font-bold text-[#112D4E]">
              Withdrawal Accounts
            </h2>

            <p className="mt-1 text-sm text-[#6B7280]">
              Select an account to submit a withdrawal request.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm ${
                  account.id === accountId
                    ? "border-[#3F72AF] ring-1 ring-[#3F72AF]/20"
                    : "border-[#DBE2EF]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                    <Wallet size={21} />
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {account.status}
                  </span>
                </div>

                <p className="mt-4 text-sm font-semibold text-[#112D4E]">
                  {account.type} Account
                </p>

                <p className="mt-1 text-xs text-[#9CA3AF]">
                  {account.accountNumber}
                </p>

                <p className="mt-4 text-xs text-[#6B7280]">
                  Available Balance
                </p>

                <h3 className="mt-1 text-xl font-bold text-[#112D4E]">
                  {formatCurrency(account.balance)}
                </h3>

                <button
                  type="button"
                  onClick={() => {
                    setAccountId(account.id);
                    setShowForm(true);
                    setError("");
                  }}
                  className="mt-4 w-full rounded-lg border border-[#DBE2EF] px-3 py-2 text-sm font-semibold text-[#3F72AF] transition hover:bg-blue-50"
                >
                  Withdraw from this account
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Withdrawal History */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-[#DBE2EF] p-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="font-bold text-[#112D4E]">
                Withdrawal Request History
              </h2>

              <p className="mt-1 text-xs text-[#9CA3AF]">
                Track all your withdrawal requests.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search request..."
                className="rounded-lg border border-[#DBE2EF] px-3 py-2 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF]"
              />

              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="rounded-lg border border-[#DBE2EF] bg-white px-3 py-2 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF]"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-[#F9F7F7]">
                <tr className="text-xs uppercase tracking-wide text-[#6B7280]">
                  <th className="px-6 py-4 font-semibold">Request ID</th>
                  <th className="px-6 py-4 font-semibold">Account</th>
                  <th className="px-6 py-4 font-semibold">Request Date</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="transition hover:bg-[#F9FAFB]"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-[#3F72AF]">
                          {request.id}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#112D4E]">
                          {request.accountType}
                        </p>
                        <p className="mt-1 text-xs text-[#9CA3AF]">
                          {request.accountNumber}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {request.date}
                      </td>

                      <td className="px-6 py-4 text-sm font-bold text-[#112D4E]">
                        {formatCurrency(request.amount)}
                      </td>

                      <td className="max-w-[180px] px-6 py-4 text-sm text-[#6B7280]">
                        <span className="line-clamp-2">
                          {request.description}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={request.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <FileText
                        size={30}
                        className="mx-auto text-[#9CA3AF]"
                      />

                      <p className="mt-3 text-sm font-semibold text-[#112D4E]">
                        No withdrawal requests found
                      </p>

                      <p className="mt-1 text-xs text-[#9CA3AF]">
                        Try changing your search or status filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Notice */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <div>
            <h3 className="text-sm font-semibold text-[#112D4E]">
              Withdrawal Approval
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">
              Your withdrawal request will remain Pending until reviewed by
              authorized bank staff or an administrator. Your account balance
              will only be deducted after approval.
            </p>
          </div>
        </div>

        <p className="pb-3 text-center text-xs text-[#9CA3AF]">
          Trustora Bank · Customer Portal · Illustrative demo data
        </p>
      </div>

      {/* New Withdrawal Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#112D4E]/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#DBE2EF] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                  <ArrowUpRight size={22} />
                </div>

                <div>
                  <h2 className="font-bold text-[#112D4E]">
                    New Withdrawal Request
                  </h2>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Enter your withdrawal details
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-[#6B7280] transition hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
              {/* Account */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                  Select Account
                </label>

                <select
                  value={accountId}
                  onChange={(event) => {
                    setAccountId(event.target.value);
                    setError("");
                  }}
                  className="w-full rounded-xl border border-[#DBE2EF] bg-white px-4 py-3 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF] focus:ring-2 focus:ring-blue-100"
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.type} - {account.accountNumber}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-[#9CA3AF]">
                  Available balance: {formatCurrency(selectedAccount.balance)}
                </p>
              </div>

              {/* Amount */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                  Withdrawal Amount
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-[#3F72AF]">
                    ৳
                  </span>

                  <input
                    type="number"
                    min="100"
                    max="200000"
                    value={amount}
                    onChange={(event) => {
                      setAmount(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter amount"
                    className="w-full rounded-xl border border-[#DBE2EF] py-3 pl-9 pr-4 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <p className="mt-2 text-xs text-[#9CA3AF]">
                  Minimum ৳100 · Maximum ৳200,000
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                  Description
                  <span className="ml-1 font-normal text-[#9CA3AF]">
                    (Optional)
                  </span>
                </label>

                <textarea
                  rows={3}
                  maxLength={100}
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    setError("");
                  }}
                  placeholder="Describe the purpose of this withdrawal..."
                  className="w-full resize-none rounded-xl border border-[#DBE2EF] px-4 py-3 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF] focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-right text-xs text-[#9CA3AF]">
                  {description.length}/100
                </p>
              </div>

              {/* Request Summary */}
              <div className="rounded-xl bg-[#F9F7F7] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[#6B7280]">
                    Request date
                  </span>

                  <span className="flex items-center gap-2 text-sm font-semibold text-[#112D4E]">
                    <CalendarDays size={15} />
                    22 Nov 2026
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-sm text-[#6B7280]">
                    Request status
                  </span>

                  <StatusBadge status="Pending" />
                </div>
              </div>

              {error && (
                <p className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-xl border border-[#DBE2EF] px-4 py-3 text-sm font-semibold text-[#6B7280] transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#112D4E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4168]"
                >
                  Submit Request
                </button>
              </div>
            </form>
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
  color: "blue" | "amber" | "green" | "purple";
}) {
  const colors = {
    blue: "bg-blue-50 text-[#3F72AF]",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-emerald-50 text-emerald-600",
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

function StatusBadge({ status }: { status: WithdrawalStatus }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${styles[status]}`}
    >
      {status === "Pending" ? (
        <Clock size={13} />
      ) : status === "Approved" ? (
        <CheckCircle2 size={13} />
      ) : (
        <XCircle size={13} />
      )}
      {status}
    </span>
  );
}
