
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export default function NewCustomerPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // UI prototype only: no customer is saved to a database.
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
            Registration Submitted!
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Your demo registration form has been completed successfully.
            No customer record has been saved yet.
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <button
              onClick={() => router.push("/dashboard/bankStaff/customers")}
              className="rounded-xl bg-[#172554] px-5 py-3 text-sm font-semibold text-white hover:bg-[#112D4E]"
            >
              Back to Customers
            </button>

            <button
              onClick={() => setSuccess(false)}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-[#112D4E] hover:bg-gray-50"
            >
              Register Another Customer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-7">

        {/* Header */}
        <div>
          <Link
            href="/dashboard/bankStaff/customers"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#3F72AF] hover:text-[#112D4E]"
          >
            <ArrowLeft size={17} />
            Back to Customers
          </Link>

          <p className="text-sm font-medium text-[#3F72AF]">
            BANKING STAFF / CUSTOMERS / NEW
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#112D4E] sm:text-3xl">
            Register New Customer
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter the customer's personal and identity information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Personal Information */}
          <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-[#DBE2EF]/50 p-2.5 text-[#3F72AF]">
                <UserRound size={21} />
              </div>

              <div>
                <h2 className="font-bold text-[#112D4E]">
                  Personal Information
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Basic customer details
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Full Name" required>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Enter full name"
                  required
                  className="form-input"
                />
              </FormField>

              <FormField label="Email Address" required>
                <input
                  name="email"
                  type="email"
                  placeholder="customer@example.com"
                  required
                  className="form-input"
                />
              </FormField>

              <FormField label="Phone Number" required>
                <input
                  name="phone"
                  type="tel"
                  placeholder="+880 1XXXXXXXXX"
                  required
                  className="form-input"
                />
              </FormField>

              <FormField label="Date of Birth" required>
                <input
                  name="dateOfBirth"
                  type="date"
                  required
                  className="form-input"
                />
              </FormField>

              <FormField label="Occupation">
                <input
                  name="occupation"
                  type="text"
                  placeholder="Enter occupation"
                  className="form-input"
                />
              </FormField>

              <FormField label="Address" required>
                <input
                  name="address"
                  type="text"
                  placeholder="Enter full address"
                  required
                  className="form-input"
                />
              </FormField>
            </div>
          </section>

          {/* Identity Information */}
          <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-[#DBE2EF]/50 p-2.5 text-[#3F72AF]">
                <CreditCard size={21} />
              </div>

              <div>
                <h2 className="font-bold text-[#112D4E]">
                  Identity Information
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Customer identity verification details
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Identity Type" required>
                <select
                  name="identityType"
                  required
                  defaultValue=""
                  className="form-input"
                >
                  <option value="" disabled>
                    Select identity type
                  </option>
                  <option value="national-id">National ID</option>
                  <option value="passport">Passport</option>
                  <option value="driving-license">Driving License</option>
                </select>
              </FormField>

              <FormField label="Identity Number" required>
                <input
                  name="identityNumber"
                  type="text"
                  placeholder="Enter identity number"
                  required
                  className="form-input"
                />
              </FormField>
            </div>
          </section>

          {/* Notice */}
          <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <ShieldCheck
              size={22}
              className="shrink-0 text-[#3F72AF]"
            />

            <div>
              <h3 className="text-sm font-semibold text-[#112D4E]">
                KYC Verification Notice
              </h3>
              <p className="mt-1 text-xs leading-5 text-gray-600">
                Submitting customer information does not automatically verify
                their identity. The customer must complete the required KYC
                review process.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Link
              href="/dashboard/bankStaff/customers"
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-[#172554] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#112D4E]"
            >
              Submit Registration
            </button>
          </div>
        </form>
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
  children: React.ReactNode;
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
