
"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Wallet,
  UserRound,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  UserPlus,
  X,
} from "lucide-react";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

const initialCustomers: Customer[] = [
  {
    id: "CUS-1001",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 202 555 0142",
  },
  {
    id: "CUS-1002",
    name: "Michael Chen",
    email: "michael@example.com",
    phone: "+1 202 555 0185",
  },
  {
    id: "CUS-1003",
    name: "Emma Williams",
    email: "emma@example.com",
    phone: "+1 202 555 0128",
  },
  {
    id: "CUS-1004",
    name: "David Miller",
    email: "david@example.com",
    phone: "+1 202 555 0167",
  },
  {
    id: "CUS-1005",
    name: "Olivia Brown",
    email: "olivia@example.com",
    phone: "+1 202 555 0191",
  },
  {
    id: "CUS-1006",
    name: "James Wilson",
    email: "james@example.com",
    phone: "+1 202 555 0173",
  },
];

export default function CreateBankAccountPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [accountType, setAccountType] = useState("");
  const [currency, setCurrency] = useState("BDT");
  const [deposit, setDeposit] = useState("");
  const [branch, setBranch] = useState("");
  const [success, setSuccess] = useState(false);

  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const customer = customers.find(
    (item) => item.id === selectedCustomer
  );

  const handleAddCustomer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newCustomer: Customer = {
      id: `CUS-${1001 + customers.length}`,
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
    };

    setCustomers((previous) => [...previous, newCustomer]);
    setSelectedCustomer(newCustomer.id);

    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setShowNewCustomerForm(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F7F7] px-4 py-10">
        <div className="w-full max-w-md rounded-3xl border border-[#DBE2EF] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle2 size={34} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[#112D4E]">
            Account Form Submitted!
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Your demo account creation form has been completed.
            No real bank account has been created.
          </p>

          <div className="mt-6 rounded-2xl bg-[#F9F7F7] p-4 text-left">
            <p className="text-xs text-gray-500">Selected Customer</p>
            <p className="mt-1 font-semibold text-[#112D4E]">
              {customer?.name}
            </p>

            <p className="mt-3 text-xs text-gray-500">Customer ID</p>
            <p className="mt-1 font-semibold text-[#112D4E]">
              {customer?.id}
            </p>

            <p className="mt-3 text-xs text-gray-500">Account Type</p>
            <p className="mt-1 font-semibold text-[#112D4E]">
              {accountType}
            </p>

            <p className="mt-3 text-xs text-gray-500">Initial Deposit</p>
            <p className="mt-1 font-semibold text-[#112D4E]">
              {currency} {Number(deposit || 0).toLocaleString()}
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3">
            <Link
              href="/dashboard/bankStaff/accounts"
              className="rounded-xl bg-[#172554] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#112D4E]"
            >
              Back to Bank Accounts
            </Link>

            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setSelectedCustomer("");
                setAccountType("");
                setCurrency("BDT");
                setDeposit("");
                setBranch("");
              }}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-[#112D4E] hover:bg-gray-50"
            >
              Create Another Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-7">

        {/* HEADER */}
        <div>
          <Link
            href="/dashboard/bankStaff/accounts"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#3F72AF] hover:text-[#112D4E]"
          >
            <ArrowLeft size={17} />
            Back to Bank Accounts
          </Link>

          <p className="text-sm font-medium text-[#3F72AF]">
            BANKING STAFF / ACCOUNTS / NEW
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#112D4E] sm:text-3xl">
            Create Bank Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create a new bank account for an existing or newly registered customer.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* CUSTOMER INFORMATION */}
          <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-[#DBE2EF]/50 p-2.5 text-[#3F72AF]">
                <UserRound size={21} />
              </div>

              <div>
                <h2 className="font-bold text-[#112D4E]">
                  Customer Information
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Select an existing customer or register a new one
                </p>
              </div>
            </div>

            <FormField label="Select Customer" required>
              <div className="relative">
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  required
                  className="form-input appearance-none"
                >
                  <option value="" disabled>
                    Choose a customer
                  </option>

                  {customers.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — {item.id}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </FormField>

            <button
              type="button"
              onClick={() => setShowNewCustomerForm((previous) => !previous)}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#3F72AF] hover:text-[#112D4E]"
            >
              {showNewCustomerForm ? <X size={17} /> : <UserPlus size={17} />}
              {showNewCustomerForm ? "Cancel Registration" : "Register New Customer"}
            </button>

            {/* NEW CUSTOMER FORM */}
            {showNewCustomerForm && (
              <div className="mt-5 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] p-5">
                <h3 className="font-semibold text-[#112D4E]">
                  New Customer Details
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Enter the customer's basic information to add them to the customer list.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <FormField label="Full Name" required>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Enter full name"
                      required
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="Email Address" required>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Enter email address"
                      required
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="Phone Number" required>
                    <input
                      type="tel"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="Enter phone number"
                      required
                      className="form-input"
                    />
                  </FormField>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNewCustomerForm(false)}
                  className="mt-5 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const form = document.getElementById("new-customer-form") as HTMLFormElement | null;
                    form?.requestSubmit();
                  }}
                  className="ml-3 rounded-xl bg-[#172554] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#112D4E]"
                >
                  Add Customer
                </button>

                <form
                  id="new-customer-form"
                  onSubmit={handleAddCustomer}
                  className="hidden"
                >
                  <input required value={newName} readOnly />
                  <input required type="email" value={newEmail} readOnly />
                  <input required value={newPhone} readOnly />
                </form>
              </div>
            )}

            {/* SELECTED CUSTOMER DETAILS */}
            {customer && (
              <div className="mt-5 grid gap-4 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">Customer ID</p>
                  <p className="mt-1 text-sm font-semibold text-[#112D4E]">
                    {customer.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="mt-1 text-sm font-semibold text-[#112D4E]">
                    {customer.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="mt-1 break-all text-sm text-gray-700">
                    {customer.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="mt-1 text-sm text-gray-700">
                    {customer.phone}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* ACCOUNT DETAILS */}
          <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-[#DBE2EF]/50 p-2.5 text-[#3F72AF]">
                <Wallet size={21} />
              </div>

              <div>
                <h2 className="font-bold text-[#112D4E]">
                  Account Details
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Configure the new bank account
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Account Type" required>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  required
                  className="form-input"
                >
                  <option value="" disabled>
                    Select account type
                  </option>
                  <option value="Savings">Savings Account</option>
                  <option value="Current">Current Account</option>
                  <option value="Fixed Deposit">Fixed Deposit</option>
                </select>
              </FormField>

              <FormField label="Account Currency" required>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  required
                  className="form-input"
                >
                  <option value="BDT">BDT — Bangladeshi Taka</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                </select>
              </FormField>

              <FormField label="Initial Deposit Amount" required>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  placeholder="Enter initial deposit"
                  required
                  className="form-input"
                />
              </FormField>

              <FormField label="Branch" required>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  required
                  className="form-input"
                >
                  <option value="" disabled>
                    Select branch
                  </option>
                  <option value="Dhaka Main Branch">Dhaka Main Branch</option>
                  <option value="Gulshan Branch">Gulshan Branch</option>
                  <option value="Uttara Branch">Uttara Branch</option>
                  <option value="Chittagong Branch">Chittagong Branch</option>
                </select>
              </FormField>
            </div>
          </section>

          {/* ACCOUNT INFORMATION NOTICE */}
          <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <ShieldCheck size={22} className="shrink-0 text-[#3F72AF]" />

            <div>
              <h3 className="text-sm font-semibold text-[#112D4E]">
                Account Creation Notice
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-600">
                Verify the customer's identity and eligibility before creating an account.
                Account numbers and activation should be handled by the bank's authorized process.
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Link
              href="/dashboard/bankStaff/accounts"
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-[#172554] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#112D4E]"
            >
              Submit Account Form
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-400">
          Prototype interface — customer records and account details are illustrative mock data.
        </p>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#112D4E]">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
