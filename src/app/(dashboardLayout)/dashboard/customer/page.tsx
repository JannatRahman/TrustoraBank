
"use client";

import { useState } from "react";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  CreditCard,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Landmark,
  ChevronDown,
  ChevronRight,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Plus,
  Eye,
  EyeOff,
  Banknote,
  BriefcaseBusiness,
  Home,
} from "lucide-react";

type Account = {
  id: string;
  accountNumber: string;
  type: "Savings" | "Current" | "Business";
  balance: number;
  status: "Active" | "Frozen";
  branch: string;
};

type Transaction = {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  type: "Deposit" | "Withdrawal" | "Transfer" | "Payment";
  status: "Completed" | "Pending";
};

const accounts: Account[] = [
  {
    id: "1",
    accountNumber: "TRS-1000-4521",
    type: "Savings",
    balance: 245000,
    status: "Active",
    branch: "Dhanmondi Branch",
  },
  {
    id: "2",
    accountNumber: "TRS-1000-7832",
    type: "Current",
    balance: 580000,
    status: "Active",
    branch: "Gulshan Branch",
  },
  {
    id: "3",
    accountNumber: "TRS-1000-2165",
    type: "Business",
    balance: 125500,
    status: "Active",
    branch: "Uttara Branch",
  },
];

const transactions: Transaction[] = [
  {
    id: "TRX-2026-00125",
    title: "Salary Deposit",
    category: "Monthly salary",
    date: "22 Nov 2026",
    amount: 65000,
    type: "Deposit",
    status: "Completed",
  },
  {
    id: "TRX-2026-00124",
    title: "Online Shopping",
    category: "Shopping",
    date: "21 Nov 2026",
    amount: 4500,
    type: "Withdrawal",
    status: "Completed",
  },
  {
    id: "TRX-2026-00123",
    title: "Transfer to Michael",
    category: "Fund transfer",
    date: "20 Nov 2026",
    amount: 12000,
    type: "Transfer",
    status: "Completed",
  },
  {
    id: "TRX-2026-00122",
    title: "Electricity Bill",
    category: "Utility payment",
    date: "19 Nov 2026",
    amount: 2800,
    type: "Payment",
    status: "Completed",
  },
  {
    id: "TRX-2026-00121",
    title: "Cash Deposit",
    category: "Branch deposit",
    date: "18 Nov 2026",
    amount: 20000,
    type: "Deposit",
    status: "Pending",
  },
];

const monthlySpending = [
  { month: "Jun", amount: 35 },
  { month: "Jul", amount: 52 },
  { month: "Aug", amount: 42 },
  { month: "Sep", amount: 68 },
  { month: "Oct", amount: 55 },
  { month: "Nov", amount: 78 },
];

const monthlyDeposits = [
  { month: "Jun", amount: 65 },
  { month: "Jul", amount: 45 },
  { month: "Aug", amount: 72 },
  { month: "Sep", amount: 58 },
  { month: "Oct", amount: 85 },
  { month: "Nov", amount: 95 },
];

const transactionDistribution = [
  { label: "Deposits", percentage: 40, color: "bg-[#3F72AF]", amount: "৳1,25,000" },
  { label: "Withdrawals", percentage: 30, color: "bg-[#E9A23B]", amount: "৳92,500" },
  { label: "Transfers", percentage: 20, color: "bg-[#112D4E]", amount: "৳62,000" },
  { label: "Payments", percentage: 10, color: "bg-[#A2CB8B]", amount: "৳31,000" },
];

