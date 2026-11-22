
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Wallet,
  Plus,
  Search,
  Eye,
  Pencil,
  Snowflake,
  CheckCircle2,
  X,
  Users,
  CircleDollarSign,
  Lock,
  Unlock,
  AlertTriangle,
  CreditCard,
  CalendarDays,
  UserRound,
  Building2,
  Save,
} from "lucide-react";

type AccountStatus = "Active" | "Frozen" | "Closed";
type AccountType = "Savings" | "Current" | "Fixed Deposit";

type BankAccount = {
  id: string;
  accountNumber: string;
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  accountType: AccountType;
  balance: number;
  currency: string;
  branch: string;
  createdAt: string;
  status: AccountStatus;
  dailyLimit: number;
};

const initialAccounts: BankAccount[] = [
  {
    id: "ACC-2026-001",
    accountNumber: "TRS-1000-4521",
    customerId: "CUS-2026-001",
    customerName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+880 1712-345678",
    accountType: "Savings",
    balance: 245000,
    currency: "BDT",
    branch: "Dhanmondi Branch",
    createdAt: "Jan 12, 2026",
    status: "Active",
    dailyLimit: 200000,
  },
  {
    id: "ACC-2026-002",
    accountNumber: "TRS-1000-7832",
    customerId: "CUS-2026-002",
    customerName: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+880 1812-456789",
    accountType: "Current",
    balance: 580000,
    currency: "BDT",
    branch: "Gulshan Branch",
    createdAt: "Feb 08, 2026",
    status: "Active",
    dailyLimit: 500000,
  },
  {
    id: "ACC-2026-003",
    accountNumber: "TRS-1000-2165",
    customerId: "CUS-2026-003",
    customerName: "Emma Williams",
    email: "emma.williams@email.com",
    phone: "+880 1912-567890",
    accountType: "Savings",
    balance: 125500,
    currency: "BDT",
    branch: "Uttara Branch",
    createdAt: "Mar 21, 2026",
    status: "Frozen",
    dailyLimit: 150000,
  },
  {
    id: "ACC-2026-004",
    accountNumber: "TRS-1000-9024",
    customerId: "CUS-2026-004",
    customerName: "David Miller",
    email: "david.miller@email.com",
    phone: "+880 1612-678901",
    accountType: "Current",
    balance: 1250000,
    currency: "BDT",
    branch: "Banani Branch",
    createdAt: "Apr 14, 2026",
    status: "Active",
    dailyLimit: 1000000,
  },
  {
    id: "ACC-2026-005",
    accountNumber: "TRS-1000-6418",
    customerId: "CUS-2026-005",
    customerName: "Olivia Brown",
    email: "olivia.brown@email.com",
    phone: "+880 1712-789012",
    accountType: "Savings",
    balance: 89000,
    currency: "BDT",
    branch: "Mirpur Branch",
    createdAt: "May 09, 2026",
    status: "Closed",
    dailyLimit: 100000,
  },
  {
    id: "ACC-2026-006",
    accountNumber: "TRS-1000-3356",
    customerId: "CUS-2026-006",
    customerName: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+880 1812-890123",
    accountType: "Fixed Deposit",
    balance: 420000,
    currency: "BDT",
    branch: "Mohakhali Branch",
    createdAt: "Jun 17, 2026",
    status: "Active",
    dailyLimit: 300000,
  },
];

