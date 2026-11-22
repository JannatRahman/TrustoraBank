
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  FileText,
  UserRound,
  Mail,
  Phone,
} from "lucide-react";

type KYCStatus = "Pending" | "Verified" | "Needs Update";

type KYCRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  submittedDate: string;
  status: KYCStatus;
};

const initialRecords: KYCRecord[] = [
  {
    id: "CUS-1001",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+880 1712-345678",
    documentType: "National ID",
    documentNumber: "•••• •••• 4582",
    submittedDate: "Nov 20, 2026",
    status: "Pending",
  },
  {
    id: "CUS-1002",
    name: "Michael Chen",
    email: "michael@example.com",
    phone: "+880 1812-456789",
    documentType: "Passport",
    documentNumber: "••••••• 8921",
    submittedDate: "Nov 19, 2026",
    status: "Verified",
  },
  {
    id: "CUS-1003",
    name: "Emma Williams",
    email: "emma@example.com",
    phone: "+880 1912-567890",
    documentType: "National ID",
    documentNumber: "•••• •••• 6721",
    submittedDate: "Nov 18, 2026",
    status: "Pending",
  },
  {
    id: "CUS-1004",
    name: "David Miller",
    email: "david@example.com",
    phone: "+880 1612-678901",
    documentType: "Driving License",
    documentNumber: "•••••• 3215",
    submittedDate: "Nov 17, 2026",
    status: "Needs Update",
  },
  {
    id: "CUS-1005",
    name: "Olivia Brown",
    email: "olivia@example.com",
    phone: "+880 1512-789012",
    documentType: "National ID",
    documentNumber: "•••• •••• 9146",
    submittedDate: "Nov 16, 2026",
    status: "Verified",
  },
  {
    id: "CUS-1006",
    name: "James Wilson",
    email: "james@example.com",
    phone: "+880 1312-890123",
    documentType: "Passport",
    documentNumber: "••••••• 7824",
    submittedDate: "Nov 15, 2026",
    status: "Pending",
  },
];

const statusStyles: Record<KYCStatus, string> = {
  Pending: "bg-amber-50 text-amber-700",
  Verified: "bg-green-50 text-green-700",
  "Needs Update": "bg-red-50 text-red-700",
};

