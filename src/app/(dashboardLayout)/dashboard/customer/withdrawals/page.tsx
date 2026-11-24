"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  Lock,
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
  rejectionReason?: string;
};

type CustomerAccount = {
  id: string;
  accountNumber: string;
  type: string;
  balance: number;
  status: string;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

export default function CustomerWithdrawalRequestsPage() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [accounts, setAccounts] = useState<CustomerAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/requests?type=WITHDRAWAL&limit=50");
      if (!res.ok) throw new Error("Failed to load withdrawal requests");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped: WithdrawalRequest[] = json.data.map(
          (item: {
            requestId: string;
            account: string;
            amount: number;
            createdAt?: string;
            description?: string;
            status: string;
            rejectionReason?: string;
          }) => ({
            id: item.requestId,
            accountNumber: item.account,
            accountType: "Account",
            amount: item.amount,
            date: item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Recent",
            description: item.description || "Withdrawal request",
            status:
              item.status === "APPROVED"
                ? "Approved"
                : item.status === "REJECTED"
                ? "Rejected"
                : "Pending",
            rejectionReason: item.rejectionReason,
          })
        );
        setRequests(mapped);
      }
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounts");
      if (!res.ok) throw new Error("Failed to fetch accounts");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped: CustomerAccount[] = json.data.map(
          (acc: {
            _id?: string;
            accountNumber: string;
            accountType?: string;
            balance: number;
            status?: string;
          }) => ({
            id: acc.accountNumber,
            accountNumber: acc.accountNumber,
            type: acc.accountType || "Savings",
            balance: acc.balance || 0,
            status: acc.status || "ACTIVE",
          })
        );
        setAccounts(mapped);
        if (mapped.length > 0 && !accountId) {
          setAccountId(mapped[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    Promise.all([fetchRequests(), fetchAccounts()]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const selectedAccount =
    accounts.find((acc) => acc.id === accountId) ?? accounts[0] ?? {
      id: "none",
      accountNumber: "N/A",
      type: "Savings",
      balance: 0,
      status: "INACTIVE",
    };

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

    if (selectedAccount.status !== "ACTIVE" && selectedAccount.status !== "Active") {
      setError("This account is not active.");
      return;
    }

    if (!pin || pin.length < 4 || pin.length > 6) {
      setError("Please enter your 4-6 digit transaction PIN.");
      return;
    }

    if (description.length > 100) {
      setError("Description cannot exceed 100 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: selectedAccount.accountNumber,
          type: "WITHDRAWAL",
          amount: numericAmount,
          description: description.trim() || "Cash withdrawal request",
          pin,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || "Failed to submit withdrawal request.");
      }

      setAmount("");
      setPin("");
      setDescription("");
      setShowForm(false);
      setFilter("All");
      setSearch("");

      setSuccessMessage(
        `Your withdrawal request for ${formatCurrency(numericAmount)} has been submitted successfully.`
      );

      await Promise.all([fetchRequests(), fetchAccounts()]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<Wallet size={20} />}
            label="Total Balance"
            value={formatCurrency(
              accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0)
            )}
            description="Across all your bank accounts"
            color="blue"
          />

          <SummaryCard
            icon={<Clock size={20} />}
            label="Pending Withdrawals"
            value={formatCurrency(totalPending)}
            description={`${
              requests.filter((r) => r.status === "Pending").length
            } request(s) under review`}
            color="amber"
          />

          <SummaryCard
            icon={<CheckCircle2 size={20} />}
            label="Approved Withdrawals"
            value={formatCurrency(totalApproved)}
            description={`${
              requests.filter((r) => r.status === "Approved").length
            } completed request(s)`
            }
            color="green"
          />

          <SummaryCard
            icon={<Banknote size={20} />}
            label="Active Accounts"
            value={accounts.length.toString()}
            description="Eligible for withdrawal"
            color="purple"
          />
        </div>

        {/* Account Cards */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-[#112D4E]">
            Your Bank Accounts
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                onClick={() => setAccountId(account.id)}
                className={`cursor-pointer rounded-2xl border p-5 transition ${
                  selectedAccount.id === account.id
                    ? "border-[#3F72AF] bg-blue-50/50 shadow-sm"
                    : "border-[#DBE2EF] bg-white hover:border-[#3F72AF]/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#3F72AF]">
                    {account.type}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                    {account.status}
                  </span>
                </div>

                <p className="mt-3 text-lg font-bold text-[#112D4E]">
                  {account.accountNumber}
                </p>

                <p className="mt-1 text-sm font-semibold text-[#3F72AF]">
                  {formatCurrency(account.balance)}
                </p>
              </div>
            ))}
            {accounts.length === 0 && !isLoading && (
              <div className="col-span-3 rounded-2xl border border-dashed border-[#DBE2EF] bg-white p-6 text-center text-sm text-[#6B7280]">
                No bank accounts found for your customer profile.
              </div>
            )}
          </div>
        </section>

        {/* Requests Table */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          <div className="border-b border-[#DBE2EF] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-[#112D4E]">
                  Withdrawal History
                </h2>
                <p className="mt-1 text-xs text-[#9CA3AF]">
                  Track the progress of your withdrawal requests.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-xl border border-[#DBE2EF] px-3 py-2 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF]"
                />

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-xl border border-[#DBE2EF] bg-white px-3 py-2 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-[#F9F7F7]">
                <tr className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  <th className="px-6 py-4">Request ID</th>
                  <th className="px-6 py-4">Account</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#DBE2EF]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#6B7280]">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin text-[#3F72AF]" size={20} />
                        <span>Loading withdrawal requests...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredRequests.map((request) => (
                  <tr key={request.id} className="transition hover:bg-gray-50/70">
                    <td className="px-6 py-4 text-sm font-semibold text-[#112D4E]">
                      {request.id}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#112D4E]">
                      {request.accountNumber}
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-red-600">
                      - {formatCurrency(request.amount)}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#6B7280]">
                      {request.date}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#6B7280]">
                      <div>{request.description}</div>
                      {request.rejectionReason && (
                        <div className="mt-1 text-xs text-red-600">
                          Reason: {request.rejectionReason}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={request.status} />
                    </td>
                  </tr>
                ))}

                {!isLoading && filteredRequests.length === 0 && (
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
              Withdrawal Approval & Security
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">
              Your withdrawal request will remain Pending until reviewed by
              authorized bank staff or an administrator. Your account balance
              will only be deducted after approval. All withdrawal requests are
              digitally authorized with your secure transaction PIN.
            </p>
          </div>
        </div>

        <p className="pb-3 text-center text-xs text-[#9CA3AF]">
          Trustora Bank · Customer Portal · Secure Banking Operations
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
                    Enter your withdrawal details and verify with PIN
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
                      {account.type} - {account.accountNumber} ({formatCurrency(account.balance)})
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

              {/* Transaction PIN */}
              <div>
                <label className="mb-2 flex items-center justify-between text-sm font-semibold text-[#112D4E]">
                  <span className="flex items-center gap-1.5">
                    <Lock size={15} className="text-[#3F72AF]" />
                    Transaction PIN
                  </span>
                  <span className="text-xs font-normal text-[#9CA3AF]">
                    4 to 6 digits
                  </span>
                </label>

                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(event) => {
                    setPin(event.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  placeholder="Enter your transaction PIN"
                  className="w-full rounded-xl border border-[#DBE2EF] px-4 py-3 text-sm tracking-widest text-[#112D4E] outline-none focus:border-[#3F72AF] focus:ring-2 focus:ring-blue-100"
                  required
                />

                <p className="mt-2 text-xs text-[#9CA3AF]">
                  Required to securely authorize withdrawal from your account.
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
                  rows={2}
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
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl border border-[#DBE2EF] px-4 py-3 text-sm font-semibold text-[#6B7280] transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4168] disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
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
