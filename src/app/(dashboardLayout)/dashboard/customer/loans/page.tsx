
"use client";

import { useMemo, useState } from "react";
import {
  Banknote,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  FileText,
  GraduationCap,
  Home,
  Info,
  Landmark,
  Plus,
  Search,
  ShieldCheck,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

type LoanStatus = "Pending" | "Approved" | "Rejected";

type LoanType =
  | "Personal Loan"
  | "Home Loan"
  | "Business Loan"
  | "Education Loan";

type RepaymentStatus = "Paid" | "Pending" | "Overdue";

type Repayment = {
  installment: number;
  dueDate: string;
  amount: number;
  status: RepaymentStatus;
  paidDate?: string;
};

type Loan = {
  id: string;
  type: LoanType;
  amount: number;
  interestRate: number;
  duration: number;
  monthlyInstallment: number;
  remainingBalance: number;
  paidAmount: number;
  status: LoanStatus;
  applicationDate: string;
  approvalDate?: string;
  nextDueDate?: string;
  purpose: string;
  monthlyIncome: number;
  employmentStatus: string;
  description: string;
  repayments: Repayment[];
};

const initialLoans: Loan[] = [
  {
    id: "LON-2026-001",
    type: "Personal Loan",
    amount: 500000,
    interestRate: 10.5,
    duration: 36,
    monthlyInstallment: 8500,
    remainingBalance: 365000,
    paidAmount: 135000,
    status: "Approved",
    applicationDate: "2026-03-12",
    approvalDate: "2026-03-18",
    nextDueDate: "2026-12-15",
    purpose: "Personal expenses",
    monthlyIncome: 85000,
    employmentStatus: "Employed",
    description: "Personal financing for planned expenses.",
    repayments: [
      {
        installment: 1,
        dueDate: "2026-04-15",
        amount: 8500,
        status: "Paid",
        paidDate: "2026-04-14",
      },
      {
        installment: 2,
        dueDate: "2026-05-15",
        amount: 8500,
        status: "Paid",
        paidDate: "2026-05-15",
      },
      {
        installment: 3,
        dueDate: "2026-06-15",
        amount: 8500,
        status: "Paid",
        paidDate: "2026-06-14",
      },
      {
        installment: 4,
        dueDate: "2026-07-15",
        amount: 8500,
        status: "Paid",
        paidDate: "2026-07-15",
      },
      {
        installment: 5,
        dueDate: "2026-08-15",
        amount: 8500,
        status: "Paid",
        paidDate: "2026-08-14",
      },
      {
        installment: 6,
        dueDate: "2026-09-15",
        amount: 8500,
        status: "Paid",
        paidDate: "2026-09-15",
      },
      {
        installment: 7,
        dueDate: "2026-10-15",
        amount: 8500,
        status: "Paid",
        paidDate: "2026-10-14",
      },
      {
        installment: 8,
        dueDate: "2026-11-15",
        amount: 8500,
        status: "Paid",
        paidDate: "2026-11-15",
      },
      {
        installment: 9,
        dueDate: "2026-12-15",
        amount: 8500,
        status: "Pending",
      },
    ],
  },
  {
    id: "LON-2026-002",
    type: "Business Loan",
    amount: 1200000,
    interestRate: 11,
    duration: 48,
    monthlyInstallment: 31000,
    remainingBalance: 1200000,
    paidAmount: 0,
    status: "Pending",
    applicationDate: "2026-11-18",
    purpose: "Business expansion",
    monthlyIncome: 150000,
    employmentStatus: "Self-employed",
    description: "Funding for business expansion and equipment.",
    repayments: [],
  },
  {
    id: "LON-2026-003",
    type: "Education Loan",
    amount: 800000,
    interestRate: 8.5,
    duration: 48,
    monthlyInstallment: 0,
    remainingBalance: 0,
    paidAmount: 0,
    status: "Rejected",
    applicationDate: "2026-10-02",
    purpose: "Higher education",
    monthlyIncome: 45000,
    employmentStatus: "Employed",
    description: "Funding for higher education expenses.",
    repayments: [],
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const loanIcons: Record<LoanType, React.ReactNode> = {
  "Personal Loan": <Wallet size={20} />,
  "Home Loan": <Home size={20} />,
  "Business Loan": <BriefcaseBusiness size={20} />,
  "Education Loan": <GraduationCap size={20} />,
};

export default function CustomerLoansPage() {
  const [loans, setLoans] = useState(initialLoans);
  const [activeTab, setActiveTab] = useState<
    "All Loans" | "Active" | "Applications"
  >("All Loans");

  const [search, setSearch] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoan, setPaymentLoan] = useState<Loan | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [application, setApplication] = useState({
    type: "Personal Loan" as LoanType,
    amount: "",
    duration: "36",
    monthlyIncome: "",
    employmentStatus: "Employed",
    purpose: "",
    description: "",
  });

  const [formError, setFormError] = useState("");

  const activeLoans = loans.filter(
    (loan) => loan.status === "Approved"
  );

  const pendingLoans = loans.filter(
    (loan) => loan.status === "Pending"
  );

  const totalBorrowed = activeLoans.reduce(
    (total, loan) => total + loan.amount,
    0
  );

  const totalRemaining = activeLoans.reduce(
    (total, loan) => total + loan.remainingBalance,
    0
  );

  const totalPaid = activeLoans.reduce(
    (total, loan) => total + loan.paidAmount,
    0
  );

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const matchesSearch =
        loan.id.toLowerCase().includes(search.toLowerCase()) ||
        loan.type.toLowerCase().includes(search.toLowerCase());

      const matchesTab =
        activeTab === "All Loans" ||
        (activeTab === "Active" && loan.status === "Approved") ||
        (activeTab === "Applications" && loan.status !== "Approved");

      return matchesSearch && matchesTab;
    });
  }, [loans, search, activeTab]);

  const updateApplication = (
    field: keyof typeof application,
    value: string
  ) => {
    setApplication((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const submitApplication = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const amount = Number(application.amount);
    const income = Number(application.monthlyIncome);
    const duration = Number(application.duration);

    if (!application.amount || !application.monthlyIncome) {
      setFormError("Please enter the requested amount and monthly income.");
      return;
    }

    if (amount < 10000 || amount > 10000000) {
      setFormError("Loan amount must be between ৳10,000 and ৳1 crore.");
      return;
    }

    if (income <= 0 || !Number.isFinite(income)) {
      setFormError("Please enter a valid monthly income.");
      return;
    }

    if (!application.purpose.trim() || !application.description.trim()) {
      setFormError("Please provide your loan purpose and description.");
      return;
    }

    const newLoan: Loan = {
      id: `LON-2026-${String(loans.length + 4).padStart(3, "0")}`,
      type: application.type,
      amount,
      interestRate: 10.5,
      duration,
      monthlyInstallment: 0,
      remainingBalance: 0,
      paidAmount: 0,
      status: "Pending",
      applicationDate: "2026-11-22",
      purpose: application.purpose.trim(),
      monthlyIncome: income,
      employmentStatus: application.employmentStatus,
      description: application.description.trim(),
      repayments: [],
    };

    setLoans((previous) => [newLoan, ...previous]);
    setShowApplicationModal(false);
    setApplication({
      type: "Personal Loan",
      amount: "",
      duration: "36",
      monthlyIncome: "",
      employmentStatus: "Employed",
      purpose: "",
      description: "",
    });
    setSuccessMessage("Your loan application has been submitted.");
    setShowSuccess(true);
  };

  const openPayment = (loan: Loan) => {
    setPaymentLoan(loan);
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    if (!paymentLoan) return;

    const updatedLoans = loans.map((loan) => {
      if (loan.id !== paymentLoan.id) return loan;

      const pendingInstallment = loan.repayments.find(
        (repayment) => repayment.status === "Pending"
      );

      if (!pendingInstallment) return loan;

      const updatedRepayments = loan.repayments.map((repayment) =>
        repayment.installment === pendingInstallment.installment
          ? {
              ...repayment,
              status: "Paid" as RepaymentStatus,
              paidDate: "2026-11-22",
            }
          : repayment
      );

      return {
        ...loan,
        paidAmount: loan.paidAmount + pendingInstallment.amount,
        remainingBalance: Math.max(
          0,
          loan.remainingBalance - pendingInstallment.amount
        ),
        repayments: updatedRepayments,
      };
    });

    setLoans(updatedLoans);
    setShowPaymentModal(false);
    setPaymentLoan(null);
    setSuccessMessage("Your demo installment payment was recorded.");
    setShowSuccess(true);
  };

  const nextInstallment = (loan: Loan) =>
    loan.repayments.find((repayment) => repayment.status === "Pending");

  return (
    <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-[#3F72AF]">
              Customer Portal / Loans
            </p>
            <h1 className="text-2xl font-bold text-[#112D4E] sm:text-3xl">
              Loans & Financing
            </h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Manage your loan applications, installments, and repayments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowApplicationModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4168]"
          >
            <Plus size={18} />
            Apply for a Loan
          </button>
        </div>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={<Landmark size={21} />}
            label="Total Borrowed"
            value={formatCurrency(totalBorrowed)}
            description="Across approved loans"
            color="blue"
          />
          <SummaryCard
            icon={<Wallet size={21} />}
            label="Remaining Balance"
            value={formatCurrency(totalRemaining)}
            description="Outstanding loan balance"
            color="amber"
          />
          <SummaryCard
            icon={<CheckCircle2 size={21} />}
            label="Total Repaid"
            value={formatCurrency(totalPaid)}
            description="Installments paid"
            color="green"
          />
          <SummaryCard
            icon={<Clock size={21} />}
            label="Pending Applications"
            value={String(pendingLoans.length)}
            description="Awaiting bank review"
            color="purple"
          />
        </section>

        {/* Active Loan Cards */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#112D4E]">
                Active Loans
              </h2>
              <p className="mt-1 text-xs text-[#6B7280]">
                Overview of your approved loan accounts
              </p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#3F72AF]">
              {activeLoans.length} Active
            </span>
          </div>

          {activeLoans.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {activeLoans.map((loan) => {
                const progress =
                  loan.amount > 0
                    ? Math.min(
                        100,
                        (loan.paidAmount / loan.amount) * 100
                      )
                    : 0;

                const upcoming = nextInstallment(loan);

                return (
                  <div
                    key={loan.id}
                    className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                          {loanIcons[loan.type]}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#112D4E]">
                            {loan.type}
                          </h3>
                          <p className="mt-1 text-xs text-[#9CA3AF]">
                            {loan.id}
                          </p>
                        </div>
                      </div>
                      <LoanStatusBadge status={loan.status} />
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#9CA3AF]">
                          Original Amount
                        </p>
                        <p className="mt-1 text-lg font-bold text-[#112D4E]">
                          {formatCurrency(loan.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#9CA3AF]">
                          Remaining Balance
                        </p>
                        <p className="mt-1 text-lg font-bold text-[#3F72AF]">
                          {formatCurrency(loan.remainingBalance)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-[#6B7280]">
                          Repayment progress
                        </span>
                        <span className="font-bold text-[#112D4E]">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-[#DBE2EF]">
                        <div
                          className="h-full rounded-full bg-[#3F72AF] transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-[#9CA3AF]">
                        <span>Paid: {formatCurrency(loan.paidAmount)}</span>
                        <span>{loan.duration} months</span>
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl bg-[#F9F7F7] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs text-[#6B7280]">
                            Monthly installment
                          </p>
                          <p className="mt-1 font-bold text-[#112D4E]">
                            {formatCurrency(loan.monthlyInstallment)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[#6B7280]">
                            Next due date
                          </p>
                          <p className="mt-1 font-bold text-[#112D4E]">
                            {upcoming
                              ? formatDate(upcoming.dueDate)
                              : "No pending installment"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedLoan(loan)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#DBE2EF] px-4 py-3 text-sm font-semibold text-[#3F72AF] transition hover:bg-blue-50"
                      >
                        <FileText size={16} />
                        View Details
                      </button>

                      <button
                        type="button"
                        disabled={!upcoming}
                        onClick={() => openPayment(loan)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4168] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <CreditCard size={16} />
                        Pay Installment
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState message="You don't have any approved loans yet." />
          )}
        </section>

        {/* Loan Applications and History */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          <div className="border-b border-[#DBE2EF] p-5 sm:p-6">
            <h2 className="font-bold text-[#112D4E]">
              Loan Applications & History
            </h2>
            <p className="mt-1 text-xs text-[#9CA3AF]">
              Track your submitted applications and their current status.
            </p>
          </div>

          <div className="flex flex-col gap-4 border-b border-[#DBE2EF] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex flex-wrap gap-2">
              {(["All Loans", "Active", "Applications"] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                      activeTab === tab
                        ? "bg-[#112D4E] text-white"
                        : "bg-[#F9F7F7] text-[#6B7280] hover:bg-[#DBE2EF]"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search loan ID or type..."
                className="w-full rounded-xl border border-[#DBE2EF] py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#3F72AF]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="bg-[#F9F7F7]">
                <tr className="text-xs uppercase tracking-wide text-[#6B7280]">
                  <th className="px-6 py-4 font-semibold">Loan</th>
                  <th className="px-6 py-4 font-semibold">Requested Amount</th>
                  <th className="px-6 py-4 font-semibold">Duration</th>
                  <th className="px-6 py-4 font-semibold">Application Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredLoans.length > 0 ? (
                  filteredLoans.map((loan) => (
                    <tr
                      key={loan.id}
                      className="transition hover:bg-[#F9FAFB]"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#112D4E]">
                          {loan.type}
                        </p>
                        <p className="mt-1 text-xs text-[#9CA3AF]">
                          {loan.id}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#112D4E]">
                        {formatCurrency(loan.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {loan.duration} months
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {formatDate(loan.applicationDate)}
                      </td>
                      <td className="px-6 py-4">
                        <LoanStatusBadge status={loan.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedLoan(loan)}
                          className="rounded-lg border border-[#DBE2EF] px-3 py-2 text-xs font-semibold text-[#3F72AF] transition hover:bg-blue-50"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <FileText
                        size={32}
                        className="mx-auto text-[#9CA3AF]"
                      />
                      <p className="mt-3 text-sm font-semibold text-[#112D4E]">
                        No matching loan records
                      </p>
                      <p className="mt-1 text-xs text-[#9CA3AF]">
                        Try a different search or tab.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <Info size={18} className="mt-0.5 shrink-0 text-[#3F72AF]" />
          <p className="text-xs leading-5 text-[#4B5563]">
            Loan amounts, approval statuses, repayment schedules, and
            payment actions on this page are illustrative demo data. Actual
            loan decisions and repayments must be processed and verified by
            the bank.
          </p>
        </div>
      </div>

      {/* Apply for Loan Modal */}
      {showApplicationModal && (
        <Modal
          title="Apply for a Loan"
          subtitle="Complete the information below to submit a loan application."
          onClose={() => {
            setShowApplicationModal(false);
            setFormError("");
          }}
        >
          <form onSubmit={submitApplication} className="space-y-4">
            <div>
              <FormLabel>Loan Type</FormLabel>
              <select
                value={application.type}
                onChange={(event) =>
                  updateApplication("type", event.target.value)
                }
                className="form-input"
              >
                <option>Personal Loan</option>
                <option>Home Loan</option>
                <option>Business Loan</option>
                <option>Education Loan</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FormLabel>Requested Amount (BDT)</FormLabel>
                <input
                  type="number"
                  min="10000"
                  max="10000000"
                  value={application.amount}
                  onChange={(event) =>
                    updateApplication("amount", event.target.value)
                  }
                  placeholder="e.g. 500000"
                  className="form-input"
                />
              </div>

              <div>
                <FormLabel>Loan Duration</FormLabel>
                <select
                  value={application.duration}
                  onChange={(event) =>
                    updateApplication("duration", event.target.value)
                  }
                  className="form-input"
                >
                  <option value="12">12 Months</option>
                  <option value="24">24 Months</option>
                  <option value="36">36 Months</option>
                  <option value="48">48 Months</option>
                  <option value="60">60 Months</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FormLabel>Monthly Income (BDT)</FormLabel>
                <input
                  type="number"
                  min="1"
                  value={application.monthlyIncome}
                  onChange={(event) =>
                    updateApplication("monthlyIncome", event.target.value)
                  }
                  placeholder="e.g. 85000"
                  className="form-input"
                />
              </div>

              <div>
                <FormLabel>Employment Status</FormLabel>
                <select
                  value={application.employmentStatus}
                  onChange={(event) =>
                    updateApplication("employmentStatus", event.target.value)
                  }
                  className="form-input"
                >
                  <option>Employed</option>
                  <option>Self-employed</option>
                  <option>Business Owner</option>
                  <option>Student</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <FormLabel>Loan Purpose</FormLabel>
              <input
                type="text"
                value={application.purpose}
                onChange={(event) =>
                  updateApplication("purpose", event.target.value)
                }
                placeholder="What do you need the loan for?"
                className="form-input"
              />
            </div>

            <div>
              <FormLabel>Additional Description</FormLabel>
              <textarea
                rows={3}
                value={application.description}
                onChange={(event) =>
                  updateApplication("description", event.target.value)
                }
                placeholder="Provide additional details about your application..."
                className="form-input resize-none"
              />
            </div>

            {formError && (
              <p className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600">
                {formError}
              </p>
            )}

            <div className="rounded-xl bg-blue-50 p-3">
              <p className="text-xs leading-5 text-[#4B5563]">
                <ShieldCheck
                  size={15}
                  className="mr-1 inline text-[#3F72AF]"
                />
                Your application will be marked as Pending in this demo.
                Actual approval is subject to bank verification.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowApplicationModal(false)}
                className="flex-1 rounded-xl border border-[#DBE2EF] px-4 py-3 text-sm font-semibold text-[#6B7280] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-[#112D4E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1D4168]"
              >
                Submit Application
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Loan Details Modal */}
      {selectedLoan && (
        <Modal
          title="Loan Details"
          subtitle={`${selectedLoan.id} · ${selectedLoan.type}`}
          onClose={() => setSelectedLoan(null)}
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F9F7F7] p-4">
              <div>
                <p className="text-xs text-[#6B7280]">Requested Amount</p>
                <p className="mt-1 text-xl font-bold text-[#112D4E]">
                  {formatCurrency(selectedLoan.amount)}
                </p>
              </div>
              <LoanStatusBadge status={selectedLoan.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DetailItem
                label="Interest Rate"
                value={`${selectedLoan.interestRate}%`}
              />
              <DetailItem
                label="Duration"
                value={`${selectedLoan.duration} months`}
              />
              <DetailItem
                label="Monthly Installment"
                value={
                  selectedLoan.monthlyInstallment
                    ? formatCurrency(selectedLoan.monthlyInstallment)
                    : "Not determined"
                }
              />
              <DetailItem
                label="Remaining Balance"
                value={
                  selectedLoan.status === "Approved"
                    ? formatCurrency(selectedLoan.remainingBalance)
                    : "Not applicable"
                }
              />
              <DetailItem
                label="Application Date"
                value={formatDate(selectedLoan.applicationDate)}
              />
              <DetailItem
                label="Approval Date"
                value={
                  selectedLoan.approvalDate
                    ? formatDate(selectedLoan.approvalDate)
                    : "Not approved"
                }
              />
              <DetailItem
                label="Monthly Income"
                value={formatCurrency(selectedLoan.monthlyIncome)}
              />
              <DetailItem
                label="Employment"
                value={selectedLoan.employmentStatus}
              />
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold text-[#6B7280]">
                Loan Purpose
              </p>
              <p className="text-sm text-[#112D4E]">
                {selectedLoan.purpose}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold text-[#6B7280]">
                Description
              </p>
              <p className="text-sm leading-6 text-[#4B5563]">
                {selectedLoan.description}
              </p>
            </div>

            {selectedLoan.status === "Approved" && (
              <>
                <div className="border-t border-[#DBE2EF] pt-5">
                  <h3 className="font-bold text-[#112D4E]">
                    Repayment Schedule
                  </h3>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Installment dates and payment status
                  </p>
                </div>

                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {selectedLoan.repayments.length > 0 ? (
                    selectedLoan.repayments.map((repayment) => (
                      <div
                        key={repayment.installment}
                        className="flex items-center justify-between gap-3 rounded-xl border border-[#DBE2EF] p-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#112D4E]">
                            Installment #{repayment.installment}
                          </p>
                          <p className="mt-1 text-xs text-[#9CA3AF]">
                            Due {formatDate(repayment.dueDate)}
                          </p>
                          {repayment.paidDate && (
                            <p className="mt-1 text-xs text-emerald-600">
                              Paid {formatDate(repayment.paidDate)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#112D4E]">
                            {formatCurrency(repayment.amount)}
                          </p>
                          <RepaymentBadge status={repayment.status} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No repayment schedule is available." />
                  )}
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => setSelectedLoan(null)}
              className="w-full rounded-xl bg-[#112D4E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1D4168]"
            >
              Close Details
            </button>
          </div>
        </Modal>
      )}

      {/* Payment Confirmation Modal */}
      {showPaymentModal && paymentLoan && (
        <Modal
          title="Confirm Installment Payment"
          subtitle="Review the installment before confirming this demo payment."
          onClose={() => setShowPaymentModal(false)}
        >
          {(() => {
            const installment = nextInstallment(paymentLoan);

            if (!installment) {
              return (
                <div className="space-y-4">
                  <p className="text-sm text-[#6B7280]">
                    No pending installment is available for this loan.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full rounded-xl bg-[#112D4E] px-4 py-3 text-sm font-semibold text-white"
                  >
                    Close
                  </button>
                </div>
              );
            }

            return (
              <div className="space-y-5">
                <div className="rounded-xl bg-[#F9F7F7] p-4">
                  <div className="flex justify-between gap-3">
                    <span className="text-xs text-[#6B7280]">Loan ID</span>
                    <span className="text-xs font-semibold text-[#112D4E]">
                      {paymentLoan.id}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between gap-3">
                    <span className="text-xs text-[#6B7280]">
                      Installment
                    </span>
                    <span className="text-xs font-semibold text-[#112D4E]">
                      #{installment.installment}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between gap-3">
                    <span className="text-xs text-[#6B7280]">Due Date</span>
                    <span className="text-xs font-semibold text-[#112D4E]">
                      {formatDate(installment.dueDate)}
                    </span>
                  </div>
                  <div className="mt-4 border-t border-[#DBE2EF] pt-4">
                    <p className="text-xs text-[#6B7280]">
                      Installment Amount
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#112D4E]">
                      {formatCurrency(installment.amount)}
                    </p>
                  </div>
                </div>

                <p className="text-xs leading-5 text-[#6B7280]">
                  This is a local demo action only. It will update the
                  illustrative repayment history on this page, not transfer
                  real funds.
                </p>

                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 rounded-xl border border-[#DBE2EF] px-4 py-3 text-sm font-semibold text-[#6B7280]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmPayment}
                    className="flex-1 rounded-xl bg-[#112D4E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1D4168]"
                  >
                    Confirm Demo Payment
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#112D4E]/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={30} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#112D4E]">
              Successful
            </h3>
            <p className="mt-2 text-sm text-[#6B7280]">
              {successMessage}
            </p>
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="mt-6 w-full rounded-xl bg-[#112D4E] px-4 py-3 text-sm font-semibold text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .form-input {
          width: 100%;
          border: 1px solid #dbe2ef;
          border-radius: 0.75rem;
          background: white;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: #112d4e;
          outline: none;
        }

        .form-input:focus {
          border-color: #3f72af;
          box-shadow: 0 0 0 2px rgba(63, 114, 175, 0.12);
        }
      `}</style>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  description,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  color: "blue" | "green" | "amber" | "purple";
}) {
  const colors = {
    blue: "bg-blue-50 text-[#3F72AF]",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
      <div className={`inline-flex rounded-xl p-3 ${colors[color]}`}>
        {icon}
      </div>
      <p className="mt-4 text-sm text-[#6B7280]">{label}</p>
      <h3 className="mt-1 text-2xl font-bold text-[#112D4E]">{value}</h3>
      <p className="mt-2 text-xs text-[#9CA3AF]">{description}</p>
    </div>
  );
}

function LoanStatusBadge({ status }: { status: LoanStatus }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${styles[status]}`}
    >
      {status === "Approved" ? (
        <CheckCircle2 size={13} />
      ) : status === "Pending" ? (
        <Clock size={13} />
      ) : (
        <XCircle size={13} />
      )}
      {status}
    </span>
  );
}

function RepaymentBadge({ status }: { status: RepaymentStatus }) {
  const styles = {
    Paid: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Overdue: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-xs font-semibold text-[#4B5563]">
      {children}
    </label>
  );
}

function Modal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#112D4E]/50 p-4">
      <div className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#DBE2EF] bg-white p-5">
          <div>
            <h2 className="font-bold text-[#112D4E]">{title}</h2>
            <p className="mt-1 text-xs text-[#9CA3AF]">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-[#6B7280] hover:bg-gray-100"
          >
            <X size={19} />
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#F9F7F7] p-3">
      <p className="text-[11px] text-[#9CA3AF]">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-[#112D4E]">
        {value}
      </p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#DBE2EF] bg-white px-5 py-12 text-center">
      <Banknote size={32} className="mx-auto text-[#9CA3AF]" />
      <p className="mt-3 text-sm font-semibold text-[#112D4E]">{message}</p>
    </div>
  );
}
