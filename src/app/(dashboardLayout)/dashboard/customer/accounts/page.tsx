"use client";

import { useMemo, useState } from "react";
import {
  Wallet,
  Search,
  ChevronDown,
  ChevronRight,
  Eye,
  Download,
  FileText,
  Building2,
  CheckCircle2,
  AlertCircle,
  Snowflake,
  CreditCard,
  X,
  CalendarDays,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Printer,
} from "lucide-react";

type Account = {
  id: string;
  accountNumber: string;
  type: "Savings" | "Current" | "Business";
  balance: number;
  status: "Active" | "Frozen";
  branch: string;
  openedDate: string;
  currency: string;
  accountHolder: string;
  interestRate: number;
  dailyLimit: number;
};

type AccountTransaction = {
  id: string;
  title: string;
  date: string;
  type: "Deposit" | "Withdrawal" | "Transfer";
  amount: number;
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
    openedDate: "12 Jan 2024",
    currency: "BDT",
    accountHolder: "Sarah Johnson",
    interestRate: 4.5,
    dailyLimit: 200000,
  },
  {
    id: "2",
    accountNumber: "TRS-1000-7832",
    type: "Current",
    balance: 580000,
    status: "Active",
    branch: "Gulshan Branch",
    openedDate: "08 Mar 2024",
    currency: "BDT",
    accountHolder: "Sarah Johnson",
    interestRate: 0,
    dailyLimit: 500000,
  },
  {
    id: "3",
    accountNumber: "TRS-1000-2165",
    type: "Business",
    balance: 125500,
    status: "Active",
    branch: "Uttara Branch",
    openedDate: "19 Aug 2025",
    currency: "BDT",
    accountHolder: "Sarah Johnson",
    interestRate: 2.5,
    dailyLimit: 300000,
  },
];

