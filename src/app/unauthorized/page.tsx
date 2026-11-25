import Link from "next/link";
import { ShieldAlert, ArrowLeft, LockKeyhole, Home } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8FAFD] px-4 py-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#DBEAFE]/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#BFDBFE]/40 blur-3xl" />

      <div className="relative w-full max-w-lg">
        {/* Brand */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-[#112D4E]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#112D4E] text-white">
              <LockKeyhole className="h-5 w-5" />
            </span>
            Trustora<span className="text-[#3F72AF]">Bank</span>
          </Link>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-[#64748B]">
            Secure Banking Experience
          </p>
        </div>

        {/* Main card */}
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 text-center shadow-[0_20px_60px_-20px_rgba(17,45,78,0.18)] sm:p-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#3F72AF] ring-8 ring-[#F8FAFD]">
            <ShieldAlert className="h-10 w-10" strokeWidth={1.7} />
          </div>

          <span className="inline-flex items-center rounded-full border border-[#FECACA] bg-[#FEF2F2] px-3 py-1 text-xs font-semibold tracking-wide text-[#B91C1C]">
            ERROR 403 · ACCESS RESTRICTED
          </span>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#112D4E] sm:text-4xl">
            Access Denied
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#64748B]">
            Sorry, you don't have permission to access this page. Your account
            may not have the required access level. Please sign in with an
            authorized account.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3F72AF] px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#3F72AF]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#112D4E] hover:shadow-lg"
            >
              <LockKeyhole className="h-4 w-4" />
              Sign in with another account
            </Link>

            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#DCE4EE] bg-white px-5 py-3.5 text-sm font-semibold text-[#112D4E] transition-all duration-200 hover:border-[#3F72AF] hover:bg-[#F1F6FC]"
            >
              <Home className="h-4 w-4" />
              Back to Homepage
              <ArrowLeft className="ml-auto h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 border-t border-[#EEF2F7] pt-5">
            <p className="text-xs leading-5 text-[#94A3B8]">
              If you believe this is a mistake, please contact your bank
              administrator for assistance.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs font-medium text-[#94A3B8]">
          © 2026 Trustora Bank. Secure banking, built on trust.
        </p>
      </div>
    </main>
  );
}