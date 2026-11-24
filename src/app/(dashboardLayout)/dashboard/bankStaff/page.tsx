"use client";

import { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  ArrowLeftRight,
  FileText,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Eye,
  Loader2,
  CalendarDays,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface StaffMetricsData {
  totalCustomers: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  pendingLoans: number;
  pendingKyc: number;
  totalReviewedRequests: number;
  myReviewedRequests: number;
  recentRequests: Array<{
    id: string;
    customer: string;
    accountNumber: string;
    type: "Deposit" | "Withdrawal";
    amount: number;
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

export default function BankStaffDashboardPage() {
  const [metrics, setMetrics] = useState<StaffMetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("/api/staff/metrics");
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || json.message || "Failed to load staff metrics.");
        }
        setMetrics(json.data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to load operational dashboard.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  const totalPendingOperations =
    (metrics?.pendingDeposits || 0) +
    (metrics?.pendingWithdrawals || 0) +
    (metrics?.pendingLoans || 0);

  return (
    <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-[#3F72AF]">
            Banking Operations / Overview
          </p>
          <h1 className="text-2xl font-bold text-[#112D4E] sm:text-3xl">
            Staff Workload & Verification Center
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Review pending customer deposits, withdrawals, loan applications, and identity documents.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle size={18} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* KPI Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Customers"
            value={(metrics?.totalCustomers ?? 0).toLocaleString()}
            subtitle="Registered bank customers"
            icon={<Users size={22} />}
            color="bg-blue-50 text-[#3F72AF]"
          />
          <StatCard
            title="Pending Requests"
            value={((metrics?.pendingDeposits || 0) + (metrics?.pendingWithdrawals || 0)).toString()}
            subtitle={`${metrics?.pendingDeposits || 0} deposits, ${metrics?.pendingWithdrawals || 0} withdrawals`}
            icon={<ArrowLeftRight size={22} />}
            color="bg-amber-50 text-amber-600"
          />
          <StatCard
            title="Pending Loans"
            value={(metrics?.pendingLoans ?? 0).toString()}
            subtitle="Applications under review"
            icon={<FileText size={22} />}
            color="bg-purple-50 text-purple-600"
          />
          <StatCard
            title="Pending KYC"
            value={(metrics?.pendingKyc ?? 0).toString()}
            subtitle="Identity files to verify"
            icon={<ShieldCheck size={22} />}
            color="bg-emerald-50 text-emerald-600"
          />
        </section>

        {/* Workload Summary Section */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#DBE2EF] bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="font-bold text-[#112D4E]">Operational Queue</h2>
                <p className="mt-0.5 text-xs text-[#9CA3AF]">
                  Tasks requiring banking staff action
                </p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                {totalPendingOperations} Item(s) Queued
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <QueueItem
                title="Deposit Approvals"
                count={metrics?.pendingDeposits ?? 0}
                desc="Customer cash and bank deposit requests awaiting review"
                href="/dashboard/bankStaff/transactions"
              />
              <QueueItem
                title="Withdrawal Authorizations"
                count={metrics?.pendingWithdrawals ?? 0}
                desc="PIN-authorized customer withdrawal requests to approve or reject"
                href="/dashboard/bankStaff/transactions"
              />
              <QueueItem
                title="Loan Application Reviews"
                count={metrics?.pendingLoans ?? 0}
                desc="Customer credit applications requiring document check and recommendation"
                href="/dashboard/bankStaff/loans"
              />
              <QueueItem
                title="Customer Identity Verification (KYC)"
                count={metrics?.pendingKyc ?? 0}
                desc="Government ID and passport documents submitted for account activation"
                href="/dashboard/bankStaff/kyc"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-[#DBE2EF] bg-white p-6 shadow-sm">
            <div>
              <h2 className="font-bold text-[#112D4E]">Your Review Performance</h2>
              <p className="mt-0.5 text-xs text-[#9CA3AF]">
                Staff activity audit logs
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-gray-100 bg-[#F9F7F7] p-4">
                  <span className="text-xs text-[#6B7280]">Requests You Reviewed</span>
                  <p className="mt-1 text-2xl font-bold text-[#112D4E]">
                    {(metrics?.myReviewedRequests ?? 0).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-[#F9F7F7] p-4">
                  <span className="text-xs text-[#6B7280]">Total Staff Processed</span>
                  <p className="mt-1 text-2xl font-bold text-[#3F72AF]">
                    {(metrics?.totalReviewedRequests ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-[#112D4E]">
              <p className="font-semibold text-[#3F72AF]">Audit & Compliance Notice</p>
              <p className="mt-1 text-[#6B7280]">
                All approval, rejection, and forward actions are permanently logged with your authenticated staff identity.
              </p>
            </div>
          </div>
        </section>

        {/* Recent Requests Feed */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DBE2EF] p-5 sm:p-6">
            <div>
              <h2 className="font-bold text-[#112D4E]">Recent Banking Requests</h2>
              <p className="mt-1 text-xs text-[#9CA3AF]">
                Live customer operations feed
              </p>
            </div>
            <Link
              href="/dashboard/bankStaff/transactions"
              className="text-xs font-semibold text-[#3F72AF] hover:underline"
            >
              View All Operations
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead className="bg-[#F9FAFB]">
                <tr className="text-xs uppercase tracking-wider text-[#6B7280]">
                  <th className="px-6 py-4 font-semibold">Request ID</th>
                  <th className="px-6 py-4 font-semibold">Account</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-xs text-gray-500">
                      <Loader2 size={18} className="mx-auto animate-spin text-[#3F72AF]" />
                    </td>
                  </tr>
                ) : metrics?.recentRequests && metrics.recentRequests.length > 0 ? (
                  metrics.recentRequests.map((req) => (
                    <tr key={req.id} className="transition hover:bg-gray-50/70">
                      <td className="px-6 py-4 text-sm font-semibold text-[#3F72AF]">
                        {req.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[#112D4E]">
                        {req.accountNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#4B5563]">
                        {req.type}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#112D4E]">
                        {formatCurrency(req.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {req.date}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            req.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : req.status === "Pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-xs text-gray-400">
                      No customer requests found.
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
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#6B7280]">{title}</p>
          <h3 className="mt-1 text-2xl font-bold text-[#112D4E]">{value}</h3>
          <p className="mt-1 text-xs text-[#9CA3AF]">{subtitle}</p>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

function QueueItem({
  title,
  count,
  desc,
  href,
}: {
  title: string;
  count: number;
  desc: string;
  href: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-xl border border-gray-100 p-4 transition hover:bg-gray-50/60 sm:flex-row sm:items-center">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#112D4E]">{title}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              count > 0 ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-500"
            }`}
          >
            {count}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">{desc}</p>
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-xs font-semibold text-[#3F72AF] hover:underline"
      >
        Open Queue
      </Link>
    </div>
  );
}
