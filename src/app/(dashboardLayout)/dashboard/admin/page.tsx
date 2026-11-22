
"use client";

import {
  Users,
  Wallet,
  Landmark,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Clock3,
  TrendingUp,
  TrendingDown,
  Eye,
  MoreHorizontal,
} from "lucide-react";

const stats = [
  {
    title: "Registered Customers",
    value: "12,486",
    change: "+12.8%",
    positive: true,
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Total Bank Accounts",
    value: "15,892",
    change: "+8.4%",
    positive: true,
    icon: Wallet,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Total Bank Balance",
    value: "৳ 84.6M",
    change: "+6.2%",
    positive: true,
    icon: Landmark,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Total Transactions",
    value: "48,295",
    change: "+14.5%",
    positive: true,
    icon: ArrowLeftRight,
    color: "bg-violet-50 text-violet-600",
  },
];

const monthlyData = [
  { month: "Jun", deposits: 62, withdrawals: 38 },
  { month: "Jul", deposits: 75, withdrawals: 48 },
  { month: "Aug", deposits: 58, withdrawals: 42 },
  { month: "Sep", deposits: 85, withdrawals: 55 },
  { month: "Oct", deposits: 72, withdrawals: 46 },
  { month: "Nov", deposits: 94, withdrawals: 61 },
];

const transactions = [
  {
    id: "TXN-2026-0148",
    customer: "Sarah Johnson",
    type: "Deposit",
    amount: "+৳ 45,000",
    date: "Nov 22, 2026",
    status: "Completed",
  },
  {
    id: "TXN-2026-0147",
    customer: "Michael Chen",
    type: "Withdrawal",
    amount: "-৳ 12,500",
    date: "Nov 22, 2026",
    status: "Completed",
  },
  {
    id: "TXN-2026-0146",
    customer: "Emma Williams",
    type: "Transfer",
    amount: "৳ 28,000",
    date: "Nov 21, 2026",
    status: "Pending",
  },
  {
    id: "TXN-2026-0145",
    customer: "David Miller",
    type: "Deposit",
    amount: "+৳ 75,000",
    date: "Nov 21, 2026",
    status: "Completed",
  },
  {
    id: "TXN-2026-0144",
    customer: "Olivia Brown",
    type: "Withdrawal",
    amount: "-৳ 8,000",
    date: "Nov 20, 2026",
    status: "Flagged",
  },
];