const accountTransactions: AccountTransaction[] = [
  {
    id: "TRX-2026-00125",
    title: "Salary Deposit",
    date: "22 Nov 2026",
    type: "Deposit",
    amount: 65000,
    status: "Completed",
  },
  {
    id: "TRX-2026-00124",
    title: "Online Shopping",
    date: "21 Nov 2026",
    type: "Withdrawal",
    amount: 4500,
    status: "Completed",
  },
  {
    id: "TRX-2026-00123",
    title: "Transfer to Michael",
    date: "20 Nov 2026",
    type: "Transfer",
    amount: 12000,
    status: "Completed",
  },
  {
    id: "TRX-2026-00122",
    title: "Cash Deposit",
    date: "18 Nov 2026",
    type: "Deposit",
    amount: 20000,
    status: "Pending",
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

export default function CustomerAccountsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const totalBalance = accounts.reduce(
    (total, account) => total + account.balance,
    0
  );

  const activeAccounts = accounts.filter(
    (account) => account.status === "Active"
  ).length;

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const matchesSearch =
        account.accountNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        account.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        typeFilter === "All" || account.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" || account.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, typeFilter, statusFilter]);

  const downloadCSV = (account: Account) => {
    const rows = [
      ["Account Statement"],
      ["Account Holder", account.accountHolder],
      ["Account Number", account.accountNumber],
      ["Account Type", account.type],
      ["Branch", account.branch],
      ["Current Balance", account.balance.toString()],
      [],
      ["Transaction ID", "Description", "Date", "Type", "Amount", "Status"],
      ...accountTransactions.map((transaction) => [
        transaction.id,
        transaction.title,
        transaction.date,
        transaction.type,
        transaction.amount.toString(),
        transaction.status,
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${account.accountNumber}-statement.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-[#3F72AF]">
              Customer Portal / My Accounts
            </p>

            <h1 className="text-2xl font-bold text-[#112D4E] sm:text-3xl">
              My Bank Accounts
            </h1>

            <p className="mt-2 text-sm text-[#6B7280]">
              View and manage your bank accounts and account information.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#DBE2EF] bg-white px-4 py-3 text-sm text-[#6B7280]">
            <CalendarDays size={17} className="text-[#3F72AF]" />
            November 22, 2026
          </div>
        </div>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                <Wallet size={22} />
              </div>
              <span className="text-xs font-medium text-[#9CA3AF]">
                All accounts
              </span>
            </div>

            <p className="mt-5 text-sm text-[#6B7280]">
              Total Account Balance
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#112D4E]">
              {formatCurrency(totalBalance)}
            </h2>
            <p className="mt-2 text-xs text-[#9CA3AF]">
              Combined balance across your accounts
            </p>
          </div>

          <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 size={22} />
              </div>
              <span className="text-xs font-medium text-[#9CA3AF]">
                Available
              </span>
            </div>

            <p className="mt-5 text-sm text-[#6B7280]">Active Accounts</p>
            <h2 className="mt-1 text-2xl font-bold text-[#112D4E]">
              {activeAccounts}
            </h2>
            <p className="mt-2 text-xs text-[#9CA3AF]">
              Accounts currently available
            </p>
          </div>

          <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <CreditCard size={22} />
              </div>
              <span className="text-xs font-medium text-[#9CA3AF]">
                Portfolio
              </span>
            </div>

            <p className="mt-5 text-sm text-[#6B7280]">Total Accounts</p>
            <h2 className="mt-1 text-2xl font-bold text-[#112D4E]">
              {accounts.length}
            </h2>
            <p className="mt-2 text-xs text-[#9CA3AF]">
              Savings, current and business
            </p>
          </div>
        </section>

        {/* Account List */}
        <section className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-[#112D4E]">
              Your Accounts
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Select an account to view its details and statement.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-3 rounded-2xl border border-[#DBE2EF] bg-white p-4 shadow-sm lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search account number, type or branch..."
                className="w-full rounded-xl border border-[#DBE2EF] bg-white py-3 pl-10 pr-4 text-sm text-[#112D4E] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#3F72AF] focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Filter
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#DBE2EF] bg-white py-3 pl-9 pr-9 text-sm text-[#4B5563] outline-none focus:border-[#3F72AF] sm:w-40"
                >
                  <option value="All">All Types</option>
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                  <option value="Business">Business</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#DBE2EF] bg-white px-4 py-3 pr-9 text-sm text-[#4B5563] outline-none focus:border-[#3F72AF] sm:w-40"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Frozen">Frozen</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
              </div>
            </div>
          </div>

          {/* Account Cards */}
          {filteredAccounts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {filteredAccounts.map((account) => (
                <div
                  key={account.id}
                  className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="bg-gradient-to-r from-[#112D4E] to-[#3F72AF] p-5 text-white sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white/15 p-3">
                          {account.type === "Savings" ? (
                            <PiggyBankIcon />
                          ) : account.type === "Current" ? (
                            <Wallet size={22} />
                          ) : (
                            <Building2 size={22} />
                          )}
                        </div>

                        <div>
                          <p className="text-xs text-blue-100">
                            {account.type} Account
                          </p>
                          <h3 className="mt-1 font-bold tracking-wide">
                            {account.accountNumber}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          account.status === "Active"
                            ? "bg-emerald-400/20 text-emerald-100"
                            : "bg-amber-400/20 text-amber-100"
                        }`}
                      >
                        {account.status === "Active" ? (
                          <CheckCircle2 size={13} />
                        ) : (
                          <Snowflake size={13} />
                        )}
                        {account.status}
                      </span>
                    </div>

                    <div className="mt-7">
                      <p className="text-xs text-blue-100">
                        Available Balance
                      </p>
                      <p className="mt-1 text-3xl font-bold">
                        {formatCurrency(account.balance)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 p-5 sm:p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#9CA3AF]">Branch</p>
                        <p className="mt-1 text-sm font-semibold text-[#112D4E]">
                          {account.branch}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#9CA3AF]">Opened Date</p>
                        <p className="mt-1 text-sm font-semibold text-[#112D4E]">
                          {account.openedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-[#DBE2EF] pt-4 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setSelectedAccount(account)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4168]"
                      >
                        <Eye size={16} />
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadCSV(account)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#DBE2EF] px-4 py-3 text-sm font-semibold text-[#3F72AF] transition hover:bg-blue-50"
                      >
                        <Download size={16} />
                        Statement CSV
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#DBE2EF] bg-white px-5 py-14 text-center">
              <Search size={32} className="mx-auto text-[#9CA3AF]" />
              <h3 className="mt-3 font-semibold text-[#112D4E]">
                No accounts found
              </h3>
              <p className="mt-1 text-sm text-[#6B7280]">
                Try changing your search or filter options.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("All");
                  setStatusFilter("All");
                }}
                className="mt-4 text-sm font-semibold text-[#3F72AF] hover:text-[#112D4E]"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Account Details Modal */}
        {selectedAccount && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#112D4E]/50 p-4"
            onClick={() => setSelectedAccount(null)}
          >
            <div
              className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#DBE2EF] p-5 sm:p-6">
                <div>
                  <h2 className="text-lg font-bold text-[#112D4E]">
                    Account Details
                  </h2>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Complete information about your account
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedAccount(null)}
                  aria-label="Close account details"
                  className="rounded-lg p-2 text-[#6B7280] transition hover:bg-gray-100 hover:text-[#112D4E]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[75vh] space-y-6 overflow-y-auto p-5 sm:p-6">
                <div className="rounded-xl bg-gradient-to-r from-[#112D4E] to-[#3F72AF] p-5 text-white">
                  <p className="text-sm text-blue-100">
                    {selectedAccount.type} Account
                  </p>
                  <p className="mt-2 text-xl font-bold tracking-wider">
                    {selectedAccount.accountNumber}
                  </p>
                  <p className="mt-5 text-xs text-blue-100">
                    Available Balance
                  </p>
                  <p className="mt-1 text-3xl font-bold">
                    {formatCurrency(selectedAccount.balance)}
                  </p>
                </div>

                <div>
                  <h3 className="mb-4 font-bold text-[#112D4E]">
                    Account Information
                  </h3>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <DetailItem
                      label="Account Holder"
                      value={selectedAccount.accountHolder}
                    />
                    <DetailItem
                      label="Account Number"
                      value={selectedAccount.accountNumber}
                    />
                    <DetailItem
                      label="Account Type"
                      value={selectedAccount.type}
                    />
                    <DetailItem
                      label="Branch"
                      value={selectedAccount.branch}
                    />
                    <DetailItem
                      label="Opening Date"
                      value={selectedAccount.openedDate}
                    />
                    <DetailItem
                      label="Currency"
                      value={selectedAccount.currency}
                    />
                    <DetailItem
                      label="Interest Rate"
                      value={`${selectedAccount.interestRate}%`}
                    />
                    <DetailItem
                      label="Daily Transaction Limit"
                      value={formatCurrency(selectedAccount.dailyLimit)}
                    />
                  </div>

                  <div className="mt-5">
                    <p className="text-xs text-[#9CA3AF]">Account Status</p>
                    <span
                      className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
                        selectedAccount.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {selectedAccount.status === "Active" ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <AlertCircle size={14} />
                      )}
                      {selectedAccount.status}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#DBE2EF] pt-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#112D4E]">
                        Recent Transactions
                      </h3>
                      <p className="mt-1 text-xs text-[#9CA3AF]">
                        Illustrative account activity
                      </p>
                    </div>
                    <FileText size={20} className="text-[#3F72AF]" />
                  </div>

                  <div className="space-y-3">
                    {accountTransactions.slice(0, 4).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between gap-3 rounded-xl bg-[#F9F7F7] p-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={`rounded-lg p-2 ${
                              transaction.type === "Deposit"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            {transaction.type === "Deposit" ? (
                              <ArrowDownLeft size={17} />
                            ) : (
                              <ArrowUpRight size={17} />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#112D4E]">
                              {transaction.title}
                            </p>
                            <p className="mt-1 text-xs text-[#9CA3AF]">
                              {transaction.date}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p
                            className={`text-sm font-bold ${
                              transaction.type === "Deposit"
                                ? "text-emerald-600"
                                : "text-[#112D4E]"
                            }`}
                          >
                            {transaction.type === "Deposit" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </p>
                          <p className="mt-1 text-[10px] text-[#9CA3AF]">
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-[#DBE2EF] p-5 sm:flex-row sm:justify-end sm:p-6">
                <button
                  type="button"
                  onClick={() => downloadCSV(selectedAccount)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#DBE2EF] px-4 py-3 text-sm font-semibold text-[#3F72AF] transition hover:bg-blue-50"
                >
                  <Download size={16} />
                  Download CSV
                </button>

                <button
                  type="button"
                  onClick={downloadPDF}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4168]"
                >
                  <Printer size={16} />
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="pb-3 text-center text-xs text-[#9CA3AF]">
          Trustora Bank · Customer Portal · Illustrative demo data
        </p>
      </div>
    </div>
  );
}

function PiggyBankIcon() {
  return <Wallet size={22} />;
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-[#9CA3AF]">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-[#112D4E]">
        {value}
      </p>
    </div>
  );
}