export default function KYCVerificationPage() {
  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState<KYCRecord | null>(null);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const searchMatch =
        record.name.toLowerCase().includes(search.toLowerCase()) ||
        record.email.toLowerCase().includes(search.toLowerCase()) ||
        record.id.toLowerCase().includes(search.toLowerCase());

      const statusMatch =
        filter === "All" || record.status === filter;

      return searchMatch && statusMatch;
    });
  }, [records, search, filter]);

  const pendingCount = records.filter(
    (record) => record.status === "Pending"
  ).length;

  const verifiedCount = records.filter(
    (record) => record.status === "Verified"
  ).length;

  const needsUpdateCount = records.filter(
    (record) => record.status === "Needs Update"
  ).length;

  const updateStatus = (id: string, status: KYCStatus) => {
    setRecords((previous) =>
      previous.map((record) =>
        record.id === id ? { ...record, status } : record
      )
    );

    setSelectedRecord(null);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* HEADER */}
        <div>
          <p className="text-sm font-medium text-[#3F72AF]">
            BANKING STAFF / KYC VERIFICATION
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#112D4E] sm:text-3xl">
            KYC Verification
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Review customer identity information and manage verification requests.
          </p>
        </div>

        {/* STATISTICS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Applications"
            value={records.length}
            icon={<FileText size={21} />}
            iconBg="bg-blue-50"
            iconColor="text-[#3F72AF]"
          />

          <StatCard
            title="Pending Review"
            value={pendingCount}
            icon={<Clock size={21} />}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />

          <StatCard
            title="Verified"
            value={verifiedCount}
            icon={<CheckCircle2 size={21} />}
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />

          <StatCard
            title="Needs Update"
            value={needsUpdateCount}
            icon={<AlertCircle size={21} />}
            iconBg="bg-red-50"
            iconColor="text-red-600"
          />
        </div>

        {/* KYC TABLE */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">

          {/* TABLE HEADER */}
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:p-6">
            <div>
              <h2 className="font-bold text-[#112D4E]">
                Customer Verification Requests
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Review submitted customer identity information.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email or customer ID..."
                  className="form-input pl-10"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="form-input sm:w-48"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Needs Update">Needs Update</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-[#F9F7F7]">
                <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Document Type</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="transition hover:bg-[#F9F7F7]/70"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#112D4E]">
                        {record.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {record.id}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {record.email}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-700">
                        {record.documentType}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {record.documentNumber}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.submittedDate}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[record.status]}`}
                      >
                        {record.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(record)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#DBE2EF] px-3 py-2 text-xs font-semibold text-[#3F72AF] transition hover:bg-[#DBE2EF]/40"
                      >
                        <Eye size={15} />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredRecords.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-sm text-gray-500"
                    >
                      No verification requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 px-6 py-4">
            <p className="text-xs text-gray-500">
              Showing {filteredRecords.length} of {records.length} applications
            </p>
          </div>
        </section>

        <p className="text-xs text-gray-400">
          Prototype interface — customer information and verification statuses are illustrative mock data. No real identity documents are stored or verified.
        </p>
      </div>

      {/* REVIEW MODAL */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#112D4E]/50 p-4"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#3F72AF]">
                  KYC Review
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#112D4E]">
                  Customer Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close review"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-xl bg-[#F9F7F7] p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DBE2EF] text-[#3F72AF]">
                <UserRound size={23} />
              </div>

              <div>
                <h3 className="font-semibold text-[#112D4E]">
                  {selectedRecord.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {selectedRecord.id}
                </p>
              </div>

              <span
                className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedRecord.status]}`}
              >
                {selectedRecord.status}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <DetailRow
                icon={<Mail size={17} />}
                label="Email Address"
                value={selectedRecord.email}
              />

              <DetailRow
                icon={<Phone size={17} />}
                label="Phone Number"
                value={selectedRecord.phone}
              />

              <DetailRow
                icon={<FileText size={17} />}
                label="Document Type"
                value={selectedRecord.documentType}
              />

              <DetailRow
                icon={<ShieldCheck size={17} />}
                label="Document Number"
                value={selectedRecord.documentNumber}
              />

              <DetailRow
                icon={<Clock size={17} />}
                label="Submission Date"
                value={selectedRecord.submittedDate}
              />
            </div>

            {/* DOCUMENT PLACEHOLDER */}
            <div className="mt-6 rounded-xl border border-dashed border-[#DBE2EF] bg-[#F9F7F7] p-5 text-center">
              <FileText
                size={28}
                className="mx-auto text-[#3F72AF]"
              />
              <p className="mt-2 text-sm font-semibold text-[#112D4E]">
                Identity Document Preview
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Sample placeholder — no actual document has been uploaded.
              </p>
            </div>

            {/* REVIEW ACTIONS */}
            {selectedRecord.status !== "Verified" && (
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    updateStatus(selectedRecord.id, "Needs Update")
                  }
                  className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Request Resubmission
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateStatus(selectedRecord.id, "Verified")
                  }
                  className="rounded-xl bg-[#172554] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#112D4E]"
                >
                  Mark as Verified
                </button>
              </div>
            )}

            {selectedRecord.status === "Verified" && (
              <div className="mt-7 rounded-xl bg-green-50 p-4 text-center text-sm font-medium text-green-700">
                <CheckCircle2 size={18} className="mr-2 inline" />
                This customer's KYC is already verified.
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedRecord(null)}
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
  icon: React.ReactNode;
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
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-[#DBE2EF]/50 p-2 text-[#3F72AF]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 break-all text-sm font-medium text-[#112D4E]">
          {value}
        </p>
      </div>
    </div>
  );
}
