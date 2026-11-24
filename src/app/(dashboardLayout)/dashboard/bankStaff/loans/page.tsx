
"use client";

import { useMemo, useState, useEffect, type ReactNode } from "react";
import {
  Search,
  Eye,
  FileText,
  Clock,
  CheckCircle2,
  Send,
  X,
  UserRound,
  Wallet,
  CalendarDays,
  MessageSquare,
  AlertCircle,
  ChevronDown,
  Loader2,
} from "lucide-react";

type LoanStatus = "Pending Review" | "Under Review" | "Forwarded to Admin";
type LoanType = "Personal Loan" | "Home Loan" | "Business Loan" | "Education Loan";

type LoanApplication = {
  id: string;
  customer: string;
  customerId: string;
  email: string;
  phone: string;
  loanType: LoanType;
  amount: number;
  duration: number;
  monthlyIncome: number;
  occupation: string;
  submittedDate: string;
  purpose: string;
  status: LoanStatus;
  notes: string;
};

const initialApplications: LoanApplication[] = [];

const mapBackendStatusToStaffStatus = (status: string): LoanStatus => {
  switch (status?.toUpperCase()) {
    case "FORWARDED_TO_ADMIN":
    case "APPROVED":
    case "ACTIVE":
    case "COMPLETED":
      return "Forwarded to Admin";
    case "UNDER_REVIEW":
      return "Under Review";
    case "PENDING":
    default:
      return "Pending Review";
  }
};

const mapBackendTypeToStaffType = (type: string): LoanType => {
  switch (type?.toUpperCase()) {
    case "HOME": return "Home Loan";
    case "BUSINESS": return "Business Loan";
    case "EDUCATION": return "Education Loan";
    case "PERSONAL":
    default:
      return "Personal Loan";
  }
};