type FilterStatus = "All" | AccountStatus;
type FilterType = "All" | AccountType;

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>(initialAccounts);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("All");
  const [filterType, setFilterType] = useState<FilterType>("All");
  const [selectedAccount, setSelectedAccount] =
    useState<BankAccount | null>(null);
  const [editForm, setEditForm] = useState<BankAccount | null>(null);
  const [notice, setNotice] = useState("");

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        account.customerName.toLowerCase().includes(searchValue) ||
        account.accountNumber.toLowerCase().includes(searchValue) ||
        account.customerId.toLowerCase().includes(searchValue) ||
        account.id.toLowerCase().includes(searchValue);

      const matchesStatus =
        filterStatus === "All" || account.status === filterStatus;

      const matchesType =
        filterType === "All" || account.accountType === filterType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [accounts, search, filterStatus, filterType]);

  const activeCount = accounts.filter((a) => a.status === "Active").length;
  const frozenCount = accounts.filter((a) => a.status === "Frozen").length;
  const closedCount = accounts.filter((a) => a.status === "Closed").length;

  const totalBalance = accounts
    .filter((a) => a.status !== "Closed")
    .reduce((total, account) => total + account.balance, 0);

  const showNotice = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 3000);
  };

  const updateAccount = () => {
    if (!editForm) return;

    if (editForm.dailyLimit < 0 || !Number.isFinite(editForm.dailyLimit)) {
      showNotice("Please enter a valid transaction limit.");
      return;
    }

    setAccounts((previous) =>
      previous.map((account) =>
        account.id === editForm.id ? editForm : account
      )
    );

    setSelectedAccount(editForm);
    showNotice(`Account ${editForm.accountNumber} updated successfully.`);
    setEditForm(null);
  };

  const toggleFreeze = (account: BankAccount) => {
    if (account.status === "Closed") return;

    const newStatus: AccountStatus =
      account.status === "Frozen" ? "Active" : "Frozen";

    setAccounts((previous) =>
      previous.map((item) =>
        item.id === account.id ? { ...item, status: newStatus } : item
      )
    );

    setSelectedAccount((previous) =>
      previous?.id === account.id
        ? { ...previous, status: newStatus }
        : previous
    );

    showNotice(
      `${account.accountNumber} has been ${newStatus === "Frozen" ? "frozen" : "unfrozen"}.`
    );
  };

  const getStatusStyle = (status: AccountStatus) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700";
      case "Frozen":
        return "bg-blue-50 text-blue-700";
      case "Closed":
        return "bg-rose-50 text-rose-700";
    }
  };

  const formatCurrency = (amount: number) =>
    `৳ ${amount.toLocaleString("en-BD")}`;

  const statCards = [
    {
      label: "Total Accounts",
      value: accounts.length.toString(),
      icon: Wallet,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Accounts",
      value: activeCount.toString(),
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Frozen Accounts",
      value: frozenCount.toString(),
      icon: Snowflake,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Total Account Balance",
      value: formatCurrency(totalBalance),
      icon: CircleDollarSign,
      color: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-[#3F72AF]">
              Administration / Bank Accounts
            </p>
            <h1 className="text-2xl font-bold text-[#112D4E] sm:text-3xl">
              Bank Account Management
            </h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Manage accounts, restrictions, and transaction limits.
            </p>
          </div>

          <Link
            href="/dashboard/admin/accounts/new"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4168]"
          >
            <Plus size={18} />
            Create Bank Account
          </Link>
        </div>

        {/* Notice */}
        {notice && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 size={18} />
            {notice}
          </div>
        )}

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={21} />
                </div>
                <p className="mt-4 text-sm text-[#6B7280]">{stat.label}</p>
                <h2 className="mt-1 text-2xl font-bold text-[#112D4E]">
                  {stat.value}
                </h2>
              </div>
            );
          })}
        </section>

        {/* Account Table */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          <div className="border-b border-[#DBE2EF] p-5">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div>
                <h2 className="text-lg font-bold text-[#112D4E]">
                  All Bank Accounts
                </h2>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Search, filter, and manage customer accounts.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search accounts..."
                    className="h-11 w-full rounded-xl border border-[#DBE2EF] bg-white pl-10 pr-4 text-sm text-[#112D4E] outline-none placeholder:text-[#9CA3AF] focus:border-[#3F72AF] focus:ring-2 focus:ring-[#3F72AF]/10 sm:w-56"
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(e.target.value as FilterType)
                  }
                  className="h-11 rounded-xl border border-[#DBE2EF] bg-white px-3 text-sm text-[#4B5563] outline-none focus:border-[#3F72AF]"
                >
                  <option value="All">All Account Types</option>
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                  <option value="Fixed Deposit">Fixed Deposit</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as FilterStatus)
                  }
                  className="h-11 rounded-xl border border-[#DBE2EF] bg-white px-3 text-sm text-[#4B5563] outline-none focus:border-[#3F72AF]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Frozen">Frozen</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-[#F9FAFB]">
                <tr className="text-xs uppercase tracking-wider text-[#6B7280]">
                  <th className="px-5 py-4 font-semibold">Account</th>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Account Type</th>
                  <th className="px-5 py-4 font-semibold">Balance</th>
                  <th className="px-5 py-4 font-semibold">Daily Limit</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredAccounts.map((account) => (
                  <tr
                    key={account.id}
                    className="transition hover:bg-[#F9FAFB]"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[#3F72AF]">
                        {account.accountNumber}
                      </p>
                      <p className="mt-1 text-xs text-[#9CA3AF]">
                        {account.id}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[#112D4E]">
                        {account.customerName}
                      </p>
                      <p className="mt-1 text-xs text-[#6B7280]">
                        {account.customerId}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#4B5563]">
                      {account.accountType}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#112D4E]">
                      {formatCurrency(account.balance)}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#4B5563]">
                      {formatCurrency(account.dailyLimit)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(account.status)}`}
                      >
                        {account.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedAccount(account)}
                          aria-label="View account details"
                          className="rounded-lg border border-[#DBE2EF] p-2 text-[#3F72AF] transition hover:bg-[#DBE2EF]/40"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditForm({ ...account })}
                          aria-label="Edit account"
                          className="rounded-lg border border-[#DBE2EF] p-2 text-[#3F72AF] transition hover:bg-[#DBE2EF]/40"
                        >
                          <Pencil size={16} />
                        </button>

                        {account.status !== "Closed" && (
                          <button
                            type="button"
                            onClick={() => toggleFreeze(account)}
                            aria-label={
                              account.status === "Frozen"
                                ? "Unfreeze account"
                                : "Freeze account"
                            }
                            className={`rounded-lg border p-2 transition ${
                              account.status === "Frozen"
                                ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                : "border-blue-200 text-blue-600 hover:bg-blue-50"
                            }`}
                          >
                            {account.status === "Frozen" ? (
                              <Unlock size={16} />
                            ) : (
                              <Snowflake size={16} />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredAccounts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <Wallet
                        size={30}
                        className="mx-auto mb-3 text-[#9CA3AF]"
                      />
                      <p className="font-semibold text-[#112D4E]">
                        No accounts found
                      </p>
                      <p className="mt-1 text-sm text-[#6B7280]">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#DBE2EF] px-5 py-4 text-xs text-[#9CA3AF]">
            Showing {filteredAccounts.length} of {accounts.length} illustrative accounts
          </div>
        </section>

        {/* Account Details Modal */}
        {selectedAccount && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#112D4E]/50 p-3 backdrop-blur-sm sm:p-6">
            <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#DBE2EF] p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#3F72AF]">
                    Account Information
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-[#112D4E]">
                    Account Details
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAccount(null)}
                  aria-label="Close account details"
                  className="rounded-lg p-2 text-[#6B7280] hover:bg-[#F3F4F6]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <div className="rounded-xl bg-[#F9F7F7] p-4">
                  <p className="text-xs text-[#6B7280]">Account Number</p>
                  <p className="mt-1 text-lg font-bold text-[#112D4E]">
                    {selectedAccount.accountNumber}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">
                      {selectedAccount.accountType}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(selectedAccount.status)}`}
                    >
                      {selectedAccount.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <DetailItem
                    icon={UserRound}
                    label="Customer"
                    value={selectedAccount.customerName}
                  />
                  <DetailItem
                    icon={Users}
                    label="Customer ID"
                    value={selectedAccount.customerId}
                  />
                  <DetailItem
                    icon={CreditCard}
                    label="Account ID"
                    value={selectedAccount.id}
                  />
                  <DetailItem
                    icon={Building2}
                    label="Branch"
                    value={selectedAccount.branch}
                  />
                  <DetailItem
                    icon={CircleDollarSign}
                    label="Current Balance"
                    value={formatCurrency(selectedAccount.balance)}
                  />
                  <DetailItem
                    icon={Lock}
                    label="Daily Transaction Limit"
                    value={formatCurrency(selectedAccount.dailyLimit)}
                  />
                  <DetailItem
                    icon={CalendarDays}
                    label="Opening Date"
                    value={selectedAccount.createdAt}
                  />
                </div>

                {selectedAccount.status !== "Closed" && (
                  <button
                    type="button"
                    onClick={() => toggleFreeze(selectedAccount)}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      selectedAccount.status === "Frozen"
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {selectedAccount.status === "Frozen" ? (
                      <>
                        <Unlock size={17} />
                        Unfreeze Account
                      </>
                    ) : (
                      <>
                        <Snowflake size={17} />
                        Freeze Account
                      </>
                    )}
                  </button>
                )}

                <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                  Account actions are demo-only and do not affect real bank accounts.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Account Modal */}
        {editForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#112D4E]/50 p-3 backdrop-blur-sm sm:p-6">
            <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#DBE2EF] p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#3F72AF]">
                    Account Administration
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-[#112D4E]">
                    Update Account
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setEditForm(null)}
                  aria-label="Close edit account form"
                  className="rounded-lg p-2 text-[#6B7280] hover:bg-[#F3F4F6]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                    Account Number
                  </label>
                  <input
                    value={editForm.accountNumber}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        accountNumber: e.target.value,
                      })
                    }
                    className="h-11 w-full rounded-xl border border-[#DBE2EF] px-4 text-sm outline-none focus:border-[#3F72AF]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                    Account Type
                  </label>
                  <select
                    value={editForm.accountType}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        accountType: e.target.value as AccountType,
                      })
                    }
                    className="h-11 w-full rounded-xl border border-[#DBE2EF] bg-white px-4 text-sm outline-none focus:border-[#3F72AF]"
                  >
                    <option value="Savings">Savings</option>
                    <option value="Current">Current</option>
                    <option value="Fixed Deposit">Fixed Deposit</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                    Branch
                  </label>
                  <input
                    value={editForm.branch}
                    onChange={(e) =>
                      setEditForm({ ...editForm, branch: e.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-[#DBE2EF] px-4 text-sm outline-none focus:border-[#3F72AF]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                    Daily Transaction Limit (BDT)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.dailyLimit}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        dailyLimit: Number(e.target.value),
                      })
                    }
                    className="h-11 w-full rounded-xl border border-[#DBE2EF] px-4 text-sm outline-none focus:border-[#3F72AF]"
                  />
                  <p className="mt-2 text-xs text-[#9CA3AF]">
                    Set the maximum allowed transaction amount per day.
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setEditForm(null)}
                    className="flex-1 rounded-xl border border-[#DBE2EF] px-4 py-3 text-sm font-semibold text-[#4B5563] hover:bg-[#F9F7F7]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={updateAccount}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1D4168]"
                  >
                    <Save size={17} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#DBE2EF]/50 text-[#3F72AF]">
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[#6B7280]">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-[#112D4E]">
          {value}
        </p>
      </div>
    </div>
  );
}
