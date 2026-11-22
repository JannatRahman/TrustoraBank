
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  ShieldAlert,
  Eye,
  X,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  CreditCard,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Wallet,
} from "lucide-react";

type CustomerStatus = "Active" | "Inactive" | "Blocked";

type Transaction = {
  id: string;
  type: "Deposit" | "Withdrawal" | "Transfer";
  amount: string;
  date: string;
  status: "Completed" | "Pending" | "Failed";
};

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountNumber: string;
  accountType: string;
  balance: string;
  address: string;
  dateJoined: string;
  status: CustomerStatus;
  transactions: Transaction[];
};

const initialCustomers: Customer[] = [
  {
    id: "CUS-2026-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+880 1712-345678",
    accountNumber: "**** **** 4521",
    accountType: "Savings",
    balance: "৳ 245,000",
    address: "Dhanmondi, Dhaka, Bangladesh",
    dateJoined: "Jan 12, 2026",
    status: "Active",
    transactions: [
      { id: "TXN-0148", type: "Deposit", amount: "৳ 45,000", date: "Nov 22, 2026", status: "Completed" },
      { id: "TXN-0132", type: "Withdrawal", amount: "৳ 12,000", date: "Nov 18, 2026", status: "Completed" },
      { id: "TXN-0115", type: "Transfer", amount: "৳ 28,000", date: "Nov 15, 2026", status: "Completed" },
    ],
  },
  {
    id: "CUS-2026-002",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+880 1812-456789",
    accountNumber: "**** **** 7832",
    accountType: "Current",
    balance: "৳ 580,000",
    address: "Gulshan, Dhaka, Bangladesh",
    dateJoined: "Feb 08, 2026",
    status: "Active",
    transactions: [
      { id: "TXN-0147", type: "Withdrawal", amount: "৳ 12,500", date: "Nov 22, 2026", status: "Completed" },
      { id: "TXN-0138", type: "Deposit", amount: "৳ 80,000", date: "Nov 19, 2026", status: "Completed" },
    ],
  },
  {
    id: "CUS-2026-003",
    name: "Emma Williams",
    email: "emma.williams@email.com",
    phone: "+880 1912-567890",
    accountNumber: "**** **** 2165",
    accountType: "Savings",
    balance: "৳ 125,500",
    address: "Uttara, Dhaka, Bangladesh",
    dateJoined: "Mar 21, 2026",
    status: "Inactive",
    transactions: [
      { id: "TXN-0146", type: "Transfer", amount: "৳ 28,000", date: "Nov 21, 2026", status: "Pending" },
      { id: "TXN-0102", type: "Deposit", amount: "৳ 35,000", date: "Nov 10, 2026", status: "Completed" },
    ],
  },
  {
    id: "CUS-2026-004",
    name: "David Miller",
    email: "david.miller@email.com",
    phone: "+880 1612-678901",
    accountNumber: "**** **** 9024",
    accountType: "Business",
    balance: "৳ 1,250,000",
    address: "Banani, Dhaka, Bangladesh",
    dateJoined: "Apr 14, 2026",
    status: "Active",
    transactions: [
      { id: "TXN-0145", type: "Deposit", amount: "৳ 75,000", date: "Nov 21, 2026", status: "Completed" },
      { id: "TXN-0130", type: "Transfer", amount: "৳ 150,000", date: "Nov 17, 2026", status: "Completed" },
    ],
  },
  {
    id: "CUS-2026-005",
    name: "Olivia Brown",
    email: "olivia.brown@email.com",
    phone: "+880 1712-789012",
    accountNumber: "**** **** 6418",
    accountType: "Savings",
    balance: "৳ 89,000",
    address: "Mirpur, Dhaka, Bangladesh",
    dateJoined: "May 09, 2026",
    status: "Blocked",
    transactions: [
      { id: "TXN-0144", type: "Withdrawal", amount: "৳ 8,000", date: "Nov 20, 2026", status: "Failed" },
      { id: "TXN-0124", type: "Transfer", amount: "৳ 40,000", date: "Nov 12, 2026", status: "Completed" },
    ],
  },
  {
    id: "CUS-2026-006",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+880 1812-890123",
    accountNumber: "**** **** 3356",
    accountType: "Current",
    balance: "৳ 420,000",
    address: "Mohakhali, Dhaka, Bangladesh",
    dateJoined: "Jun 17, 2026",
    status: "Active",
    transactions: [
      { id: "TXN-0143", type: "Deposit", amount: "৳ 55,000", date: "Nov 20, 2026", status: "Completed" },
      { id: "TXN-0135", type: "Withdrawal", amount: "৳ 15,000", date: "Nov 16, 2026", status: "Completed" },
    ],
  },
];

