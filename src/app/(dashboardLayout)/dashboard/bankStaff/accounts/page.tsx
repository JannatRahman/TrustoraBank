
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Wallet,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";

type AccountStatus = "Active" | "Pending" | "Closed";
type AccountType = "Savings" | "Current" | "Fixed Deposit";

type BankAccount = {
  id: string;
  accountNumber: string;
  customerName: string;
  customerId: string;
  accountType: AccountType;
  balance: string;
  currency: string;
  openedDate: string;
  status: AccountStatus;
};

const accounts: BankAccount[] = [
  {
    id: "ACC-1001",
    accountNumber: "100045678921",
    customerName: "Sarah Johnson",
    customerId: "CUS-1001",
    accountType: "Savings",
    balance: "12,500.00",
    currency: "USD",
    openedDate: "Nov 18, 2026",
    status: "Active",
  },
  {
    id: "ACC-1002",
    accountNumber: "100045678922",
    customerName: "Michael Chen",
    customerId: "CUS-1002",
    accountType: "Current",
    balance: "25,800.00",
    currency: "USD",
    openedDate: "Nov 17, 2026",
    status: "Pending",
  },
  {
    id: "ACC-1003",
    accountNumber: "100045678923",
    customerName: "Emma Williams",
    customerId: "CUS-1003",
    accountType: "Savings",
    balance: "8,750.00",
    currency: "USD",
    openedDate: "Nov 16, 2026",
    status: "Active",
  },
  {
    id: "ACC-1004",
    accountNumber: "100045678924",
    customerName: "David Miller",
    customerId: "CUS-1004",
    accountType: "Fixed Deposit",
    balance: "50,000.00",
    currency: "USD",
    openedDate: "Nov 15, 2026",
    status: "Active",
  },
  {
    id: "ACC-1005",
    accountNumber: "100045678925",
    customerName: "Olivia Brown",
    customerId: "CUS-1005",
    accountType: "Savings",
    balance: "4,200.00",
    currency: "USD",
    openedDate: "Nov 14, 2026",
    status: "Pending",
  },
  {
    id: "ACC-1006",
    accountNumber: "100045678926",
    customerName: "James Wilson",
    customerId: "CUS-1006",
    accountType: "Current",
    balance: "0.00",
    currency: "USD",
    openedDate: "Nov 12, 2026",
    status: "Closed",
  },
];

const statusStyles: Record<AccountStatus, string> = {
  Active: "bg-green-50 text-green-700",
  Pending: "bg-amber-50 text-amber-700",
  Closed: "bg-gray-100 text-gray-600",
};

export default function BankAccountsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        account.customerName.toLowerCase().includes(searchValue) ||
        account.accountNumber.includes(searchValue) ||
        account.customerId.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || account.status === statusFilter;

      const matchesType =
        typeFilter === "All" || account.accountType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, statusFilter, typeFilter]);

  const activeCount = accounts.filter(
    (account) => account.status === "Active"
  ).length;

  const pendingCount = accounts.filter(
    (account) => account.status === "Pending"
  ).length;

  const closedCount = accounts.filter(
    (account) => account.status === "Closed"
  ).length;

  return (
    <div className="min-h-screen bg-[#F9F7F7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-[#3F72AF]">
              BANKING STAFF / ACCOUNTS
            </p>

            <h1 className="mt-2 text-2xl font-bold text-[#112D4E] sm:text-3xl">
              Bank Accounts
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              View and manage customer bank account information.
            </p>
          </div>

          <Link
            href="/dashboard/bankStaff/accounts/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#172554] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#112D4E]"
          >
            <Plus size={18} />
            Create Bank Account
          </Link>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Accounts"
            value={accounts.length.toString()}
            description="All registered accounts"
            icon={<Wallet size={21} />}
          />

          <StatCard
            title="Active Accounts"
            value={activeCount.toString()}
            description="Currently active"
            icon={<CheckCircle2 size={21} />}
          />

          <StatCard
            title="Pending Accounts"
            value={pendingCount.toString()}
            description="Awaiting processing"
            icon={<Clock size={21} />}
          />

          <StatCard
            title="Closed Accounts"
            value={closedCount.toString()}
            description="Previously closed"
            icon={<XCircle size={21} />}
          />
        </div>

        {/* ACCOUNTS TABLE */}
        <div className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">

          {/* TABLE HEADER */}
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#112D4E]">
                All Bank Accounts
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Search and review customer account records.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* SEARCH */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search accounts..."
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#3F72AF] sm:w-64"
                />
              </div>

              {/* STATUS FILTER */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-600 outline-none focus:border-[#3F72AF] sm:w-40"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed">Closed</option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              {/* ACCOUNT TYPE FILTER */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-600 outline-none focus:border-[#3F72AF] sm:w-44"
                >
                  <option value="All">All Types</option>
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                  <option value="Fixed Deposit">Fixed Deposit</option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-[#F9F7F7] text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Account Number</th>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Account Type</th>
                  <th className="px-5 py-4 font-semibold">Balance</th>
                  <th className="px-5 py-4 font-semibold">Opened Date</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredAccounts.map((account) => (
                  <tr
                    key={account.id}
                    className="transition hover:bg-[#F9F7F7]/70"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#112D4E]">
                        {account.accountNumber}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {account.id}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#112D4E]">
                        {account.customerName}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {account.customerId}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {account.accountType}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#112D4E]">
                        {account.currency} {account.balance}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {account.openedDate}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[account.status]}`}
                      >
                        {account.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        title="View account"
                        className="rounded-lg border border-gray-200 p-2 text-[#3F72AF] transition hover:bg-[#DBE2EF]/50"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredAccounts.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-gray-500"
                    >
                      No accounts found. Try another search or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {filteredAccounts.length} of {accounts.length} accounts
            </p>

            <div className="flex items-center gap-2 text-xs text-[#3F72AF]">
              <ArrowUpRight size={15} />
              Account records overview
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Prototype interface — all account records and balances shown are illustrative mock data.
        </p>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>

        <div className="rounded-xl bg-[#DBE2EF]/50 p-2.5 text-[#3F72AF]">
          {icon}
        </div>
      </div>

      <h3 className="mt-4 text-3xl font-bold text-[#112D4E]">
        {value}
      </h3>

      <p className="mt-1 text-xs text-gray-400">{description}</p>
    </div>
  );
}