const activeLoans = [
  {
    id: "LN-2026-0018",
    name: "Personal Loan",
    amount: 500000,
    remaining: 325000,
    installment: 15000,
    progress: 35,
    nextDue: "05 Dec 2026",
  },
  {
    id: "LN-2026-0021",
    name: "Education Loan",
    amount: 300000,
    remaining: 240000,
    installment: 10000,
    progress: 20,
    nextDue: "12 Dec 2026",
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

export default function CustomerDashboardPage() {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const totalBalance = accounts.reduce(
    (total, account) => total + account.balance,
    0
  );

  const totalDeposits = 125000;
  const totalWithdrawals = 92500;

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
              Welcome back, Sarah!
            </h1>

            <p className="mt-2 text-sm text-[#6B7280]">
              Here's an overview of your finances and banking activity.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#DBE2EF] bg-white px-4 py-3 text-sm text-[#6B7280]">
            <CalendarDays size={17} className="text-[#3F72AF]" />
            November 22, 2026
          </div>
        </div>

        {/* Account Switcher */}
        <section className="relative rounded-2xl bg-gradient-to-r from-[#112D4E] via-[#1D4168] to-[#3F72AF] p-5 text-white shadow-sm sm:p-7">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <Wallet size={18} />
                Your Selected Account
              </div>

              <h2 className="mt-3 text-xl font-bold">
                {selectedAccount.type} Account
              </h2>

              <p className="mt-1 text-sm tracking-wider text-blue-100">
                {selectedAccount.accountNumber}
              </p>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-3 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <CreditCard size={18} />
                Switch Account
                <ChevronDown
                  size={17}
                  className={`transition ${accountMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 top-full z-30 mt-2 w-72 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-2 shadow-xl">
                  {accounts.map((account) => (
                    <button
                      key={account.id}
                      type="button"
                      onClick={() => {
                        setSelectedAccount(account);
                        setAccountMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg p-3 text-left transition ${
                        selectedAccount.id === account.id
                          ? "bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#112D4E]">
                          {account.type} Account
                        </p>
                        <p className="mt-1 text-xs text-[#6B7280]">
                          {account.accountNumber}
                        </p>
                      </div>

                      {selectedAccount.id === account.id && (
                        <CheckCircle2 size={18} className="text-[#3F72AF]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-5 border-t border-white/20 pt-5 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3 text-sm text-blue-100">
                Available Balance
                <button
                  type="button"
                  onClick={() => setShowBalance(!showBalance)}
                  aria-label={showBalance ? "Hide balance" : "Show balance"}
                >
                  {showBalance ? <Eye size={17} /> : <EyeOff size={17} />}
                </button>
              </div>

              <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {showBalance
                  ? formatCurrency(selectedAccount.balance)
                  : "••••••••"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs">
              <span className="flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-2 text-emerald-100">
                <CheckCircle2 size={14} />
                {selectedAccount.status}
              </span>

              <span className="rounded-full bg-white/10 px-3 py-2 text-blue-100">
                {selectedAccount.branch}
              </span>
            </div>
          </div>
        </section>

        {/* Financial Summary */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#112D4E]">
              Financial Overview
            </h2>
            <span className="text-xs text-[#9CA3AF]">
              Across all your accounts
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                  <Wallet size={21} />
                </div>
                <span className="text-xs font-medium text-[#9CA3AF]">
                  All accounts
                </span>
              </div>

              <p className="mt-5 text-sm text-[#6B7280]">
                Total Account Balance
              </p>
              <h3 className="mt-1 text-2xl font-bold text-[#112D4E]">
                {formatCurrency(totalBalance)}
              </h3>
              <p className="mt-2 text-xs text-[#9CA3AF]">
                {accounts.length} active accounts
              </p>
            </div>

            <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <ArrowDownLeft size={21} />
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <TrendingUp size={14} />
                  Deposits
                </span>
              </div>

              <p className="mt-5 text-sm text-[#6B7280]">
                Total Deposits
              </p>
              <h3 className="mt-1 text-2xl font-bold text-[#112D4E]">
                {formatCurrency(totalDeposits)}
              </h3>
              <p className="mt-2 text-xs text-[#9CA3AF]">
                This month
              </p>
            </div>

            <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <ArrowUpRight size={21} />
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                  <TrendingDown size={14} />
                  Withdrawals
                </span>
              </div>

              <p className="mt-5 text-sm text-[#6B7280]">
                Total Withdrawals
              </p>
              <h3 className="mt-1 text-2xl font-bold text-[#112D4E]">
                {formatCurrency(totalWithdrawals)}
              </h3>
              <p className="mt-2 text-xs text-[#9CA3AF]">
                This month
              </p>
            </div>

            <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <PiggyBank size={21} />
                </div>
                <span className="text-xs font-medium text-[#9CA3AF]">
                  Active loans
                </span>
              </div>

              <p className="mt-5 text-sm text-[#6B7280]">
                Outstanding Loans
              </p>
              <h3 className="mt-1 text-2xl font-bold text-[#112D4E]">
                {formatCurrency(
                  activeLoans.reduce((sum, loan) => sum + loan.remaining, 0)
                )}
              </h3>
              <p className="mt-2 text-xs text-[#9CA3AF]">
                {activeLoans.length} active loans
              </p>
            </div>
          </div>
        </section>

        {/* Charts */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#112D4E]">
              Financial Analytics
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Track your spending and deposits over the last six months.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

            {/* Monthly Spending */}
            <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[#112D4E]">
                    Monthly Spending
                  </h3>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Spending trend · Last 6 months
                  </p>
                </div>

                <div className="rounded-lg bg-blue-50 p-2 text-[#3F72AF]">
                  <TrendingUp size={19} />
                </div>
              </div>

              <div className="mt-7 flex h-52 items-end justify-between gap-3 border-b border-l border-[#DBE2EF] px-3 pb-0 pt-4">
                {monthlySpending.map((item) => (
                  <div
                    key={item.month}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div className="flex h-full w-full items-end justify-center">
                      <div
                        className="w-full max-w-10 rounded-t-lg bg-[#3F72AF] transition hover:bg-[#112D4E]"
                        style={{ height: `${item.amount}%` }}
                        title={`${item.amount}%`}
                      />
                    </div>
                    <span className="pb-2 text-xs text-[#9CA3AF]">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-[#9CA3AF]">
                <span>Illustrative spending data</span>
                <span>Unit: thousand BDT</span>
              </div>
            </div>

            {/* Monthly Deposits */}
            <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[#112D4E]">
                    Monthly Deposit History
                  </h3>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Deposit trend · Last 6 months
                  </p>
                </div>

                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <ArrowDownLeft size={19} />
                </div>
              </div>

              <div className="mt-7 flex h-52 items-end justify-between gap-3 border-b border-l border-[#DBE2EF] px-3 pb-0 pt-4">
                {monthlyDeposits.map((item) => (
                  <div
                    key={item.month}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div className="flex h-full w-full items-end justify-center">
                      <div
                        className="w-full max-w-10 rounded-t-lg bg-[#A2CB8B] transition hover:bg-[#3F72AF]"
                        style={{ height: `${item.amount}%` }}
                        title={`${item.amount}%`}
                      />
                    </div>
                    <span className="pb-2 text-xs text-[#9CA3AF]">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-[#9CA3AF]">
                <span>Illustrative deposit data</span>
                <span>Unit: thousand BDT</span>
              </div>
            </div>
          </div>
        </section>

        {/* Transaction Distribution + Recent Transactions */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.8fr_1.2fr]">

          {/* Transaction Distribution */}
          <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-6">
            <h3 className="font-bold text-[#112D4E]">
              Transaction Distribution
            </h3>
            <p className="mt-1 text-xs text-[#9CA3AF]">
              Breakdown by transaction type
            </p>

            <div className="mt-7 flex flex-col items-center gap-7 sm:flex-row xl:flex-col 2xl:flex-row">
              <div
                className="relative h-44 w-44 shrink-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(#3F72AF 0% 40%, #E9A23B 40% 70%, #112D4E 70% 90%, #A2CB8B 90% 100%)",
                }}
              >
                <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-2xl font-bold text-[#112D4E]">
                    100%
                  </span>
                  <span className="text-xs text-[#9CA3AF]">
                    Transactions
                  </span>
                </div>
              </div>

              <div className="w-full space-y-4">
                {transactionDistribution.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-3 w-3 rounded-sm ${item.color}`}
                        />
                        <span className="text-sm text-[#4B5563]">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-[#112D4E]">
                        {item.percentage}%
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F3F4F6]">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 text-xs text-[#9CA3AF]">
              Illustrative transaction distribution.
            </p>
          </div>

          {/* Recent Transactions */}
          <div className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#DBE2EF] p-5 sm:px-6">
              <div>
                <h3 className="font-bold text-[#112D4E]">
                  Recent Transactions
                </h3>
                <p className="mt-1 text-xs text-[#9CA3AF]">
                  Your latest account activity
                </p>
              </div>

              <button
                type="button"
                className="flex items-center gap-1 text-xs font-semibold text-[#3F72AF] transition hover:text-[#112D4E]"
              >
                View All
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="divide-y divide-[#F1F5F9]">
              {transactions.map((transaction) => {
                const isIncoming = transaction.type === "Deposit";

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-[#F9FAFB] sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isIncoming
                            ? "bg-emerald-50 text-emerald-600"
                            : transaction.type === "Transfer"
                              ? "bg-blue-50 text-[#3F72AF]"
                              : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {isIncoming ? (
                          <ArrowDownLeft size={19} />
                        ) : transaction.type === "Transfer" ? (
                          <ArrowLeftRight size={19} />
                        ) : (
                          <ArrowUpRight size={19} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#112D4E]">
                          {transaction.title}
                        </p>
                        <p className="mt-1 text-xs text-[#9CA3AF]">
                          {transaction.date} · {transaction.category}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p
                        className={`text-sm font-bold ${
                          isIncoming ? "text-emerald-600" : "text-[#112D4E]"
                        }`}
                      >
                        {isIncoming ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${
                          transaction.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[#DBE2EF] p-4 text-center">
              <button
                type="button"
                className="text-sm font-semibold text-[#3F72AF] hover:text-[#112D4E]"
              >
                View Transaction History
              </button>
            </div>
          </div>
        </section>

        {/* Active Loans */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#112D4E]">
                Active Loans
              </h2>
              <p className="mt-1 text-sm text-[#6B7280]">
                Keep track of your loan balances and upcoming installments.
              </p>
            </div>

            <button
              type="button"
              className="hidden items-center gap-1 text-sm font-semibold text-[#3F72AF] sm:flex"
            >
              View All
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {activeLoans.map((loan) => {
              const paidAmount = loan.amount - loan.remaining;

              return (
                <div
                  key={loan.id}
                  className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                        <Landmark size={21} />
                      </div>

                      <div>
                        <h3 className="font-bold text-[#112D4E]">
                          {loan.name}
                        </h3>
                        <p className="mt-1 text-xs text-[#9CA3AF]">
                          {loan.id}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                      Active
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#9CA3AF]">Loan Amount</p>
                      <p className="mt-1 text-lg font-bold text-[#112D4E]">
                        {formatCurrency(loan.amount)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#9CA3AF]">Remaining Balance</p>
                      <p className="mt-1 text-lg font-bold text-[#112D4E]">
                        {formatCurrency(loan.remaining)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-[#6B7280]">
                        Repayment Progress
                      </span>
                      <span className="text-xs font-bold text-[#3F72AF]">
                        {loan.progress}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#DBE2EF]">
                      <div
                        className="h-full rounded-full bg-[#3F72AF]"
                        style={{ width: `${loan.progress}%` }}
                      />
                    </div>

                    <p className="mt-2 text-xs text-[#9CA3AF]">
                      {formatCurrency(paidAmount)} repaid
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col justify-between gap-3 border-t border-[#DBE2EF] pt-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs text-[#9CA3AF]">
                        Monthly Installment
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#112D4E]">
                        {formatCurrency(loan.installment)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#9CA3AF]">Next Payment</p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#112D4E]">
                        <Clock size={14} className="text-[#3F72AF]" />
                        {loan.nextDue}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Account Information */}
        <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-[#112D4E]">
                Selected Account Information
              </h2>
              <p className="mt-1 text-xs text-[#9CA3AF]">
                Details of your currently selected account
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-2.5 text-[#3F72AF]">
              <CreditCard size={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-[#9CA3AF]">Account Number</p>
              <p className="mt-1 text-sm font-semibold text-[#112D4E]">
                {selectedAccount.accountNumber}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#9CA3AF]">Account Type</p>
              <p className="mt-1 text-sm font-semibold text-[#112D4E]">
                {selectedAccount.type}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#9CA3AF]">Branch</p>
              <p className="mt-1 text-sm font-semibold text-[#112D4E]">
                {selectedAccount.branch}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#9CA3AF]">Account Status</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                <CheckCircle2 size={15} />
                {selectedAccount.status}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-bold text-[#112D4E]">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-[#6B7280]">
            Access your most-used banking services.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: "Fund Transfer",
                icon: ArrowLeftRight,
              },
              {
                label: "Deposit Request",
                icon: Plus,
              },
              {
                label: "Withdraw Request",
                icon: Banknote,
              },
              {
                label: "Apply for Loan",
                icon: BriefcaseBusiness,
              },
            ].map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.label}
                  type="button"
                  className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#DBE2EF] p-4 text-center transition hover:border-[#3F72AF] hover:bg-blue-50"
                >
                  <div className="rounded-xl bg-[#DBE2EF]/50 p-3 text-[#3F72AF]">
                    <Icon size={21} />
                  </div>

                  <span className="text-xs font-semibold text-[#112D4E] sm:text-sm">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <p className="pb-3 text-center text-xs text-[#9CA3AF]">
          Trustora Bank · Customer Portal · Illustrative demo data
        </p>
      </div>
    </div>
  );
}
