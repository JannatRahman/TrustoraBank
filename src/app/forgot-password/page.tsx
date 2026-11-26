import Link from "next/link";
import { Landmark, ArrowLeft, Mail, ShieldAlert } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Recovery Assistance",
  description:
    "Information and instructions for recovering or resetting your Trustora Bank account credentials.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9F7F7] px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#DBE2EF] opacity-60 blur-3xl" />
        <div className="absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#3F72AF] opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-[#DBE2EF] bg-white p-8 text-center shadow-xl sm:p-10">
        {/* Brand Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#DBE2EF] bg-[#F9F7F7] text-[#112D4E] shadow-inner">
          <Landmark className="h-8 w-8 text-[#3F72AF]" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#3F72AF] ring-1 ring-inset ring-[#3F72AF]/20">
          <ShieldAlert className="h-3.5 w-3.5" />
          Account Security
        </div>

        {/* Heading */}
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#112D4E] sm:text-3xl">
          Password Recovery Assistance
        </h1>

        {/* Body Text */}
        <p className="mt-3 text-sm leading-relaxed text-[#4F647E] sm:text-base">
          For banking security, account password changes are authenticated directly through your registered identity provider. If you use email credentials and need a reset or if your account has been locked, please reach out to our authorized support team.
        </p>

        {/* Support Card */}
        <div className="mt-6 rounded-2xl border border-[#DBE2EF] bg-[#F9F7F7] p-5 text-left">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#3F72AF]">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                Direct Support Line
              </p>
              <a
                href="mailto:support@trustorabank.com"
                className="mt-1 block font-semibold text-[#112D4E] hover:text-[#3F72AF]"
              >
                support@trustorabank.com
              </a>
              <p className="mt-1 text-xs text-[#6B7280]">
                Identity verification is required prior to credential reissue.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="/login"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4168]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>

          <Link
            href="/contact"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#DBE2EF] bg-white px-5 py-3 text-sm font-semibold text-[#112D4E] shadow-sm transition hover:bg-gray-50"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
