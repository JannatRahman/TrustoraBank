import Link from "next/link";
import { Landmark, ArrowLeft, LayoutDashboard, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9F7F7] px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative gradient blur backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#DBE2EF] opacity-60 blur-3xl" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#3F72AF] opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-[#DBE2EF] bg-white p-8 text-center shadow-xl sm:p-10">
        {/* Trustora Bank Brand Badge */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F9F7F7] border border-[#DBE2EF] text-[#112D4E] shadow-inner">
          <Landmark className="h-8 w-8 text-[#3F72AF]" />
        </div>

        {/* 404 Code Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#3F72AF] ring-1 ring-inset ring-[#3F72AF]/20">
          <Compass className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "8s" }} />
          404 Error
        </div>

        {/* Primary Heading */}
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#112D4E] sm:text-4xl">
          Page Not Found
        </h1>

        {/* Friendly explanation */}
        <p className="mt-3 text-sm text-[#4F647E] leading-relaxed sm:text-base">
          The requested page could not be found or may have moved.
          Please check the URL or use the secure navigation below to return to your banking operations.
        </p>

        {/* Action Controls */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4168] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#112D4E] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Homepage
          </Link>

          <Link
            href="/dashboard/customer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DBE2EF] bg-white px-5 py-3 text-sm font-semibold text-[#112D4E] shadow-sm hover:bg-gray-50 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F72AF] cursor-pointer"
          >
            <LayoutDashboard className="h-4 w-4 text-[#3F72AF]" />
            Go to Dashboard
          </Link>
        </div>

        {/* Security / Help Assurance */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Need assistance with an active account? Contact{" "}
            <Link
              href="/#contact"
              className="font-medium text-[#3F72AF] hover:underline cursor-pointer"
            >
              Trustora Support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