const secondaryStats = [
  {
    title: "Total Deposits",
    value: "৳ 24.8M",
    icon: ArrowDownToLine,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "Total Withdrawals",
    value: "৳ 18.3M",
    icon: ArrowUpFromLine,
    color: "text-rose-600 bg-rose-50",
  },
  {
    title: "Pending Loan Applications",
    value: "124",
    icon: Clock3,
    color: "text-amber-600 bg-amber-50",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-[#3F72AF]">
              Administration / Overview
            </p>
            <h1 className="text-2xl font-bold text-[#112D4E] sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Welcome back! Here's what's happening across your bank.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#DBE2EF] bg-white px-4 py-3 text-sm text-[#4B5563] shadow-sm">
            <Clock3 size={17} className="text-[#3F72AF]" />
            Sunday, November 22, 2026
          </div>
        </div>

        {/* Main statistics */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#112D4E]">
              Banking Overview
            </h2>
            <span className="text-xs text-[#6B7280]">
              Illustrative dashboard data
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                    >
                      <Icon size={21} />
                    </div>

                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                      <TrendingUp size={13} />
                      {stat.change}
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-[#6B7280]">
                    {stat.title}
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-[#112D4E]">
                    {stat.value}
                  </h3>
                  <p className="mt-2 text-xs text-[#9CA3AF]">
                    Compared to last month
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Secondary statistics */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {secondaryStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="flex items-center gap-4 rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={22} />
                </div>

                <div>
                  <p className="text-sm text-[#6B7280]">{stat.title}</p>
                  <h3 className="mt-1 text-xl font-bold text-[#112D4E]">
                    {stat.value}
                  </h3>
                </div>
              </div>
            );
          })}
        </section>

        {/* Analytics */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* Deposit and withdrawal chart */}
          <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm xl:col-span-2">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-[#112D4E]">
                  Deposit & Withdrawal Analytics
                </h2>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Monthly banking activity
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
              <div className="mb-3 flex justify-between text-xs text-[#9CA3AF]">
                <span>৳ 100M</span>
                <span>৳ 75M</span>
                <span>৳ 50M</span>
                <span>৳ 25M</span>
                <span>৳ 0</span>
              </div>

              <div className="relative flex h-64 items-end justify-around border-b border-l border-[#DBE2EF] px-2 sm:px-5">
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                  {[1, 2, 3, 4].map((line) => (
                    <div
                      key={line}
                      className="border-t border-dashed border-[#E5E7EB]"
                    />
                  ))}
                </div>

                {monthlyData.map((item) => (
                  <div
                    key={item.month}
                    className="relative z-10 flex h-full flex-col items-center justify-end"
                  >
                    <div className="flex h-full items-end gap-1.5 sm:gap-2">
                      <div
                        className="w-5 rounded-t-md bg-[#3F72AF] transition-all hover:opacity-80 sm:w-8"
                        style={{ height: `${item.deposits}%` }}
                        title={`Deposits: ${item.deposits}M`}
                      />
                      <div
                        className="w-5 rounded-t-md bg-[#DBE2EF] transition-all hover:opacity-80 sm:w-8"
                        style={{ height: `${item.withdrawals}%` }}
                        title={`Withdrawals: ${item.withdrawals}M`}
                      />
                    </div>

                    <span className="absolute -bottom-7 text-xs text-[#6B7280]">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-[#DBE2EF] pt-5">
              <div>
                <p className="text-xs text-[#6B7280]">Total Deposits</p>
                <p className="mt-1 text-lg font-bold text-[#112D4E]">
                  ৳ 24.8M
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Total Withdrawals</p>
                <p className="mt-1 text-lg font-bold text-[#112D4E]">
                  ৳ 18.3M
                </p>
              </div>
            </div>
          </div>

          {/* Transaction activity */}
          <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#112D4E]">
              Transaction Activity
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Transaction status overview
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-[#4B5563]">Completed</span>
                  <span className="font-semibold text-[#112D4E]">78%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#F3F4F6]">
                  <div className="h-full w-[78%] rounded-full bg-emerald-500" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-[#4B5563]">Pending</span>
                  <span className="font-semibold text-[#112D4E]">15%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#F3F4F6]">
                  <div className="h-full w-[15%] rounded-full bg-amber-400" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-[#4B5563]">Failed</span>
                  <span className="font-semibold text-[#112D4E]">5%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#F3F4F6]">
                  <div className="h-full w-[5%] rounded-full bg-rose-500" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-[#4B5563]">Flagged</span>
                  <span className="font-semibold text-[#112D4E]">2%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#F3F4F6]">
                  <div className="h-full w-[2%] rounded-full bg-violet-500" />
                </div>
              </div>
            </div>

            <div className="mt-9 rounded-xl bg-[#F9F7F7] p-4">
              <p className="text-xs text-[#6B7280]">
                Total Transactions
              </p>
              <p className="mt-1 text-2xl font-bold text-[#112D4E]">
                48,295
              </p>
              <p className="mt-1 text-xs text-emerald-600">
                <TrendingUp size={13} className="mr-1 inline" />
                14.5% increase this month
              </p>
            </div>
          </div>
        </section>

        {/* Recent transactions */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-[#DBE2EF] p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-[#112D4E]">
                Recent Transactions
              </h2>
              <p className="mt-1 text-sm text-[#6B7280]">
                Latest banking transactions across all accounts
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 text-sm font-semibold text-[#3F72AF] transition hover:text-[#112D4E]"
            >
              View all
              <Eye size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead className="bg-[#F9FAFB]">
                <tr className="text-xs uppercase tracking-wider text-[#6B7280]">
                  <th className="px-5 py-4 font-semibold">Transaction ID</th>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Type</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1F5F9]">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition hover:bg-[#F9FAFB]"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-[#3F72AF]">
                      {transaction.id}
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-[#112D4E]">
                      {transaction.customer}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4B5563]">
                      {transaction.type}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-[#112D4E]">
                      {transaction.amount}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#6B7280]">
                      {transaction.date}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          transaction.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : transaction.status === "Pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        aria-label={`More actions for ${transaction.id}`}
                        className="rounded-lg p-2 text-[#6B7280] transition hover:bg-[#DBE2EF] hover:text-[#112D4E]"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#DBE2EF] px-5 py-4 text-xs text-[#9CA3AF]">
            Showing 5 illustrative transactions
          </div>
        </section>

      </div>
    </div>
  );
}
