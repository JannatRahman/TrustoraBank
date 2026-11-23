import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F7F7] px-4">
      <div className="max-w-md w-full rounded-2xl bg-white p-8 text-center shadow-lg border border-gray-100">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-[#112D4E]">Access Denied</h1>
        <p className="mt-2 text-sm text-gray-600">
          You do not have permission to access this page or resource. Please check your credentials or log in with an authorized account.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3F72AF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#112D4E] transition"
          >
            Log in with another account
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#112D4E] hover:bg-gray-50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
