
"use client";

import { useState, useEffect } from "react";
import {
  ArrowDownLeft,
  Wallet,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  CalendarDays,
  Banknote,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";

type DepositStatus = "Pending" | "Approved" | "Rejected";

type DepositRequest = {
  id: string;
  accountNumber: string;
  accountType: string;
  amount: number;
  date: string;
  description: string;
  status: DepositStatus;
};

type AccountOption = {
  accountNumber: string;
  type: string;
  balance: number;
  status: string;
};

const mapBackendStatus = (status: string): DepositStatus => {
  switch (status?.toUpperCase()) {
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    case "PENDING":
    default:
      return "Pending";
  }
};

const initialRequests: DepositRequest[] = [];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

export default function CustomerDepositRequestsPage() {
  const [requests, setRequests] = useState<DepositRequest[]>(initialRequests);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [userAccounts, setUserAccounts] = useState<AccountOption[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchRequests = async () => {
    try {
      setIsLoadingRequests(true);
      const res = await fetch("/api/requests?type=DEPOSIT&limit=50");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped: DepositRequest[] = json.data.map((item: any) => ({
          id: item.requestId || item._id,
          accountNumber: item.account,
          accountType: "Bank Account",
          amount: item.amount,
          date: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "",
          description: item.description || "Deposit request",
          status: mapBackendStatus(item.status),
        }));
        setRequests(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch deposit requests:", err);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      setIsLoadingAccounts(true);
      const res = await fetch("/api/accounts");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setUserAccounts(json.data);
        if (json.data.length > 0) {
          setSelectedAccountNumber((prev) =>
            prev || json.data[0].accountNumber
          );
        }
      }
    } catch (err) {
      console.error("Failed to load customer accounts:", err);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchAccounts();
  }, []);

  const selectedAccount =
    userAccounts.find((account) => account.accountNumber === selectedAccountNumber) ??
    userAccounts[0];

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

    if (!selectedAccountNumber) {
      setError("Please select a valid bank account.");
      return;
    }

    const numericAmount = Number(amount);

    if (!amount.trim() || !Number.isFinite(numericAmount)) {
      setError("Please enter a valid deposit amount.");
      return;
    }

    if (numericAmount < 100) {
      setError("Minimum deposit request amount is ৳100.");
      return;
    }

    if (numericAmount > 10000000) {
      setError("Maximum deposit request amount is ৳10,000,000.");
      return;
    }

    if (description.length > 100) {
      setError("Description cannot exceed 100 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: selectedAccountNumber,
          type: "DEPOSIT",
          amount: numericAmount,
          description: description.trim() || "Deposit request",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || "Failed to submit deposit request.");
      }

      await fetchRequests();
      setAmount("");
      setDescription("");
      setShowForm(false);
      setFilter("All");
      setSearch("");
      setSuccessMessage(
        `Your deposit request for ${formatCurrency(numericAmount)} has been submitted and is pending review.`
      );
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting your request.");
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
              Customer Portal / Deposits
            </p>
            <h1 className="text-2xl font-bold text-[#112D4E] sm:text-3xl">
              Deposit Requests
            </h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Submit and track requests to deposit money into your accounts.
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
            New Deposit Request
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
              <p className="text-sm text-emerald-800">{successMessage}</p>
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
            description="All deposit requests"
            color="blue"
          />
          <SummaryCard
            icon={<Clock size={21} />}
            label="Pending Requests"
            value={String(
              requests.filter((request) => request.status === "Pending").length
            )}
            description={formatCurrency(totalPending) + " awaiting review"}
            color="amber"
          />
          <SummaryCard
            icon={<CheckCircle2 size={21} />}
            label="Approved Deposits"
            value={formatCurrency(totalApproved)}
            description="Total approved request value"
            color="green"
          />
          <SummaryCard
            icon={<Wallet size={21} />}
            label="My Accounts"
            value={String(userAccounts.length)}
            description="Available banking accounts"
            color="purple"
          />
        </section>

        {/* Account Overview */}
        <section>
          <div className="mb-4">
            <h2 className="font-bold text-[#112D4E]">Deposit Accounts</h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Your accounts available for deposit requests.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {isLoadingAccounts ? (
              <div className="col-span-3 flex items-center justify-center gap-2 rounded-2xl border border-[#DBE2EF] bg-white p-8 text-sm text-[#6B7280]">
                <Loader2 size={18} className="animate-spin text-[#3F72AF]" />
                Loading your accounts...
              </div>
            ) : userAccounts.length > 0 ? (
              userAccounts.map((account) => (
                <div
                  key={account.accountNumber}
                  className={`rounded-2xl border bg-white p-5 shadow-sm ${
                    account.accountNumber === selectedAccountNumber
                      ? "border-[#3F72AF] ring-1 ring-[#3F72AF]/20"
                      : "border-[#DBE2EF]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                      <Wallet size={21} />
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {account.status || "Active"}
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-[#112D4E]">
                    {account.type} Account
                  </p>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    {account.accountNumber}
                  </p>
                  <p className="mt-4 text-xs text-[#6B7280]">
                    Current Balance
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-[#112D4E]">
                    {formatCurrency(account.balance)}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAccountNumber(account.accountNumber);
                      setShowForm(true);
                      setError("");
                    }}
                    className="mt-4 w-full rounded-lg border border-[#DBE2EF] px-3 py-2 text-sm font-semibold text-[#3F72AF] transition hover:bg-blue-50"
                  >
                    Deposit to this account
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-3 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-sm text-amber-800">
                No active bank accounts found. Contact bank staff or administrator to open your bank account.
              </div>
            )}
          </div>
        </section>

        {/* Requests Table */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-[#DBE2EF] p-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="font-bold text-[#112D4E]">
                Deposit Request History
              </h2>
              <p className="mt-1 text-xs text-[#9CA3AF]">
                Review the status of your submitted requests.
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
                {isLoadingRequests ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 size={28} className="mx-auto animate-spin text-[#3F72AF]" />
                      <p className="mt-3 text-sm font-semibold text-[#112D4E]">Loading deposit requests...</p>
                    </td>
                  </tr>
                ) : filteredRequests.length > 0 ? (
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
                        No deposit requests found
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

        {/* Important Notice */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-[#3F72AF]"
          />
          <div>
            <h3 className="text-sm font-semibold text-[#112D4E]">
              Important Information
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">
              Submitting a deposit request does not immediately increase your
              account balance. The deposit will be reflected only after bank
              staff or an administrator reviews and approves the request.
            </p>
          </div>
        </div>

        <p className="pb-3 text-center text-xs text-[#9CA3AF]">
          Trustora Bank · Customer Portal · All deposit requests are recorded securely in the financial ledger.
        </p>
      </div>

      {/* New Deposit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#112D4E]/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#DBE2EF] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                  <ArrowDownLeft size={22} />
                </div>
                <div>
                  <h2 className="font-bold text-[#112D4E]">
                    New Deposit Request
                  </h2>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Enter your deposit details
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
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                  Select Account
                </label>
                {isLoadingAccounts ? (
                  <div className="flex items-center gap-2 rounded-xl border border-[#DBE2EF] bg-gray-50 px-4 py-3 text-xs text-gray-500">
                    <Loader2 size={15} className="animate-spin text-[#3F72AF]" />
                    Loading accounts...
                  </div>
                ) : userAccounts.length === 0 ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                    No active bank accounts found. You need an active bank account to request a deposit.
                  </div>
                ) : (
                  <select
                    value={selectedAccountNumber}
                    onChange={(event) => setSelectedAccountNumber(event.target.value)}
                    className="w-full rounded-xl border border-[#DBE2EF] bg-white px-4 py-3 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF] focus:ring-2 focus:ring-blue-100"
                  >
                    {userAccounts.map((account) => (
                      <option key={account.accountNumber} value={account.accountNumber}>
                        {account.type} - {account.accountNumber} (৳{account.balance.toLocaleString()})
                      </option>
                    ))}
                  </select>
                )}
                {selectedAccount && (
                  <p className="mt-2 text-xs text-[#9CA3AF]">
                    Available balance: {formatCurrency(selectedAccount.balance)}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                  Deposit Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-[#3F72AF]">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="100"
                    max="10000000"
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
                  Minimum ৳100 · Maximum ৳10,000,000
                </p>
              </div>

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
                  placeholder="Describe the purpose of this deposit..."
                  className="w-full resize-none rounded-xl border border-[#DBE2EF] px-4 py-3 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF] focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1 text-right text-xs text-[#9CA3AF]">
                  {description.length}/100
                </p>
              </div>

              <div className="rounded-xl bg-[#F9F7F7] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[#6B7280]">
                    Request date
                  </span>
                  <span className="flex items-center gap-2 text-sm font-semibold text-[#112D4E]">
                    <CalendarDays size={15} />
                    {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
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
                  disabled={isSubmitting || userAccounts.length === 0}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4168] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
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

function StatusBadge({ status }: { status: DepositStatus }) {
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
