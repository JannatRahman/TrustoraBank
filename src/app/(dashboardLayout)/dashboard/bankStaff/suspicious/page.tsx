
"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Search,
  AlertTriangle,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Eye,
  X,
  Flag,
  UserRound,
  Wallet,
  FileText,
  ArrowUpRight,
} from "lucide-react";

type RiskLevel = "High" | "Medium" | "Low";

type CaseStatus = "New" | "Under Review" | "Forwarded to Admin";

type SuspiciousCase = {
  id: string;
  transactionId: string;
  customer: string;
  customerId: string;
  accountNumber: string;
  transactionType: string;
  amount: number;
  date: string;
  reason: string;
  risk: RiskLevel;
  status: CaseStatus;
  description: string;
  notes: string;
};

const initialCases: SuspiciousCase[] = [
  {
    id: "SAR-2026-001",
    transactionId: "TXN-2026-006",
    customer: "James Wilson",
    customerId: "CUS-1006",
    accountNumber: "•••• 8926",
    transactionType: "Transfer",
    amount: 95000,
    date: "2026-11-20",
    reason: "Unusually large transfer",
    risk: "High",
    status: "New",
    description:
      "A transfer with a relatively high value was identified for additional review.",
    notes: "",
  },
  {
    id: "SAR-2026-002",
    transactionId: "TXN-2026-004",
    customer: "David Miller",
    customerId: "CUS-1004",
    accountNumber: "•••• 8924",
    transactionType: "Withdrawal",
    amount: 75000,
    date: "2026-11-21",
    reason: "Large cash withdrawal",
    risk: "High",
    status: "Under Review",
    description:
      "A large cash withdrawal was submitted and requires additional review.",
    notes: "Review the transaction details and supporting records.",
  },
  {
    id: "SAR-2026-003",
    transactionId: "TXN-2026-008",
    customer: "Michael Chen",
    customerId: "CUS-1002",
    accountNumber: "•••• 8922",
    transactionType: "Transfer",
    amount: 42000,
    date: "2026-11-18",
    reason: "Repeated transfer activity",
    risk: "Medium",
    status: "Forwarded to Admin",
    description:
      "Multiple transfer activities were identified for further assessment.",
    notes: "Forwarded for additional investigation.",
  },
  {
    id: "SAR-2026-004",
    transactionId: "TXN-2026-010",
    customer: "Olivia Brown",
    customerId: "CUS-1005",
    accountNumber: "•••• 8925",
    transactionType: "Withdrawal",
    amount: 18000,
    date: "2026-11-17",
    reason: "Unusual withdrawal pattern",
    risk: "Medium",
    status: "New",
    description:
      "The withdrawal pattern was identified for a routine review.",
    notes: "",
  },
  {
    id: "SAR-2026-005",
    transactionId: "TXN-2026-012",
    customer: "Sarah Johnson",
    customerId: "CUS-1001",
    accountNumber: "•••• 8921",
    transactionType: "Deposit",
    amount: 120000,
    date: "2026-11-16",
    reason: "Unusually large deposit",
    risk: "Low",
    status: "Under Review",
    description:
      "A high-value deposit was identified for a routine verification check.",
    notes: "Check the source of the deposit.",
  },
];

const riskStyles: Record<RiskLevel, string> = {
  High: "bg-red-50 text-red-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-blue-50 text-blue-700",
};

const statusStyles: Record<CaseStatus, string> = {
  New: "bg-red-50 text-red-700",
  "Under Review": "bg-amber-50 text-amber-700",
  "Forwarded to Admin": "bg-blue-50 text-[#3F72AF]",
};

