
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Wallet,
  Users,
  FileText,
  CalendarDays,
  CircleDollarSign,
  ArrowUpRight,
  X,
  History,
  ShieldCheck,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

type LoanStatus = "Pending" | "Approved" | "Rejected";
type LoanType = "Personal Loan" | "Home Loan" | "Business Loan" | "Education Loan";

type Repayment = {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: "Paid" | "Pending" | "Overdue";
};

type Loan = {
  id: string;
  customerId: string;
  customer: string;
  email: string;
  phone: string;
  type: LoanType;
  amount: number;
  interestRate: number;
  term: number;
  monthlyPayment: number;
  purpose: string;
  applicationDate: string;
  status: LoanStatus;
  branch: string;
  employment: string;
  income: number;
  repayments: Repayment[];
};

const initialLoans: Loan[] = [
  {
    id: "LN-2026-001",
    customerId: "CUS-2026-001",
    customer: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+880 1712-345678",
    type: "Home Loan",
    amount: 5000000,
    interestRate: 9.5,
    term: 120,
    monthlyPayment: 64700,
    purpose: "Purchase of a residential apartment in Dhaka.",
    applicationDate: "2026-11-18",
    status: "Pending",
    branch: "Dhanmondi Branch",
    employment: "Software Engineer",
    income: 180000,
    repayments: [],
  },
  {
    id: "LN-2026-002",
    customerId: "CUS-2026-002",
    customer: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+880 1812-456789",
    type: "Business Loan",
    amount: 2500000,
    interestRate: 10.5,
    term: 60,
    monthlyPayment: 53700,
    purpose: "Expansion of an existing retail business.",
    applicationDate: "2026-11-17",
    status: "Pending",
    branch: "Gulshan Branch",
    employment: "Business Owner",
    income: 250000,
    repayments: [],
  },
  {
    id: "LN-2026-003",
    customerId: "CUS-2026-003",
    customer: "Emma Williams",
    email: "emma.williams@email.com",
    phone: "+880 1912-567890",
    type: "Personal Loan",
    amount: 500000,
    interestRate: 11,
    term: 36,
    monthlyPayment: 16360,
    purpose: "Personal expenses and family support.",
    applicationDate: "2026-11-15",
    status: "Approved",
    branch: "Uttara Branch",
    employment: "Marketing Manager",
    income: 95000,
    repayments: [
      { id: "RP-001", date: "2026-09-15", amount: 16360, method: "Bank Transfer", status: "Paid" },
      { id: "RP-002", date: "2026-10-15", amount: 16360, method: "Bank Transfer", status: "Paid" },
      { id: "RP-003", date: "2026-11-15", amount: 16360, method: "Bank Transfer", status: "Paid" },
      { id: "RP-004", date: "2026-12-15", amount: 16360, method: "Bank Transfer", status: "Pending" },
    ],
  },
  {
    id: "LN-2026-004",
    customerId: "CUS-2026-004",
    customer: "David Miller",
    email: "david.miller@email.com",
    phone: "+880 1612-678901",
    type: "Education Loan",
    amount: 1200000,
    interestRate: 8.5,
    term: 48,
    monthlyPayment: 29500,
    purpose: "Higher education and university tuition fees.",
    applicationDate: "2026-11-12",
    status: "Rejected",
    branch: "Banani Branch",
    employment: "Accountant",
    income: 65000,
    repayments: [],
  },
  {
    id: "LN-2026-005",
    customerId: "CUS-2026-005",
    customer: "Olivia Brown",
    email: "olivia.brown@email.com",
    phone: "+880 1712-789012",
    type: "Personal Loan",
    amount: 350000,
    interestRate: 11.5,
    term: 24,
    monthlyPayment: 16400,
    purpose: "Home renovation and personal expenses.",
    applicationDate: "2026-11-10",
    status: "Pending",
    branch: "Mirpur Branch",
    employment: "Teacher",
    income: 55000,
    repayments: [],
  },
  {
    id: "LN-2026-006",
    customerId: "CUS-2026-006",
    customer: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+880 1812-890123",
    type: "Business Loan",
    amount: 1800000,
    interestRate: 10,
    term: 60,
    monthlyPayment: 38250,
    purpose: "Working capital for a small manufacturing business.",
    applicationDate: "2026-11-08",
    status: "Approved",
    branch: "Mohakhali Branch",
    employment: "Business Owner",
    income: 200000,
    repayments: [
      { id: "RP-005", date: "2026-09-08", amount: 38250, method: "Bank Transfer", status: "Paid" },
      { id: "RP-006", date: "2026-10-08", amount: 38250, method: "Bank Transfer", status: "Overdue" },
      { id: "RP-007", date: "2026-11-08", amount: 38250, method: "Bank Transfer", status: "Paid" },
    ],
  },
];

