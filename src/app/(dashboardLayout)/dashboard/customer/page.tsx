"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  PiggyBank,
  Landmark,
  CreditCard,
  Plus,
  Loader2,
  FileText,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface CustomerAccount {
  id: string;
  accountNumber: string;
  type: string;
  balance: number;
  status: string;
}

interface CustomerTransaction {
  id: string;
  type: "Deposit" | "Withdrawal" | "Transfer";
  amount: number;
  date: string;
  accountNumber: string;
  description: string;
  status: "Completed" | "Pending" | "Failed";
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

export default function CustomerDashboardPage() {
  const [accounts, setAccounts] = useState<CustomerAccount[]>([]);
  const [transactions, setTransactions] = useState<CustomerTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCustomerData() {
      try {
        setIsLoading(true);
        setError(null);

        const [accountsRes, txnsRes] = await Promise.all([
          fetch("/api/accounts"),
          fetch("/api/transactions?limit=20").catch(() => null),
        ]);

        if (accountsRes.ok) {
          const accJson = await accountsRes.json();
          if (accJson.success && Array.isArray(accJson.data)) {
            setAccounts(
              accJson.data.map(
                (a: {
                  _id?: string;
                  accountNumber: string;
                  accountType?: string;
                  balance: number;
                  status?: string;
                }) => ({
                  id: a.accountNumber,
                  accountNumber: a.accountNumber,
                  type: a.accountType || "Savings",
                  balance: a.balance || 0,
                  status: a.status || "ACTIVE",
                })
              )
            );
          }
        }

        if (txnsRes && txnsRes.ok) {
          const txnJson = await txnsRes.json();
          if (txnJson.success && Array.isArray(txnJson.data)) {
            setTransactions(
              txnJson.data.map(
                (t: {
                  transactionId?: string;
                  id?: string;
                  type?: string;
                  amount: number;
                  createdAt?: string;
                  account?: string;
                  description?: string;
                  status?: string;
                }) => ({
                  id: t.transactionId || t.id || "TXN",
                  type:
                    t.type === "DEPOSIT"
                      ? "Deposit"
                      : t.type === "WITHDRAWAL"
                      ? "Withdrawal"
                      : "Transfer",
                  amount: t.amount,
                  date: t.createdAt
                    ? new Date(t.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Recent",
                  accountNumber: t.account || "N/A",
                  description: t.description || "Banking operation",
                  status:
                    t.status === "COMPLETED" || t.status === "APPROVED"
                      ? "Completed"
                      : t.status === "FAILED"
                      ? "Failed"
                      : "Pending",
                })
              )
            );
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to retrieve account records.");
      } finally {
        setIsLoading(false);
      }
    }
    loadCustomerData();
  }, []);

  const totalBalance = accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  const completedDeposits = transactions
    .filter((t) => t.type === "Deposit" && t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const completedWithdrawals = transactions
    .filter((t) => t.type === "Withdrawal" && t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-[#3F72AF]">
              Customer Portal / Overview
            </p>
            <h1 className="text-2xl font-bold text-[#112D4E] sm:text-3xl">
              Financial Overview
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Real-time summary of your verified accounts and latest cash flow.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/customer/deposits"
              className="flex items-center gap-1.5 rounded-xl bg-[#112D4E] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1D4168]"
            >
              <ArrowDownLeft size={16} />
              Deposit
            </Link>
            <Link
              href="/dashboard/customer/withdrawals"
              className="flex items-center gap-1.5 rounded-xl border border-[#DBE2EF] bg-white px-4 py-2.5 text-xs font-semibold text-[#112D4E] transition hover:bg-gray-50"
            >
              <ArrowUpRight size={16} />
              Withdraw
            </Link>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle size={18} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Financial KPI Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Balance"
            value={formatCurrency(totalBalance)}
            subtitle="Across all active accounts"
            icon={<Wallet size={20} />}
            color="bg-blue-50 text-[#3F72AF]"
          />
          <StatCard
            title="Total Inflow"
            value={formatCurrency(completedDeposits)}
            subtitle="Completed deposits"
            icon={<ArrowDownLeft size={20} />}
            color="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            title="Total Outflow"
            value={formatCurrency(completedWithdrawals)}
            subtitle="Completed withdrawals"
            icon={<ArrowUpRight size={20} />}
            color="bg-rose-50 text-rose-600"
          />
          <StatCard
            title="Active Accounts"
            value={accounts.length.toString()}
            subtitle="Customer bank accounts"
            icon={<CreditCard size={20} />}
            color="bg-purple-50 text-purple-600"
          />
        </section>

        {/* Accounts Cards */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#112D4E]">Your Bank Accounts</h2>
            <Link
              href="/dashboard/customer/accounts"
              className="text-xs font-semibold text-[#3F72AF] hover:underline"
            >
              Manage Accounts
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {isLoading ? (
              <div className="col-span-3 flex items-center justify-center py-8 text-xs text-gray-500">
                <Loader2 size={18} className="mr-2 animate-spin text-[#3F72AF]" />
                Loading your accounts...
              </div>
            ) : accounts.length > 0 ? (
              accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#3F72AF]">
                      {acc.type}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                      {acc.status}
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-bold text-[#112D4E]">
                    {acc.accountNumber}
                  </p>
                  <p className="mt-1 text-base font-semibold text-[#3F72AF]">
                    {formatCurrency(acc.balance)}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-3 rounded-2xl border border-dashed border-[#DBE2EF] bg-white p-8 text-center text-xs text-gray-500">
                No bank accounts associated with your customer profile.
              </div>
            )}
          </div>
        </section>

        {/* Recent Transactions Table */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DBE2EF] p-5 sm:p-6">
            <div>
              <h2 className="font-bold text-[#112D4E]">Recent Transactions</h2>
              <p className="mt-0.5 text-xs text-[#9CA3AF]">
                Your recent banking transactions
              </p>
            </div>
            <Link
              href="/dashboard/customer/transactions"
              className="text-xs font-semibold text-[#3F72AF] hover:underline"
            >
              View Full Statement
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-[#F9FAFB]">
                <tr className="text-xs uppercase tracking-wider text-[#6B7280]">
                  <th className="px-6 py-4 font-semibold">Transaction ID</th>
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
                ) : transactions.length > 0 ? (
                  transactions.slice(0, 8).map((tx) => (
                    <tr key={tx.id} className="transition hover:bg-gray-50/70">
                      <td className="px-6 py-4 text-sm font-semibold text-[#3F72AF]">
                        {tx.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[#112D4E]">
                        {tx.accountNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#4B5563]">
                        {tx.type}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-bold ${
                          tx.type === "Deposit"
                            ? "text-emerald-600"
                            : tx.type === "Withdrawal"
                            ? "text-rose-600"
                            : "text-[#112D4E]"
                        }`}
                      >
                        {tx.type === "Withdrawal" ? "- " : "+ "}
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {tx.date}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            tx.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : tx.status === "Pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-xs text-gray-400">
                      <FileText size={24} className="mx-auto mb-1 text-gray-300" />
                      No recent transaction records found.
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