export default function SuspiciousActivityPage() {
  const [cases, setCases] = useState<SuspiciousCase[]>(initialCases);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCase, setSelectedCase] = useState<SuspiciousCase | null>(
    null
  );
  const [reviewNote, setReviewNote] = useState("");

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const searchMatch =
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.transactionId.toLowerCase().includes(search.toLowerCase()) ||
        item.customer.toLowerCase().includes(search.toLowerCase()) ||
        item.customerId.toLowerCase().includes(search.toLowerCase());

      const riskMatch =
        riskFilter === "All" || item.risk === riskFilter;

      const statusMatch =
        statusFilter === "All" || item.status === statusFilter;

      return searchMatch && riskMatch && statusMatch;
    });
  }, [cases, search, riskFilter, statusFilter]);

  const newCount = cases.filter(
    (item) => item.status === "New"
  ).length;

  const reviewCount = cases.filter(
    (item) => item.status === "Under Review"
  ).length;

  const forwardedCount = cases.filter(
    (item) => item.status === "Forwarded to Admin"
  ).length;

  const highRiskCount = cases.filter(
    (item) => item.risk === "High"
  ).length;

  const formatAmount = (amount: number) =>
    `BDT ${amount.toLocaleString("en-BD")}`;

  const updateCase = (
    id: string,
    updates: Partial<SuspiciousCase>
  ) => {
    setCases((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );

    setSelectedCase(null);
    setReviewNote("");
  };

  const openCase = (item: SuspiciousCase) => {
    setSelectedCase(item);
    setReviewNote(item.notes);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* HEADER */}
        <div>
          <p className="text-sm font-medium text-[#3F72AF]">
            BANKING STAFF / SUSPICIOUS ACTIVITY
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#112D4E] sm:text-3xl">
            Suspicious Activity
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Review flagged transactions, document findings, and forward cases requiring further investigation.
          </p>
        </div>

        {/* STATISTICS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Flagged Cases"
            value={cases.length}
            icon={<Flag size={21} />}
            iconBg="bg-blue-50"
            iconColor="text-[#3F72AF]"
          />

          <StatCard
            title="New Cases"
            value={newCount}
            icon={<AlertTriangle size={21} />}
            iconBg="bg-red-50"
            iconColor="text-red-600"
          />

          <StatCard
            title="Under Review"
            value={reviewCount}
            icon={<Clock size={21} />}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />

          <StatCard
            title="Forwarded to Admin"
            value={forwardedCount}
            icon={<ShieldAlert size={21} />}
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />
        </div>

        {/* HIGH RISK NOTICE */}
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-5">
          <AlertTriangle
            size={22}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div>
            <h3 className="text-sm font-semibold text-red-800">
              High-Risk Cases Require Attention
            </h3>

            <p className="mt-1 text-xs leading-5 text-red-700">
              There are {highRiskCount} high-risk cases in this illustrative dataset.
              Review the available information and forward cases requiring admin investigation.
            </p>
          </div>
        </div>

        {/* CASE MANAGEMENT */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">

          {/* FILTERS */}
          <div className="space-y-4 border-b border-gray-100 p-5 sm:p-6">
            <div>
              <h2 className="font-bold text-[#112D4E]">
                Flagged Cases
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Review and manage suspicious activity reports.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search case, transaction or customer..."
                  className="form-input pl-10"
                />
              </div>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="form-input"
              >
                <option value="All">All Risk Levels</option>
                <option value="High">High Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="Low">Low Risk</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input"
              >
                <option value="All">All Case Statuses</option>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Forwarded to Admin">Forwarded to Admin</option>
              </select>
            </div>

            {(search || riskFilter !== "All" || statusFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setRiskFilter("All");
                  setStatusFilter("All");
                }}
                className="text-xs font-semibold text-[#3F72AF] hover:text-[#112D4E]"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-[#F9F7F7]">
                <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4">Case ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredCases.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-[#F9F7F7]/70"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#112D4E]">
                        {item.id}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {item.transactionId}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#112D4E]">
                        {item.customer}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.customerId}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.reason}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-[#112D4E]">
                      {formatAmount(item.amount)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${riskStyles[item.risk]}`}
                      >
                        {item.risk}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openCase(item)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#DBE2EF] px-3 py-2 text-xs font-semibold text-[#3F72AF] transition hover:bg-[#DBE2EF]/40"
                      >
                        <Eye size={15} />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredCases.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-sm text-gray-500"
                    >
                      No suspicious activity cases found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 px-6 py-4">
            <p className="text-xs text-gray-500">
              Showing {filteredCases.length} of {cases.length} cases
            </p>
          </div>
        </section>

        <p className="text-xs text-gray-400">
          Prototype interface — all suspicious activity records are illustrative mock data. No real fraud detection or investigation is performed.
        </p>
      </div>

      {/* CASE REVIEW MODAL */}
      {selectedCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#112D4E]/50 p-4"
          onClick={() => setSelectedCase(null)}
        >
          <div
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#3F72AF]">
                  Case Review
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#112D4E]">
                  {selectedCase.id}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close case review"
              >
                <X size={20} />
              </button>
            </div>

            {/* CASE STATUS */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${riskStyles[selectedCase.risk]}`}
              >
                {selectedCase.risk} Risk
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedCase.status]}`}
              >
                {selectedCase.status}
              </span>
            </div>

            {/* CUSTOMER */}
            <div className="mt-6 rounded-xl bg-[#F9F7F7] p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#DBE2EF] p-3 text-[#3F72AF]">
                  <UserRound size={22} />
                </div>

                <div>
                  <p className="font-semibold text-[#112D4E]">
                    {selectedCase.customer}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {selectedCase.customerId}
                  </p>
                </div>
              </div>
            </div>

            {/* DETAILS */}
            <div className="mt-6 space-y-4">
              <DetailRow
                icon={<FileText size={17} />}
                label="Transaction ID"
                value={selectedCase.transactionId}
              />

              <DetailRow
                icon={<Wallet size={17} />}
                label="Account Number"
                value={selectedCase.accountNumber}
              />

              <DetailRow
                icon={<ArrowUpRight size={17} />}
                label="Transaction Type"
                value={selectedCase.transactionType}
              />

              <DetailRow
                icon={<Wallet size={17} />}
                label="Transaction Amount"
                value={formatAmount(selectedCase.amount)}
              />

              <DetailRow
                icon={<Clock size={17} />}
                label="Transaction Date"
                value={selectedCase.date}
              />

              <DetailRow
                icon={<Flag size={17} />}
                label="Flagging Reason"
                value={selectedCase.reason}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mt-6 rounded-xl border border-[#DBE2EF] p-4">
              <h3 className="text-sm font-semibold text-[#112D4E]">
                Case Description
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {selectedCase.description}
              </p>
            </div>

            {/* INTERNAL NOTES */}
            <div className="mt-6">
              <label
                htmlFor="review-note"
                className="mb-2 block text-sm font-semibold text-[#112D4E]"
              >
                Internal Review Notes
              </label>

              <textarea
                id="review-note"
                rows={3}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Write your review observations..."
                className="form-input resize-none"
              />

              <p className="mt-1 text-xs text-gray-400">
                Demo only. Notes are kept in local page state.
              </p>
            </div>

            {/* ACTIONS */}
            {selectedCase.status !== "Forwarded to Admin" && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    updateCase(selectedCase.id, {
                      status: "Under Review",
                      notes: reviewNote,
                    })
                  }
                  className="rounded-xl border border-[#DBE2EF] px-4 py-3 text-sm font-semibold text-[#3F72AF] transition hover:bg-[#DBE2EF]/40"
                >
                  <Clock size={16} className="mr-2 inline" />
                  Save & Review
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateCase(selectedCase.id, {
                      status: "Forwarded to Admin",
                      notes: reviewNote,
                    })
                  }
                  className="rounded-xl bg-[#172554] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#112D4E]"
                >
                  <ArrowUpRight size={16} className="mr-2 inline" />
                  Forward to Admin
                </button>
              </div>
            )}

            {selectedCase.status === "Forwarded to Admin" && (
              <div className="mt-6 rounded-xl bg-blue-50 p-4 text-center text-sm font-medium text-[#3F72AF]">
                <CheckCircle2 size={18} className="mr-2 inline" />
                This case has been forwarded to admin.
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedCase(null)}
              className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: number;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-[#112D4E]">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-[#DBE2EF]/50 p-2 text-[#3F72AF]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 break-all text-sm font-medium text-[#112D4E]">
          {value}
        </p>
      </div>
    </div>
  );
}