const formatMoney = (amount: number) =>
  `৳${amount.toLocaleString("en-BD")}`;

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function StatusBadge({ status }: { status: LoanStatus }) {
  const styles: Record<LoanStatus, string> = {
    Pending: "bg-amber-50 text-amber-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-rose-50 text-rose-700",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${styles[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${
        status === "Pending"
          ? "bg-amber-500"
          : status === "Approved"
          ? "bg-emerald-500"
          : "bg-rose-500"
      }`} />
      {status}
    </span>
  );
}

function RepaymentBadge({ status }: { status: Repayment["status"] }) {
  const styles = {
    Paid: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Overdue: "bg-rose-50 text-rose-700",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function AdminLoanManagementPage() {
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "repayments">("details");
  const [confirmation, setConfirmation] = useState<{
    loanId: string;
    action: "Approved" | "Rejected";
  } | null>(null);
  const [notice, setNotice] = useState("");

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const searchTerm = search.toLowerCase();

      const matchesSearch =
        loan.customer.toLowerCase().includes(searchTerm) ||
        loan.id.toLowerCase().includes(searchTerm) ||
        loan.customerId.toLowerCase().includes(searchTerm) ||
        loan.email.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" || loan.status === statusFilter;

      const matchesType =
        typeFilter === "All" || loan.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [loans, search, statusFilter, typeFilter]);

  const pendingCount = loans.filter((loan) => loan.status === "Pending").length;
  const approvedCount = loans.filter((loan) => loan.status === "Approved").length;
  const rejectedCount = loans.filter((loan) => loan.status === "Rejected").length;

  const totalLoanAmount = loans
    .filter((loan) => loan.status === "Approved")
    .reduce((total, loan) => total + loan.amount, 0);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const handleDecision = () => {
    if (!confirmation) return;

    const { loanId, action } = confirmation;

    setLoans((previous) =>
      previous.map((loan) =>
        loan.id === loanId ? { ...loan, status: action } : loan
      )
    );

    if (selectedLoan?.id === loanId) {
      setSelectedLoan({ ...selectedLoan, status: action });
    }

    showNotice(`Loan application ${action.toLowerCase()} successfully.`);
    setConfirmation(null);
  };

  const openDetails = (loan: Loan) => {
    setSelectedLoan(loan);
    setActiveTab("details");
  };

  return (
    <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-[#3F72AF]">
              Administration / Loan Management
            </p>
            <h1 className="text-2xl font-bold text-[#112D4E] sm:text-3xl">
              Loan Management
            </h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Review loan applications, manage decisions, and monitor repayments.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#DBE2EF] bg-white px-4 py-3 text-sm text-[#6B7280]">
            <ShieldCheck size={17} className="text-[#3F72AF]" />
            Administrator Access
          </div>
        </div>

        {/* Notice */}
        {notice && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={18} />
            {notice}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText size={21} />
              </div>
              <span className="text-xs font-medium text-[#9CA3AF]">All applications</span>
            </div>
            <p className="mt-5 text-2xl font-bold text-[#112D4E]">{loans.length}</p>
            <p className="mt-1 text-sm text-[#6B7280]">Total Applications</p>
          </div>

          <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock size={21} />
              </div>
              <span className="text-xs font-medium text-amber-600">Needs review</span>
            </div>
            <p className="mt-5 text-2xl font-bold text-[#112D4E]">{pendingCount}</p>
            <p className="mt-1 text-sm text-[#6B7280]">Pending Applications</p>
          </div>

          <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={21} />
              </div>
              <span className="text-xs font-medium text-emerald-600">Accepted</span>
            </div>
            <p className="mt-5 text-2xl font-bold text-[#112D4E]">{approvedCount}</p>
            <p className="mt-1 text-sm text-[#6B7280]">Approved Loans</p>
          </div>

          <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Wallet size={21} />
              </div>
              <span className="text-xs font-medium text-[#9CA3AF]">Approved amount</span>
            </div>
            <p className="mt-5 text-2xl font-bold text-[#112D4E]">
              {formatMoney(totalLoanAmount)}
            </p>
            <p className="mt-1 text-sm text-[#6B7280]">Total Approved Value</p>
          </div>
        </div>

        {/* Loan Applications */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          <div className="border-b border-[#DBE2EF] p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-lg font-bold text-[#112D4E]">
                  Loan Applications
                </h2>
                <p className="mt-1 text-xs text-[#6B7280]">
                  Review and manage customer loan requests.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search customer or loan ID..."
                    className="h-11 w-full rounded-xl border border-[#DBE2EF] bg-white pl-10 pr-4 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF] sm:w-64"
                  />
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-[#DBE2EF] bg-white pl-4 pr-9 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF] sm:w-36"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                </div>

                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-[#DBE2EF] bg-white pl-4 pr-9 text-sm text-[#112D4E] outline-none focus:border-[#3F72AF] sm:w-44"
                  >
                    <option value="All">All Loan Types</option>
                    <option value="Personal Loan">Personal</option>
                    <option value="Home Loan">Home</option>
                    <option value="Business Loan">Business</option>
                    <option value="Education Loan">Education</option>
                  </select>
                  <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-[#F9FAFB]">
                <tr className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  <th className="px-6 py-4">Application</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Loan Type</th>
                  <th className="px-6 py-4">Loan Amount</th>
                  <th className="px-6 py-4">Application Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#DBE2EF]">
                {filteredLoans.map((loan) => (
                  <tr key={loan.id} className="transition hover:bg-[#F9FAFB]">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#112D4E]">{loan.id}</p>
                      <p className="mt-1 text-xs text-[#9CA3AF]">{loan.customerId}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#112D4E]">{loan.customer}</p>
                      <p className="mt-1 text-xs text-[#9CA3AF]">{loan.email}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-[#4B5563]">{loan.type}</span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#112D4E]">{formatMoney(loan.amount)}</p>
                      <p className="mt-1 text-xs text-[#9CA3AF]">{loan.interestRate}% interest</p>
                    </td>

                    <td className="px-6 py-4 text-sm text-[#4B5563]">
                      {formatDate(loan.applicationDate)}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={loan.status} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openDetails(loan)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#DBE2EF] px-3 py-2 text-xs font-semibold text-[#3F72AF] transition hover:border-[#3F72AF] hover:bg-blue-50"
                      >
                        <Eye size={15} />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredLoans.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-14 text-center">
                      <FileText size={30} className="mx-auto text-[#9CA3AF]" />
                      <p className="mt-3 text-sm font-semibold text-[#112D4E]">
                        No loan applications found
                      </p>
                      <p className="mt-1 text-xs text-[#6B7280]">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-between gap-2 border-t border-[#DBE2EF] px-6 py-4 text-xs text-[#6B7280] sm:flex-row sm:items-center">
            <span>
              Showing {filteredLoans.length} of {loans.length} applications
            </span>
            <span>{rejectedCount} rejected applications</span>
          </div>
        </section>

        <p className="text-center text-xs text-[#9CA3AF]">
          Illustrative demo data only. Loan decisions and repayment records are not saved to a database.
        </p>
      </div>

      {/* Application Details Modal */}
      {selectedLoan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#112D4E]/50 p-3 sm:p-6"
          onClick={() => setSelectedLoan(null)}
        >
          <div
            className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#DBE2EF] p-5 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#3F72AF]">
                  Loan Application Review
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#112D4E]">
                  {selectedLoan.id}
                </h2>
                <div className="mt-2">
                  <StatusBadge status={selectedLoan.status} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLoan(null)}
                className="rounded-lg p-2 text-[#6B7280] transition hover:bg-[#F9F7F7] hover:text-[#112D4E]"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#DBE2EF] px-5 sm:px-6">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                  activeTab === "details"
                    ? "border-[#3F72AF] text-[#3F72AF]"
                    : "border-transparent text-[#6B7280] hover:text-[#112D4E]"
                }`}
              >
                <FileText size={16} />
                Application Details
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("repayments")}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                  activeTab === "repayments"
                    ? "border-[#3F72AF] text-[#3F72AF]"
                    : "border-transparent text-[#6B7280] hover:text-[#112D4E]"
                }`}
              >
                <History size={16} />
                Repayment History
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-5 sm:p-6">
              {activeTab === "details" ? (
                <div className="space-y-6">
                  {/* Loan Summary */}
                  <div className="rounded-xl bg-[#112D4E] p-5 text-white">
                    <p className="text-xs text-blue-200">Requested Loan Amount</p>
                    <p className="mt-2 text-3xl font-bold">
                      {formatMoney(selectedLoan.amount)}
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-blue-200">Interest Rate</p>
                        <p className="mt-1 text-sm font-semibold">{selectedLoan.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-200">Loan Term</p>
                        <p className="mt-1 text-sm font-semibold">{selectedLoan.term} months</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-200">Monthly Payment</p>
                        <p className="mt-1 text-sm font-semibold">{formatMoney(selectedLoan.monthlyPayment)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <h3 className="mb-3 text-sm font-bold text-[#112D4E]">
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#DBE2EF] p-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-[#9CA3AF]">Full Name</p>
                        <p className="mt-1 text-sm font-semibold text-[#112D4E]">{selectedLoan.customer}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#9CA3AF]">Customer ID</p>
                        <p className="mt-1 text-sm font-semibold text-[#112D4E]">{selectedLoan.customerId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#9CA3AF]">Email Address</p>
                        <p className="mt-1 break-all text-sm font-semibold text-[#112D4E]">{selectedLoan.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#9CA3AF]">Phone Number</p>
                        <p className="mt-1 text-sm font-semibold text-[#112D4E]">{selectedLoan.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Application Information */}
                  <div>
                    <h3 className="mb-3 text-sm font-bold text-[#112D4E]">
                      Application Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#DBE2EF] p-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-[#9CA3AF]">Loan Type</p>
                        <p className="mt-1 text-sm font-semibold text-[#112D4E]">{selectedLoan.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#9CA3AF]">Application Date</p>
                        <p className="mt-1 text-sm font-semibold text-[#112D4E]">{formatDate(selectedLoan.applicationDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#9CA3AF]">Employment</p>
                        <p className="mt-1 text-sm font-semibold text-[#112D4E]">{selectedLoan.employment}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#9CA3AF]">Monthly Income</p>
                        <p className="mt-1 text-sm font-semibold text-[#112D4E]">{formatMoney(selectedLoan.income)}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs text-[#9CA3AF]">Assigned Branch</p>
                        <p className="mt-1 text-sm font-semibold text-[#112D4E]">{selectedLoan.branch}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs text-[#9CA3AF]">Loan Purpose</p>
                        <p className="mt-1 text-sm leading-relaxed text-[#4B5563]">{selectedLoan.purpose}</p>
                      </div>
                    </div>
                  </div>

                  {selectedLoan.status === "Pending" && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-start gap-2 text-amber-800">
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold">Decision Required</p>
                          <p className="mt-1 text-xs leading-relaxed">
                            Review the customer's information and loan details before making a decision.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-[#112D4E]">Repayment History</h3>
                      <p className="mt-1 text-xs text-[#6B7280]">
                        Recorded installment payments for this loan.
                      </p>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                      <History size={20} />
                    </div>
                  </div>

                  {selectedLoan.repayments.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-[#DBE2EF]">
                      <table className="w-full min-w-[520px] text-left">
                        <thead className="bg-[#F9FAFB]">
                          <tr className="text-xs font-semibold uppercase text-[#6B7280]">
                            <th className="px-4 py-3">Payment ID</th>
                            <th className="px-4 py-3">Due Date</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Method</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DBE2EF]">
                          {selectedLoan.repayments.map((repayment) => (
                            <tr key={repayment.id}>
                              <td className="px-4 py-4 text-xs font-semibold text-[#112D4E]">{repayment.id}</td>
                              <td className="px-4 py-4 text-xs text-[#4B5563]">{formatDate(repayment.date)}</td>
                              <td className="px-4 py-4 text-xs font-semibold text-[#112D4E]">{formatMoney(repayment.amount)}</td>
                              <td className="px-4 py-4 text-xs text-[#4B5563]">{repayment.method}</td>
                              <td className="px-4 py-4"><RepaymentBadge status={repayment.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-[#DBE2EF] px-5 py-12 text-center">
                      <History size={30} className="mx-auto text-[#9CA3AF]" />
                      <p className="mt-3 text-sm font-semibold text-[#112D4E]">
                        No repayment records
                      </p>
                      <p className="mt-1 text-xs text-[#6B7280]">
                        No repayment history is available for this application.
                      </p>
                    </div>
                  )}

                  <div className="mt-4 rounded-xl bg-[#F9FAFB] p-4">
                    <p className="text-xs text-[#6B7280]">Recorded Installments</p>
                    <p className="mt-1 text-lg font-bold text-[#112D4E]">
                      {selectedLoan.repayments.length}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#DBE2EF] p-5 sm:flex-row sm:items-center sm:p-6">
              <button
                type="button"
                onClick={() => setSelectedLoan(null)}
                className="rounded-xl border border-[#DBE2EF] px-5 py-2.5 text-sm font-semibold text-[#4B5563] transition hover:bg-[#F9F7F7]"
              >
                Close
              </button>

              {selectedLoan.status === "Pending" && activeTab === "details" && (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmation({
                        loanId: selectedLoan.id,
                        action: "Rejected",
                      })
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-5 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    <XCircle size={17} />
                    Reject Application
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setConfirmation({
                        loanId: selectedLoan.id,
                        action: "Approved",
                      })
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <CheckCircle2 size={17} />
                    Approve Loan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Decision Confirmation Modal */}
      {confirmation && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#112D4E]/50 p-4"
          onClick={() => setConfirmation(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
              confirmation.action === "Approved"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            }`}>
              {confirmation.action === "Approved" ? (
                <CheckCircle2 size={28} />
              ) : (
                <XCircle size={28} />
              )}
            </div>

            <h3 className="mt-4 text-center text-lg font-bold text-[#112D4E]">
              {confirmation.action === "Approved"
                ? "Approve Loan Application?"
                : "Reject Loan Application?"}
            </h3>

            <p className="mt-2 text-center text-sm leading-relaxed text-[#6B7280]">
              {confirmation.action === "Approved"
                ? "Are you sure you want to approve this loan application? This will update its status in this demo."
                : "Are you sure you want to reject this loan application? This will update its status in this demo."}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmation(null)}
                className="flex-1 rounded-xl border border-[#DBE2EF] px-4 py-3 text-sm font-semibold text-[#4B5563] hover:bg-[#F9F7F7]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDecision}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
                  confirmation.action === "Approved"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                Confirm {confirmation.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