type FilterStatus = "All" | CustomerStatus;

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("All");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [notice, setNotice] = useState("");

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        customer.name.toLowerCase().includes(searchValue) ||
        customer.email.toLowerCase().includes(searchValue) ||
        customer.id.toLowerCase().includes(searchValue) ||
        customer.accountNumber.toLowerCase().includes(searchValue);

      const matchesStatus =
        filterStatus === "All" || customer.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, filterStatus]);

  const activeCount = customers.filter((c) => c.status === "Active").length;
  const inactiveCount = customers.filter((c) => c.status === "Inactive").length;
  const blockedCount = customers.filter((c) => c.status === "Blocked").length;

  const updateCustomerStatus = (
    customerId: string,
    status: CustomerStatus
  ) => {
    setCustomers((previous) =>
      previous.map((customer) =>
        customer.id === customerId ? { ...customer, status } : customer
      )
    );

    setSelectedCustomer((previous) =>
      previous?.id === customerId ? { ...previous, status } : previous
    );

    const customer = customers.find((c) => c.id === customerId);

    setNotice(
      `${customer?.name ?? "Customer"} account status changed to ${status}.`
    );

    setTimeout(() => setNotice(""), 3000);
  };

  const statCards = [
    {
      label: "Total Customers",
      value: customers.length.toLocaleString(),
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Accounts",
      value: activeCount.toString(),
      icon: UserCheck,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Inactive Accounts",
      value: inactiveCount.toString(),
      icon: UserX,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Blocked Accounts",
      value: blockedCount.toString(),
      icon: ShieldAlert,
      color: "bg-rose-50 text-rose-600",
    },
  ];

  const getStatusStyle = (status: CustomerStatus) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700";
      case "Inactive":
        return "bg-amber-50 text-amber-700";
      case "Blocked":
        return "bg-rose-50 text-rose-700";
    }
  };

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "Deposit":
        return ArrowDownToLine;
      case "Withdrawal":
        return ArrowUpFromLine;
      case "Transfer":
        return ArrowLeftRight;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-7">

        {/* Header */}
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-[#3F72AF]">
            Administration / Customers
          </p>
          <h1 className="text-2xl font-bold text-[#112D4E] sm:text-3xl">
            Customer Management
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Manage customer accounts, access, and transaction history.
          </p>
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

        {/* Customer Table */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          <div className="border-b border-[#DBE2EF] p-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-lg font-bold text-[#112D4E]">
                  All Customers
                </h2>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Search and manage registered bank customers.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search customers..."
                    className="h-11 w-full rounded-xl border border-[#DBE2EF] bg-white pl-10 pr-4 text-sm text-[#112D4E] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#3F72AF] focus:ring-2 focus:ring-[#3F72AF]/10 sm:w-64"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as FilterStatus)
                  }
                  className="h-11 rounded-xl border border-[#DBE2EF] bg-white px-4 text-sm text-[#4B5563] outline-none focus:border-[#3F72AF]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-[#F9FAFB]">
                <tr className="text-xs uppercase tracking-wider text-[#6B7280]">
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Customer ID</th>
                  <th className="px-5 py-4 font-semibold">Account</th>
                  <th className="px-5 py-4 font-semibold">Balance</th>
                  <th className="px-5 py-4 font-semibold">Joined</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="transition hover:bg-[#F9FAFB]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DBE2EF] text-sm font-bold text-[#112D4E]">
                          {customer.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#112D4E]">
                            {customer.name}
                          </p>
                          <p className="mt-0.5 text-xs text-[#6B7280]">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-[#3F72AF]">
                      {customer.id}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#112D4E]">
                        {customer.accountNumber}
                      </p>
                      <p className="mt-0.5 text-xs text-[#6B7280]">
                        {customer.accountType}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#112D4E]">
                      {customer.balance}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#6B7280]">
                      {customer.dateJoined}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(customer.status)}`}
                      >
                        {customer.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedCustomer(customer)}
                        className="flex items-center gap-2 rounded-lg border border-[#DBE2EF] px-3 py-2 text-xs font-semibold text-[#3F72AF] transition hover:bg-[#DBE2EF]/40"
                      >
                        <Eye size={15} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <Users
                        size={30}
                        className="mx-auto mb-3 text-[#9CA3AF]"
                      />
                      <p className="font-semibold text-[#112D4E]">
                        No customers found
                      </p>
                      <p className="mt-1 text-sm text-[#6B7280]">
                        Try changing your search or filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#DBE2EF] px-5 py-4 text-xs text-[#9CA3AF]">
            Showing {filteredCustomers.length} of {customers.length} illustrative customers
          </div>
        </section>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#112D4E]/50 p-3 backdrop-blur-sm sm:p-6">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#DBE2EF] p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#3F72AF]">
                  Customer Information
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#112D4E]">
                  Customer Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                aria-label="Close customer details"
                className="rounded-lg p-2 text-[#6B7280] transition hover:bg-[#F3F4F6]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-5">
              {/* Customer Profile */}
              <div className="flex flex-col gap-4 rounded-xl bg-[#F9F7F7] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DBE2EF] text-lg font-bold text-[#112D4E]">
                    {selectedCustomer.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>

                  <div>
                    <h3 className="font-bold text-[#112D4E]">
                      {selectedCustomer.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#6B7280]">
                      {selectedCustomer.id}
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(selectedCustomer.status)}`}
                    >
                      {selectedCustomer.status}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#6B7280]">Account Balance</p>
                  <p className="mt-1 text-xl font-bold text-[#112D4E]">
                    {selectedCustomer.balance}
                  </p>
                </div>
              </div>

              {/* Information */}
              <div className="mt-6">
                <h3 className="mb-4 font-bold text-[#112D4E]">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem
                    icon={Mail}
                    label="Email Address"
                    value={selectedCustomer.email}
                  />
                  <InfoItem
                    icon={Phone}
                    label="Phone Number"
                    value={selectedCustomer.phone}
                  />
                  <InfoItem
                    icon={MapPin}
                    label="Address"
                    value={selectedCustomer.address}
                  />
                  <InfoItem
                    icon={CalendarDays}
                    label="Registration Date"
                    value={selectedCustomer.dateJoined}
                  />
                </div>
              </div>

              {/* Account Information */}
              <div className="mt-7">
                <h3 className="mb-4 font-bold text-[#112D4E]">
                  Bank Account Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem
                    icon={CreditCard}
                    label="Account Number"
                    value={selectedCustomer.accountNumber}
                  />
                  <InfoItem
                    icon={Wallet}
                    label="Account Type"
                    value={selectedCustomer.accountType}
                  />
                </div>
              </div>

              {/* Transaction History */}
              <div className="mt-7">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-[#112D4E]">
                    Transaction History
                  </h3>
                  <span className="text-xs text-[#6B7280]">
                    {selectedCustomer.transactions.length} transactions
                  </span>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#DBE2EF]">
                  {selectedCustomer.transactions.map((transaction, index) => {
                    const Icon = getTransactionIcon(transaction.type);

                    return (
                      <div
                        key={transaction.id}
                        className={`flex items-center justify-between gap-3 p-4 ${
                          index !== selectedCustomer.transactions.length - 1
                            ? "border-b border-[#DBE2EF]"
                            : ""
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DBE2EF]/50 text-[#3F72AF]">
                            <Icon size={19} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#112D4E]">
                              {transaction.type}
                            </p>
                            <p className="mt-1 text-xs text-[#6B7280]">
                              {transaction.id} · {transaction.date}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-bold text-[#112D4E]">
                            {transaction.amount}
                          </p>
                          <p
                            className={`mt-1 text-xs ${
                              transaction.status === "Completed"
                                ? "text-emerald-600"
                                : transaction.status === "Pending"
                                  ? "text-amber-600"
                                  : "text-rose-600"
                            }`}
                          >
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="border-t border-[#DBE2EF] bg-[#F9FAFB] p-5">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                <ShieldAlert size={15} />
                Administrative Actions
              </div>

              {selectedCustomer.status === "Blocked" ? (
                <button
                  type="button"
                  onClick={() =>
                    updateCustomerStatus(selectedCustomer.id, "Active")
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
                >
                  <CheckCircle2 size={17} />
                  Unblock Account
                </button>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      updateCustomerStatus(
                        selectedCustomer.id,
                        selectedCustomer.status === "Active"
                          ? "Inactive"
                          : "Active"
                      )
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#DBE2EF] bg-white px-4 py-3 text-sm font-semibold text-[#112D4E] transition hover:bg-[#DBE2EF]/40"
                  >
                    {selectedCustomer.status === "Active" ? (
                      <>
                        <UserX size={17} />
                        Deactivate Account
                      </>
                    ) : (
                      <>
                        <UserCheck size={17} />
                        Activate Account
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateCustomerStatus(selectedCustomer.id, "Blocked")
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                  >
                    <Ban size={17} />
                    Block Account
                  </button>
                </div>
              )}

              <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
                <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                These actions only update the local demo interface. Actual account restrictions must be enforced by the backend.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({
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
