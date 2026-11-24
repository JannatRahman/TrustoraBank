"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Wallet,
  Landmark,
  ArrowLeftRight,
  TrendingUp,
  Eye,
  Loader2,
  CalendarDays,
  CircleAlert,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  ShieldCheck,
} from "lucide-react";

interface AdminAnalyticsData {
  overview: {
    totalCustomers: number;
    totalStaff: number;
    totalAccounts: number;
    totalBankBalance: number;
    totalDeposits: number;
    totalWithdrawals: number;
    totalTransactions: number;
    pendingLoans: number;
    activeLoans: number;
    completedLoans: number;
  };
  charts: {
    monthlyActivity: Array<{
      year: number;
      month: string;
      deposits: number;
      withdrawals: number;
    }>;
    accountDistribution: Array<{
      type: string;
      count: number;
      totalBalance: number;
    }>;
    loanStatistics: Array<{
      status: string;
      count: number;
      totalAmount: number;
    }>;
    transactionDistribution: Array<{
      type: string;
      count: number;
      totalAmount: number;
    }>;
  };
  recentTransactions: Array<{
    id: string;
    customer: string;
    accountNumber: string;
    type: "Deposit" | "Withdrawal" | "Transfer";
    amount: number;
    currency: string;
    date: string;
    status: "Completed" | "Pending" | "Failed";
  }>;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await fetch(`/api/admin/analytics?${params.toString()}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || "Failed to load admin analytics.");
      }
      setData(json.data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to retrieve dashboard analytics.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [startDate, endDate]);

  const overview = data?.overview || {
    totalCustomers: 0,
    totalStaff: 0,
    totalAccounts: 0,
    totalBankBalance: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalTransactions: 0,
    pendingLoans: 0,
    activeLoans: 0,
    completedLoans: 0,
  };

  const monthlyActivity = data?.charts?.monthlyActivity || [];
  const maxMonthlyVal = Math.max(
    ...monthlyActivity.flatMap((m) => [m.deposits, m.withdrawals]),
    1000
  );

  return (
    <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header & Date Range Filter */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-[#3F72AF]">
              System Administration / Analytics
            </p>
            <h1 className="text-2xl font-bold text-[#112D4E] sm:text-3xl">
              Bank Performance & Metrics
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Real-time authoritative MongoDB financial aggregations and user volume.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-[#DBE2EF] bg-white px-3 py-2 text-xs text-[#112D4E]">
              <CalendarDays size={14} className="text-[#3F72AF]" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="outline-none"
                aria-label="Start Date Filter"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="outline-none"
                aria-label="End Date Filter"
              />
            </div>
            {(startDate || endDate) && (
              <button
                type="button"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <CircleAlert size={18} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Statistics Cards */}
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Registered Customers"
              value={overview.totalCustomers.toLocaleString()}
              icon={<Users size={21} />}
              color="bg-blue-50 text-blue-600"
              subtitle="Active bank clients"
            />
            <StatCard
              title="Total Accounts"
              value={overview.totalAccounts.toLocaleString()}
              icon={<Wallet size={21} />}
              color="bg-indigo-50 text-indigo-600"
              subtitle="Customer bank accounts"
            />
            <StatCard
              title="Total Bank Balance"
              value={formatCurrency(overview.totalBankBalance)}
              icon={<Landmark size={21} />}
              color="bg-emerald-50 text-emerald-600"
              subtitle="Cumulative client deposits"
            />
            <StatCard
              title="Total Transactions"
              value={overview.totalTransactions.toLocaleString()}
              icon={<ArrowLeftRight size={21} />}
              color="bg-violet-50 text-violet-600"
              subtitle="Completed operations"
            />
          </div>
        </section>

        {/* Operational Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Users size={22} />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Staff Members</p>
              <h3 className="mt-1 text-xl font-bold text-[#112D4E]">
                {overview.totalStaff.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FileText size={22} />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Pending Loans</p>
              <h3 className="mt-1 text-xl font-bold text-[#112D4E]">
                {overview.pendingLoans.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Active Loans</p>
              <h3 className="mt-1 text-xl font-bold text-[#112D4E]">
                {overview.activeLoans.toLocaleString()}
              </h3>
            </div>
          </div>
        </section>

        {/* Analytics Charts & Distributions */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {/* Monthly Cash Flow Chart */}
          <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm xl:col-span-2">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-[#112D4E]">
                  Monthly Deposits & Withdrawals
                </h2>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Real MongoDB monthly aggregation totals
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-2 text-[#6B7280]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3F72AF]" />
                  Deposits
                </span>
                <span className="flex items-center gap-2 text-[#6B7280]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#DBE2EF]" />
                  Withdrawals
                </span>
              </div>
            </div>

            <div className="mt-8">
              {isLoading ? (
                <div className="flex h-64 items-center justify-center text-xs text-gray-500">
                  <Loader2 size={20} className="mr-2 animate-spin text-[#3F72AF]" />
                  Loading aggregation charts...
                </div>
              ) : monthlyActivity.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center text-xs text-gray-400">
                  <FileText size={28} className="mb-2 text-gray-300" />
                  No completed deposit or withdrawal activity in this range.
                </div>
              ) : (
                <div className="relative flex h-64 items-end justify-around border-b border-l border-[#DBE2EF] px-2 sm:px-5">
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                    {[1, 2, 3, 4].map((line) => (
                      <div
                        key={line}
                        className="border-t border-dashed border-[#E5E7EB]"
                      />
                    ))}
                  </div>

                  {monthlyActivity.map((item) => {
                    const depositHeight = Math.max(
                      8,
                      Math.round((item.deposits / maxMonthlyVal) * 100)
                    );
                    const withdrawalHeight = Math.max(
                      8,
                      Math.round((item.withdrawals / maxMonthlyVal) * 100)
                    );

                    return (
                      <div
                        key={`${item.year}-${item.month}`}
                        className="relative z-10 flex h-full flex-col items-center justify-end"
                      >
                        <div className="flex h-full items-end gap-1.5 sm:gap-2">
                          <div
                            className="w-5 rounded-t-md bg-[#3F72AF] transition-all hover:opacity-80 sm:w-8"
                            style={{ height: `${depositHeight}%` }}
                            title={`Deposits: ${formatCurrency(item.deposits)}`}
                          />
                          <div
                            className="w-5 rounded-t-md bg-[#DBE2EF] transition-all hover:opacity-80 sm:w-8"
                            style={{ height: `${withdrawalHeight}%` }}
                            title={`Withdrawals: ${formatCurrency(item.withdrawals)}`}
                          />
                        </div>

                        <span className="absolute -bottom-7 text-xs text-[#6B7280]">
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-[#DBE2EF] pt-5">
              <div>
                <p className="text-xs text-[#6B7280]">Total Completed Deposits</p>
                <p className="mt-1 text-lg font-bold text-[#112D4E]">
                  {formatCurrency(overview.totalDeposits)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Total Completed Withdrawals</p>
                <p className="mt-1 text-lg font-bold text-[#112D4E]">
                  {formatCurrency(overview.totalWithdrawals)}
                </p>
              </div>
            </div>
          </div>

          {/* Account Distribution Summary */}
          <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#112D4E]">
              Account Distribution
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Breakdown by account type
            </p>

            <div className="mt-8 space-y-5">
              {data?.charts?.accountDistribution && data.charts.accountDistribution.length > 0 ? (
                data.charts.accountDistribution.map((acc) => {
                  const pct = overview.totalAccounts
                    ? Math.round((acc.count / overview.totalAccounts) * 100)
                    : 0;
                  return (
                    <div key={acc.type}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="font-semibold text-[#112D4E]">
                          {acc.type}
                        </span>
                        <span className="text-xs text-[#6B7280]">
                          {acc.count} ({pct}%) · {formatCurrency(acc.totalBalance)}
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-[#F3F4F6]">
                        <div
                          className="h-full rounded-full bg-[#3F72AF]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="py-8 text-center text-xs text-gray-400">
                  No accounts configured in the system.
                </p>
              )}
            </div>

            <div className="mt-9 rounded-xl bg-[#F9F7F7] p-4">
              <p className="text-xs text-[#6B7280]">Total Bank Activity</p>
              <p className="mt-1 text-2xl font-bold text-[#112D4E]">
                {overview.totalTransactions.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-[#3F72AF]">
                Across all active accounts
              </p>
            </div>
          </div>
        </section>

        {/* Recent Transactions Table */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-[#DBE2EF] p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-[#112D4E]">
                Recent Transactions
              </h2>
              <p className="mt-1 text-sm text-[#6B7280]">
                Latest operations across bank accounts
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead className="bg-[#F9FAFB]">
                <tr className="text-xs uppercase tracking-wider text-[#6B7280]">
                  <th className="px-5 py-4 font-semibold">Transaction ID</th>
                  <th className="px-5 py-4 font-semibold">Account</th>
                  <th className="px-5 py-4 font-semibold">Type</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1F5F9]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-xs text-gray-500">
                      <Loader2 size={16} className="mx-auto animate-spin text-[#3F72AF]" />
                    </td>
                  </tr>
                ) : data?.recentTransactions && data.recentTransactions.length > 0 ? (
                  data.recentTransactions.map((tx) => (
                    <tr key={tx.id} className="transition hover:bg-[#F9FAFB]">
                      <td className="px-5 py-4 text-sm font-semibold text-[#3F72AF]">
                        {tx.id}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-[#112D4E]">
                        {tx.accountNumber}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#4B5563]">
                        {tx.type}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-[#112D4E]">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#6B7280]">
                        {tx.date}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            tx.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : tx.status === "Pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-xs text-gray-400">
                      No transaction records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
          {icon}
        </div>
      </div>

      <p className="mt-5 text-sm text-[#6B7280]">{title}</p>
      <h3 className="mt-1 text-2xl font-bold text-[#112D4E]">{value}</h3>
      <p className="mt-2 text-xs text-[#9CA3AF]">{subtitle}</p>
    </div>
  );
}