const statusStyles: Record<LoanStatus, string> = {
  "Pending Review": "bg-amber-50 text-amber-700 border-amber-200",
  "Under Review": "bg-blue-50 text-blue-700 border-blue-200",
  "Forwarded to Admin": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

function StatCard({
  title,
  value,
  description,
  icon,
  iconBg,
}: {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
  iconBg: string;
}) {
  return (
    <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#6B7280]">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-[#112D4E]">{value}</h3>
          <p className="mt-1 text-xs text-[#6B7280]">{description}</p>
        </div>
        <div className={`rounded-xl p-3 ${iconBg}`}>{icon}</div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#DBE2EF] py-3 last:border-0">
      <span className="flex items-center gap-2 text-sm text-[#6B7280]">
        {icon}
        {label}
      </span>
      <span className="text-right text-sm font-semibold text-[#112D4E]">
        {value}
      </span>
    </div>
  );
}

export default function LoanApplicationsPage() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedApplication, setSelectedApplication] =
    useState<LoanApplication | null>(null);
  const [note, setNote] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [successNotice, setSuccessNotice] = useState("");

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/loans");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped: LoanApplication[] = json.data.map((doc: any) => ({
          id: doc.loanNumber || doc._id,
          customer: doc.applicant?.split("@")[0] || doc.applicant || "Customer",
          customerId: doc.account || "N/A",
          email: doc.applicant || "",
          phone: "Verified Account",
          loanType: mapBackendTypeToStaffType(doc.type),
          amount: doc.amount || 0,
          duration: doc.durationMonths || 12,
          monthlyIncome: doc.monthlyIncome || 0,
          occupation: doc.employmentStatus || "Employed",
          submittedDate: doc.createdAt
            ? new Date(doc.createdAt).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
          purpose: doc.description || "General financing",
          status: mapBackendStatusToStaffStatus(doc.status),
          notes: Array.isArray(doc.staffNotes)
            ? doc.staffNotes.map((n: any) => `${n.staff}: ${n.note}`).join("\n")
            : "",
        }));
        setApplications(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch staff loan applications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const stats = useMemo(
    () => ({
      total: applications.length,
      pending: applications.filter((item) => item.status === "Pending Review").length,
      reviewing: applications.filter((item) => item.status === "Under Review").length,
      forwarded: applications.filter((item) => item.status === "Forwarded to Admin").length,
    }),
    [applications]
  );

  const filteredApplications = useMemo(() => {
    return applications.filter((item) => {
      const searchMatch = [
        item.id,
        item.customer,
        item.customerId,
        item.email,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "All" || item.status === statusFilter;

      const typeMatch =
        typeFilter === "All" || item.loanType === typeFilter;

      return searchMatch && statusMatch && typeMatch;
    });
  }, [applications, search, statusFilter, typeFilter]);

  const openReview = (application: LoanApplication) => {
    setSelectedApplication(application);
    setNote(application.notes);
    setReviewError("");
  };

  const saveReview = async (forward: boolean) => {
    if (!selectedApplication) return;
    setReviewError("");
    setIsSubmittingReview(true);

    try {
      if (note.trim() && note.trim() !== selectedApplication.notes) {
        const noteRes = await fetch(`/api/loans/${selectedApplication.id}/notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note: note.trim() }),
        });
        const noteJson = await noteRes.json();
        if (!noteRes.ok || !noteJson.success) {
          throw new Error(noteJson.error || noteJson.message || "Failed to save internal note.");
        }
      }

      if (forward) {
        const fwdRes = await fetch(`/api/loans/${selectedApplication.id}/forward`, {
          method: "POST",
        });
        const fwdJson = await fwdRes.json();
        if (!fwdRes.ok || !fwdJson.success) {
          throw new Error(fwdJson.error || fwdJson.message || "Failed to forward loan application.");
        }
      }

      await fetchApplications();
      setSuccessNotice(
        forward
          ? `Loan ${selectedApplication.id} forwarded to Administrator.`
          : `Review saved for loan ${selectedApplication.id}.`
      );
      setTimeout(() => setSuccessNotice(""), 3500);
      setSelectedApplication(null);
      setNote("");
    } catch (err: any) {
      setReviewError(err.message || "Failed to process review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3F72AF]">
              Banking Staff / Loan Management
            </p>
            <h1 className="mt-2 text-2xl font-bold text-[#112D4E] sm:text-3xl">
              Loan Applications
            </h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Review customer loan applications and forward them for admin approval.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-xl border border-[#DBE2EF] bg-white px-4 py-3 text-sm text-[#4B5563]">
            <FileText size={17} className="text-[#3F72AF]" />
            Staff Review Portal
          </div>
        </div>

        {/* Success notice */}
        {successNotice && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            <CheckCircle2 size={18} className="text-emerald-600" />
            {successNotice}
          </div>
        )}

        {/* Permission notice */}
        <div className="flex gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <AlertCircle className="mt-0.5 shrink-0 text-blue-600" size={20} />
          <div>
            <p className="text-sm font-semibold text-blue-900">
              Staff review permissions
            </p>
            <p className="mt-1 text-sm leading-6 text-blue-800">
              Banking staff can review applications, add internal notes, and
              forward applications to administrators. Final loan approval or
              rejection is reserved for authorized administrators.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Applications"
            value={stats.total}
            description="All submitted applications"
            icon={<FileText size={21} className="text-[#3F72AF]" />}
            iconBg="bg-blue-50"
          />
          <StatCard
            title="Pending Review"
            value={stats.pending}
            description="Waiting for staff review"
            icon={<Clock size={21} className="text-amber-600" />}
            iconBg="bg-amber-50"
          />
          <StatCard
            title="Under Review"
            value={stats.reviewing}
            description="Currently being reviewed"
            icon={<Eye size={21} className="text-blue-600" />}
            iconBg="bg-blue-50"
          />
          <StatCard
            title="Forwarded to Admin"
            value={stats.forwarded}
            description="Waiting for admin assessment"
            icon={<CheckCircle2 size={21} className="text-emerald-600" />}
            iconBg="bg-emerald-50"
          />
        </div>

        {/* Applications table */}
        <div className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          <div className="border-b border-[#DBE2EF] p-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-bold text-[#112D4E]">
                  Application Records
                </h2>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Search and review submitted loan applications.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search applications..."
                    className="w-full rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#3F72AF] sm:w-60"
                  />
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] py-2.5 pl-3 pr-9 text-sm text-[#4B5563] outline-none focus:border-[#3F72AF] sm:w-44"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Forwarded to Admin">Forwarded to Admin</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                  />
                </div>

                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] py-2.5 pl-3 pr-9 text-sm text-[#4B5563] outline-none focus:border-[#3F72AF] sm:w-44"
                  >
                    <option value="All">All Loan Types</option>
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Home Loan">Home Loan</option>
                    <option value="Business Loan">Business Loan</option>
                    <option value="Education Loan">Education Loan</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-[#F9F7F7]">
                <tr className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  <th className="px-5 py-4">Application</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Loan Details</th>
                  <th className="px-5 py-4">Submitted</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DBE2EF]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center">
                      <Loader2 size={28} className="mx-auto animate-spin text-[#3F72AF]" />
                      <p className="mt-3 text-sm font-semibold text-[#112D4E]">Loading applications...</p>
                    </td>
                  </tr>
                ) : filteredApplications.length > 0 ? (
                  filteredApplications.map((application) => (
                    <tr key={application.id} className="transition hover:bg-[#F9F7F7]/70">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-[#112D4E]">
                          {application.id}
                        </p>
                        <p className="mt-1 text-xs text-[#6B7280]">
                          {application.loanType}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-[#112D4E]">
                          {application.customer}
                        </p>
                        <p className="mt-1 text-xs text-[#6B7280]">
                          {application.customerId}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-[#112D4E]">
                          {formatAmount(application.amount)}
                        </p>
                        <p className="mt-1 text-xs text-[#6B7280]">
                          {application.duration} months
                        </p>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#4B5563]">
                        {new Date(application.submittedDate).toLocaleDateString(
                          "en-GB",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[application.status]}`}
                        >
                          {application.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => openReview(application)}
                          className="inline-flex items-center gap-2 rounded-lg border border-[#DBE2EF] px-3 py-2 text-sm font-semibold text-[#3F72AF] transition hover:bg-blue-50"
                        >
                          <Eye size={15} />
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center">
                      <FileText
                        size={30}
                        className="mx-auto text-[#9CA3AF]"
                      />
                      <p className="mt-3 font-semibold text-[#112D4E]">
                        No applications found
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

          <div className="border-t border-[#DBE2EF] px-5 py-4">
            <p className="text-xs text-[#6B7280]">
              Showing {filteredApplications.length} of {applications.length} applications
            </p>
          </div>
        </div>
      </div>

      {/* Review modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#112D4E]/50 p-3 backdrop-blur-sm sm:p-6">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#DBE2EF] bg-white p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#3F72AF]">
                  Application Review
                </p>
                <h2 className="mt-1 text-lg font-bold text-[#112D4E]">
                  {selectedApplication.id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="rounded-lg p-2 text-[#6B7280] transition hover:bg-[#F9F7F7] hover:text-[#112D4E]"
                aria-label="Close review"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              {/* Customer information */}
              <section>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-[#112D4E]">
                  <UserRound size={18} className="text-[#3F72AF]" />
                  Customer Information
                </h3>
                <div className="rounded-xl border border-[#DBE2EF] px-4">
                  <DetailRow label="Full Name" value={selectedApplication.customer} />
                  <DetailRow label="Customer ID" value={selectedApplication.customerId} />
                  <DetailRow label="Email" value={selectedApplication.email} />
                  <DetailRow label="Phone" value={selectedApplication.phone} />
                  <DetailRow label="Occupation" value={selectedApplication.occupation} />
                  <DetailRow
                    label="Monthly Income"
                    value={formatAmount(selectedApplication.monthlyIncome)}
                  />
                </div>
              </section>

              {/* Loan information */}
              <section>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-[#112D4E]">
                  <Wallet size={18} className="text-[#3F72AF]" />
                  Loan Information
                </h3>
                <div className="rounded-xl border border-[#DBE2EF] px-4">
                  <DetailRow label="Loan Type" value={selectedApplication.loanType} />
                  <DetailRow
                    label="Requested Amount"
                    value={formatAmount(selectedApplication.amount)}
                  />
                  <DetailRow
                    label="Loan Duration"
                    value={`${selectedApplication.duration} months`}
                  />
                  <DetailRow
                    label="Submitted Date"
                    value={selectedApplication.submittedDate}
                    icon={<CalendarDays size={14} />}
                  />
                  <DetailRow
                    label="Current Status"
                    value={
                      <span
                        className={`rounded-full border px-3 py-1 text-xs ${statusStyles[selectedApplication.status]}`}
                      >
                        {selectedApplication.status}
                      </span>
                    }
                  />
                </div>
                <div className="mt-3 rounded-xl bg-[#F9F7F7] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                    Loan Purpose
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                    {selectedApplication.purpose}
                  </p>
                </div>
              </section>

              {/* Internal notes */}
              <section>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-[#112D4E]">
                  <MessageSquare size={18} className="text-[#3F72AF]" />
                  Internal Review Notes
                </h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  placeholder="Write observations or additional information for the admin..."
                  className="w-full resize-none rounded-xl border border-[#DBE2EF] p-4 text-sm text-[#112D4E] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#3F72AF] focus:ring-2 focus:ring-[#3F72AF]/10"
                />
                <p className="mt-2 text-xs text-[#6B7280]">
                  Internal staff notes are stored permanently on this application.
                </p>
                {reviewError && (
                  <p className="mt-3 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600">
                    {reviewError}
                  </p>
                )}
              </section>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-[#DBE2EF] pt-5 sm:flex-row sm:justify-between">
                <button
                  onClick={() => setSelectedApplication(null)}
                  disabled={isSubmittingReview}
                  className="rounded-xl border border-[#DBE2EF] px-5 py-3 text-sm font-semibold text-[#4B5563] transition hover:bg-[#F9F7F7] disabled:opacity-50"
                >
                  Cancel
                </button>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => saveReview(false)}
                    disabled={isSubmittingReview}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#3F72AF] px-5 py-3 text-sm font-semibold text-[#3F72AF] transition hover:bg-blue-50 disabled:opacity-50"
                  >
                    {isSubmittingReview && <Loader2 size={15} className="animate-spin" />}
                    Save Review
                  </button>
                  <button
                    onClick={() => saveReview(true)}
                    disabled={isSubmittingReview || selectedApplication.status === "Forwarded to Admin"}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#172554] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmittingReview ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    Forward to Admin
                  </button>
                </div>
              </div>

              <p className="text-center text-xs text-[#9CA3AF]">
                Final approval and rejection decisions are restricted to administrators.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
