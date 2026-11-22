
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Wallet,
  UserRound,
  Mail,
  Phone,
  Building2,
  CreditCard,
  CircleDollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Copy,
} from "lucide-react";

const customers = [
  {
    id: "CUS-2026-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+880 1712-345678",
  },
  {
    id: "CUS-2026-002",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+880 1812-456789",
  },
  {
    id: "CUS-2026-003",
    name: "Emma Williams",
    email: "emma.williams@email.com",
    phone: "+880 1912-567890",
  },
  {
    id: "CUS-2026-004",
    name: "David Miller",
    email: "david.miller@email.com",
    phone: "+880 1612-678901",
  },
  {
    id: "CUS-2026-005",
    name: "Olivia Brown",
    email: "olivia.brown@email.com",
    phone: "+880 1712-789012",
  },
  {
    id: "CUS-2026-006",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+880 1812-890123",
  },
];

const branches = [
  "Dhanmondi Branch",
  "Gulshan Branch",
  "Uttara Branch",
  "Banani Branch",
  "Mirpur Branch",
  "Mohakhali Branch",
];

type AccountType = "Savings" | "Current" | "Fixed Deposit";

export default function CreateAdminBankAccountPage() {
  const [customerId, setCustomerId] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("Savings");
  const [initialDeposit, setInitialDeposit] = useState("5000");
  const [branch, setBranch] = useState("");
  const [dailyLimit, setDailyLimit] = useState("200000");
  const [currency, setCurrency] = useState("BDT");
  const [success, setSuccess] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCustomer = customers.find(
    (customer) => customer.id === customerId
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!customerId) {
      newErrors.customerId = "Please select a customer.";
    }

    if (!initialDeposit || Number(initialDeposit) < 0) {
      newErrors.initialDeposit = "Enter a valid initial deposit.";
    }

    if (!branch) {
      newErrors.branch = "Please select a branch.";
    }

    if (!dailyLimit || Number(dailyLimit) <= 0) {
      newErrors.dailyLimit = "Enter a valid daily transaction limit.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const generatedAccountNumber = `TRS-${Date.now().toString().slice(-10)}`;

    setAccountNumber(generatedAccountNumber);
    setSuccess(true);
  };

  const handleReset = () => {
    setCustomerId("");
    setAccountType("Savings");
    setInitialDeposit("5000");
    setBranch("");
    setDailyLimit("200000");
    setCurrency("BDT");
    setErrors({});
    setSuccess(false);
    setAccountNumber("");
  };

  if (success && selectedCustomer) {
    return (
      <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-[75vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-2xl border border-[#DBE2EF] bg-white p-6 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={34} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#112D4E]">
              Account Created Successfully!
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              The demo account has been created for{" "}
              <span className="font-semibold text-[#112D4E]">
                {selectedCustomer.name}
              </span>
              .
            </p>

            <div className="mt-7 rounded-xl border border-[#DBE2EF] bg-[#F9FAFB] p-5 text-left">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-[#6B7280]">
                  Generated Account Number
                </span>
                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard.writeText(accountNumber)
                  }
                  className="flex items-center gap-1 text-xs font-semibold text-[#3F72AF] hover:text-[#112D4E]"
                >
                  <Copy size={14} />
                  Copy
                </button>
              </div>

              <p className="mt-2 break-all text-xl font-bold tracking-wide text-[#112D4E]">
                {accountNumber}
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[#DBE2EF] pt-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-[#6B7280]">Customer</p>
                  <p className="mt-1 text-sm font-semibold text-[#112D4E]">
                    {selectedCustomer.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Account Type</p>
                  <p className="mt-1 text-sm font-semibold text-[#112D4E]">
                    {accountType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Initial Deposit</p>
                  <p className="mt-1 text-sm font-semibold text-[#112D4E]">
                    {currency} {Number(initialDeposit).toLocaleString("en-BD")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Branch</p>
                  <p className="mt-1 text-sm font-semibold text-[#112D4E]">
                    {branch}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Daily Transaction Limit</p>
                  <p className="mt-1 text-sm font-semibold text-[#112D4E]">
                    {currency} {Number(dailyLimit).toLocaleString("en-BD")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Account Status</p>
                  <span className="mt-1 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/admin/accounts"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4168]"
              >
                <Wallet size={17} />
                Back to Accounts
              </Link>

              <button
                type="button"
                onClick={handleReset}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#DBE2EF] px-5 py-3 text-sm font-semibold text-[#112D4E] transition hover:bg-[#F9F7F7]"
              >
                <Plus size={17} />
                Create Another
              </button>
            </div>

            <p className="mt-5 text-xs text-[#9CA3AF]">
              This is a frontend demonstration. The account has not been saved
              to the banking database.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-7">

        {/* Header */}
        <div>
          <Link
            href="/dashboard/admin/accounts"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#3F72AF] transition hover:text-[#112D4E]"
          >
            <ArrowLeft size={17} />
            Back to Bank Accounts
          </Link>

          <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-[#3F72AF]">
            Administration / Bank Accounts / Create
          </p>

          <h1 className="text-2xl font-bold text-[#112D4E] sm:text-3xl">
            Create Bank Account
          </h1>

          <p className="mt-2 text-sm text-[#6B7280]">
            Open a new bank account for an existing registered customer.
          </p>
        </div>

        {/* Information Notice */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-blue-800">
          <ShieldCheck size={20} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Administrator Access</p>
            <p className="mt-1 text-xs leading-relaxed text-blue-700">
              As an administrator, you can create accounts and configure
              their initial deposit and daily transaction limits.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Customer Selection */}
          <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserRound size={21} />
              </div>
              <div>
                <h2 className="font-bold text-[#112D4E]">
                  Customer Information
                </h2>
                <p className="mt-1 text-xs text-[#6B7280]">
                  Select the registered customer who will own this account.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                Select Customer <span className="text-rose-500">*</span>
              </label>

              <select
                value={customerId}
                onChange={(e) => {
                  setCustomerId(e.target.value);
                  setErrors((previous) => ({
                    ...previous,
                    customerId: "",
                  }));
                }}
                className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-[#112D4E] outline-none transition focus:border-[#3F72AF] ${
                  errors.customerId ? "border-rose-400" : "border-[#DBE2EF]"
                }`}
              >
                <option value="">Choose a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} — {customer.id}
                  </option>
                ))}
              </select>

              {errors.customerId && (
                <p className="mt-2 flex items-center gap-1 text-xs text-rose-600">
                  <AlertCircle size={14} />
                  {errors.customerId}
                </p>
              )}
            </div>

            {selectedCustomer && (
              <div className="mt-5 rounded-xl border border-[#DBE2EF] bg-[#F9FAFB] p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Selected Customer
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <UserRound size={17} className="text-[#3F72AF]" />
                    <div>
                      <p className="text-[10px] text-[#9CA3AF]">Name</p>
                      <p className="text-sm font-semibold text-[#112D4E]">
                        {selectedCustomer.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail size={17} className="text-[#3F72AF]" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#9CA3AF]">Email</p>
                      <p className="break-all text-sm font-semibold text-[#112D4E]">
                        {selectedCustomer.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={17} className="text-[#3F72AF]" />
                    <div>
                      <p className="text-[10px] text-[#9CA3AF]">Phone</p>
                      <p className="text-sm font-semibold text-[#112D4E]">
                        {selectedCustomer.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Account Details */}
          <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <CreditCard size={21} />
              </div>
              <div>
                <h2 className="font-bold text-[#112D4E]">
                  Account Details
                </h2>
                <p className="mt-1 text-xs text-[#6B7280]">
                  Configure the new bank account.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                  Account Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={accountType}
                  onChange={(e) =>
                    setAccountType(e.target.value as AccountType)
                  }
                  className="h-12 w-full rounded-xl border border-[#DBE2EF] bg-white px-4 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF]"
                >
                  <option value="Savings">Savings Account</option>
                  <option value="Current">Current Account</option>
                  <option value="Fixed Deposit">Fixed Deposit Account</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-12 w-full rounded-xl border border-[#DBE2EF] bg-white px-4 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF]"
                >
                  <option value="BDT">BDT — Bangladeshi Taka</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                  Initial Deposit <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <CircleDollarSign
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                  />
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={initialDeposit}
                    onChange={(e) => {
                      setInitialDeposit(e.target.value);
                      setErrors((previous) => ({
                        ...previous,
                        initialDeposit: "",
                      }));
                    }}
                    placeholder="Enter initial deposit"
                    className={`h-12 w-full rounded-xl border bg-white pl-10 pr-4 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF] ${
                      errors.initialDeposit
                        ? "border-rose-400"
                        : "border-[#DBE2EF]"
                    }`}
                  />
                </div>
                {errors.initialDeposit && (
                  <p className="mt-2 text-xs text-rose-600">
                    {errors.initialDeposit}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                  Daily Transaction Limit{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Wallet
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                  />
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={dailyLimit}
                    onChange={(e) => {
                      setDailyLimit(e.target.value);
                      setErrors((previous) => ({
                        ...previous,
                        dailyLimit: "",
                      }));
                    }}
                    placeholder="Enter daily limit"
                    className={`h-12 w-full rounded-xl border bg-white pl-10 pr-4 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF] ${
                      errors.dailyLimit
                        ? "border-rose-400"
                        : "border-[#DBE2EF]"
                    }`}
                  />
                </div>
                {errors.dailyLimit && (
                  <p className="mt-2 text-xs text-rose-600">
                    {errors.dailyLimit}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Branch Information */}
          <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Building2 size={21} />
              </div>
              <div>
                <h2 className="font-bold text-[#112D4E]">
                  Branch Information
                </h2>
                <p className="mt-1 text-xs text-[#6B7280]">
                  Select the branch responsible for this account.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                Select Branch <span className="text-rose-500">*</span>
              </label>

              <select
                value={branch}
                onChange={(e) => {
                  setBranch(e.target.value);
                  setErrors((previous) => ({
                    ...previous,
                    branch: "",
                  }));
                }}
                className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF] ${
                  errors.branch ? "border-rose-400" : "border-[#DBE2EF]"
                }`}
              >
                <option value="">Choose a branch</option>
                {branches.map((branchName) => (
                  <option key={branchName} value={branchName}>
                    {branchName}
                  </option>
                ))}
              </select>

              {errors.branch && (
                <p className="mt-2 text-xs text-rose-600">
                  {errors.branch}
                </p>
              )}
            </div>
          </section>

          {/* Account Summary */}
          <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-7">
            <h2 className="font-bold text-[#112D4E]">
              Account Creation Summary
            </h2>
            <p className="mt-1 text-xs text-[#6B7280]">
              Review the details before creating the account.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-[#F9F7F7] p-4">
                <p className="text-xs text-[#6B7280]">Selected Customer</p>
                <p className="mt-1 text-sm font-semibold text-[#112D4E]">
                  {selectedCustomer?.name || "Not selected"}
                </p>
              </div>

              <div className="rounded-xl bg-[#F9F7F7] p-4">
                <p className="text-xs text-[#6B7280]">Account Type</p>
                <p className="mt-1 text-sm font-semibold text-[#112D4E]">
                  {accountType}
                </p>
              </div>

              <div className="rounded-xl bg-[#F9F7F7] p-4">
                <p className="text-xs text-[#6B7280]">Initial Deposit</p>
                <p className="mt-1 text-sm font-semibold text-[#112D4E]">
                  {currency}{" "}
                  {Number(initialDeposit || 0).toLocaleString("en-BD")}
                </p>
              </div>

              <div className="rounded-xl bg-[#F9F7F7] p-4">
                <p className="text-xs text-[#6B7280]">Daily Limit</p>
                <p className="mt-1 text-sm font-semibold text-[#112D4E]">
                  {currency}{" "}
                  {Number(dailyLimit || 0).toLocaleString("en-BD")}
                </p>
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Link
              href="/dashboard/admin/accounts"
              className="flex items-center justify-center rounded-xl border border-[#DBE2EF] bg-white px-6 py-3 text-sm font-semibold text-[#4B5563] transition hover:bg-[#F9F7F7]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4168]"
            >
              <Plus size={18} />
              Create Bank Account
            </button>
          </div>

          <p className="pb-3 text-center text-xs text-[#9CA3AF]">
            Demo interface only. No real bank account or deposit is created.
          </p>
        </form>
      </div>
    </div>
  );
}
