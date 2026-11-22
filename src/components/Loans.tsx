"use client";

import { useMemo, useState } from "react";
import { Link } from "@heroui/react";
import {
  Person,
  House,
  Briefcase,
  Calculator,
  ArrowRight,
  CircleCheckFill,
  ShieldCheck,
} from "@gravity-ui/icons";

interface LoanType {
  id: string;
  name: string;
  badge: string;
  description: string;
  defaultPrincipal: number;
  defaultRate: number;
  defaultTenureMonths: number;
  maxAmount: string;
  aprRange: string;
  tenureRange: string;
  icon: React.ComponentType<{ className?: string }>;
  highlights: string[];
}

const loanTypes: LoanType[] = [
  {
    id: "personal",
    name: "Personal Loan",
    badge: "Flexible & Unsecured",
    description:
      "Fast personal financing for planned expenses, education, travel, or debt consolidation with predictable monthly repayments.",
    defaultPrincipal: 15000,
    defaultRate: 9.5,
    defaultTenureMonths: 36,
    maxAmount: "Up to $50,000",
    aprRange: "7.9% – 14.5% APR",
    tenureRange: "12 – 60 months",
    icon: Person,
    highlights: [
      "No collateral required for eligible applicants",
      "Fixed monthly installments with zero hidden charges",
      "Disbursement directly into your Trustora Bank account",
    ],
  },
  {
    id: "home",
    name: "Home Loan",
    badge: "Long-Term Mortgage",
    description:
      "Structured mortgage financing for purchasing or renovating a primary residence with competitive long-term amortization.",
    defaultPrincipal: 180000,
    defaultRate: 6.25,
    defaultTenureMonths: 180,
    maxAmount: "Up to $1,000,000",
    aprRange: "5.75% – 8.25% APR",
    tenureRange: "60 – 360 months",
    icon: House,
    highlights: [
      "Extended repayment schedules for manageable monthly cash flow",
      "Transparent closing schedule and step-by-step approval",
      "Option to make partial principal prepayments",
    ],
  },
  {
    id: "business",
    name: "Business Loan",
    badge: "Growth & Working Capital",
    description:
      "Tailored commercial credit to expand operations, upgrade machinery or looms, manage inventory cycles, and scale cash flow.",
    defaultPrincipal: 75000,
    defaultRate: 8.4,
    defaultTenureMonths: 48,
    maxAmount: "Up to $500,000",
    aprRange: "7.2% – 13.0% APR",
    tenureRange: "12 – 84 months",
    icon: Briefcase,
    highlights: [
      "Built for SMEs, manufacturers, and growing enterprises",
      "Aligned with business revenue and cash-flow cycles",
      "Seamless integration with Trustora Business accounts",
    ],
  },
];

function formatCurrency(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function Loans() {
  const [selectedLoanId, setSelectedLoanId] = useState<string>("personal");
  const [principal, setPrincipal] = useState<number>(15000);
  const [annualRate, setAnnualRate] = useState<number>(9.5);
  const [tenureMonths, setTenureMonths] = useState<number>(36);

  const activeLoan =
    loanTypes.find((loan) => loan.id === selectedLoanId) ?? loanTypes[0];

  const handleSelectLoanType = (loan: LoanType) => {
    setSelectedLoanId(loan.id);
    setPrincipal(loan.defaultPrincipal);
    setAnnualRate(loan.defaultRate);
    setTenureMonths(loan.defaultTenureMonths);
  };

  // Client-side EMI calculation only (no database or API calls)
  const { emi, totalInterest, totalPayable } = useMemo(() => {
    const p = Math.max(0, principal);
    const n = Math.max(1, Math.round(tenureMonths));
    const monthlyRate = Math.max(0, annualRate) / 12 / 100;

    if (p === 0) {
      return { emi: 0, totalInterest: 0, totalPayable: 0 };
    }

    if (monthlyRate === 0) {
      const simpleEmi = p / n;
      return {
        emi: simpleEmi,
        totalInterest: 0,
        totalPayable: p,
      };
    }

    const factor = Math.pow(1 + monthlyRate, n);
    const calculatedEmi = (p * monthlyRate * factor) / (factor - 1);
    const totalAmount = calculatedEmi * n;
    const interestAmount = Math.max(0, totalAmount - p);

    return {
      emi: calculatedEmi,
      totalInterest: interestAmount,
      totalPayable: totalAmount,
    };
  }, [principal, annualRate, tenureMonths]);

  const principalSharePercent =
    totalPayable > 0 ? Math.min(100, Math.round((principal / totalPayable) * 100)) : 100;

  return (
    <section
      id="loans"
      className="w-full bg-[#F9F7F7] py-20 text-[#112D4E] lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* SECTION HEADER */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#DBE2EF] bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#3F72AF]">
            Loans & Credit Solutions
          </span>

          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#112D4E] sm:text-4xl">
            Clear Financing Options & Instant EMI Estimation
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-[#6B7280] sm:text-base">
            Explore Personal, Home, and Business loans under the{" "}
            <span className="font-semibold text-[#112D4E]">
              Trustora Bank
            </span>{" "}
            Advanced Digital Banking Management System, and estimate monthly payments right here in your browser.
          </p>
        </div>

        {/* THREE LOAN TYPES GRID */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {loanTypes.map((loan) => {
            const Icon = loan.icon;
            const isSelected = loan.id === selectedLoanId;

            return (
              <div
                key={loan.id}
                onClick={() => handleSelectLoanType(loan)}
                className={`flex cursor-pointer flex-col justify-between rounded-3xl border p-7 transition-all duration-200 sm:p-8 ${
                  isSelected
                    ? "border-[#3F72AF] bg-[#FCF8E8] ring-2 ring-[#3F72AF]/25 shadow-xl"
                    : "border-[#DBE2EF] bg-white shadow-sm hover:-translate-y-1 hover:border-[#3F72AF]/70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#172554] text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isSelected
                          ? "bg-[#172554] text-[#FCF8E8]"
                          : "bg-[#DBE2EF]/80 text-[#112D4E]"
                      }`}
                    >
                      {loan.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-[#112D4E]">
                    {loan.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">
                    {loan.description}
                  </p>

                  {/* KEY LOAN TERMS */}
                  <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-[#DBE2EF] bg-[#F9F7F7] p-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                        Limit
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-[#112D4E]">
                        {loan.maxAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                        Indicative Rate
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-[#3F72AF]">
                        {loan.aprRange}
                      </p>
                    </div>
                    <div className="col-span-2 border-t border-[#DBE2EF] pt-2.5">
                      <p className="text-[11px] font-medium text-[#6B7280]">
                        Repayment Tenure:{" "}
                        <span className="font-semibold text-[#112D4E]">
                          {loan.tenureRange}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* HIGHLIGHTS */}
                  <ul className="mt-6 space-y-2.5">
                    {loan.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CircleCheckFill className="mt-0.5 h-4 w-4 shrink-0 text-[#3F72AF]" />
                        <span className="text-sm text-[#4B5563]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 border-t border-[#DBE2EF] pt-5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectLoanType(loan);
                    }}
                    className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                      isSelected
                        ? "bg-[#172554] text-white"
                        : "border border-[#172554] bg-white text-[#172554] hover:bg-[#172554] hover:text-white"
                    }`}
                  >
                    {isSelected
                      ? `Loaded in EMI Calculator`
                      : `Simulate ${loan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGE-ONLY EMI CALCULATOR (LOCAL REACT STATE ONLY — NO DATABASE) */}
        <div
          id="emi-calculator"
          className="mt-16 rounded-3xl border border-[#DBE2EF] bg-white p-6 shadow-lg sm:p-10"
        >
          <div className="flex flex-col justify-between gap-4 border-b border-[#DBE2EF] pb-6 md:flex-row md:items-center">
            <div className="flex items-start gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#172554] text-white">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-[#112D4E] sm:text-2xl">
                    Loan EMI Calculator
                  </h3>
                  <span className="rounded-full bg-[#DBE2EF]/80 px-3 py-0.5 text-xs font-semibold text-[#112D4E]">
                    {activeLoan.name} Preset
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#6B7280] sm:text-sm">
                  Instant local calculation on this page only—nothing is saved or sent to any database.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSelectLoanType(activeLoan)}
              className="self-start rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] px-4 py-2 text-xs font-semibold text-[#4B5563] transition-colors hover:border-[#3F72AF] hover:text-[#112D4E] md:self-auto"
            >
              Reset Preset
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* LEFT: INPUT CONTROLS */}
            <div className="space-y-6 lg:col-span-7">
              {/* LOAN AMOUNT */}
              <div>
                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor="loan-principal"
                    className="text-sm font-semibold text-[#112D4E]"
                  >
                    Loan Amount (USD)
                  </label>
                  <input
                    id="loan-principal"
                    type="number"
                    min={500}
                    max={1000000}
                    step={500}
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
                    className="w-36 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] px-3 py-2 text-right text-sm font-bold text-[#112D4E] focus:border-[#3F72AF] focus:outline-none"
                  />
                </div>
                <input
                  type="range"
                  min={1000}
                  max={500000}
                  step={1000}
                  value={Math.min(500000, Math.max(1000, principal))}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  aria-label="Loan Amount Slider"
                  className="mt-3 h-2 w-full cursor-pointer accent-[#172554]"
                />
                <div className="mt-1 flex justify-between text-[11px] text-[#6B7280]">
                  <span>$1,000</span>
                  <span>$250,000</span>
                  <span>$500,000</span>
                </div>
              </div>

              {/* ANNUAL INTEREST RATE */}
              <div>
                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor="loan-rate"
                    className="text-sm font-semibold text-[#112D4E]"
                  >
                    Annual Interest Rate (% p.a.)
                  </label>
                  <input
                    id="loan-rate"
                    type="number"
                    min={0}
                    max={30}
                    step={0.1}
                    value={annualRate}
                    onChange={(e) => setAnnualRate(Number(e.target.value) || 0)}
                    className="w-36 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] px-3 py-2 text-right text-sm font-bold text-[#112D4E] focus:border-[#3F72AF] focus:outline-none"
                  />
                </div>
                <input
                  type="range"
                  min={1}
                  max={24}
                  step={0.1}
                  value={Math.min(24, Math.max(1, annualRate))}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  aria-label="Annual Interest Rate Slider"
                  className="mt-3 h-2 w-full cursor-pointer accent-[#3F72AF]"
                />
                <div className="mt-1 flex justify-between text-[11px] text-[#6B7280]">
                  <span>1.0%</span>
                  <span>12.5%</span>
                  <span>24.0%</span>
                </div>
              </div>

              {/* TENURE IN MONTHS */}
              <div>
                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor="loan-tenure"
                    className="text-sm font-semibold text-[#112D4E]"
                  >
                    Repayment Tenure (Months)
                  </label>
                  <input
                    id="loan-tenure"
                    type="number"
                    min={3}
                    max={360}
                    step={1}
                    value={tenureMonths}
                    onChange={(e) => setTenureMonths(Number(e.target.value) || 1)}
                    className="w-36 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] px-3 py-2 text-right text-sm font-bold text-[#112D4E] focus:border-[#3F72AF] focus:outline-none"
                  />
                </div>
                <input
                  type="range"
                  min={6}
                  max={360}
                  step={6}
                  value={Math.min(360, Math.max(6, tenureMonths))}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  aria-label="Repayment Tenure Slider"
                  className="mt-3 h-2 w-full cursor-pointer accent-[#172554]"
                />
                <div className="mt-1 flex justify-between text-[11px] text-[#6B7280]">
                  <span>6 mos</span>
                  <span>180 mos (15 yrs)</span>
                  <span>360 mos (30 yrs)</span>
                </div>
              </div>
            </div>

            {/* RIGHT: LIVE EMI BREAKDOWN CARD */}
            <div className="flex flex-col justify-between rounded-3xl border border-[#DBE2EF] bg-[#F9F7F7] p-6 sm:p-8 lg:col-span-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#3F72AF]">
                  Estimated Monthly EMI
                </p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#112D4E] sm:text-4xl">
                  {formatCurrency(emi)}
                  <span className="text-sm font-medium text-[#6B7280]">
                    {" "}
                    / month
                  </span>
                </p>

                {/* PRINCIPAL VS INTEREST BAR */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs font-medium text-[#4B5563]">
                    <span>Principal ({principalSharePercent}%)</span>
                    <span>Interest ({100 - principalSharePercent}%)</span>
                  </div>
                  <div className="mt-2 flex h-2.5 w-full overflow-hidden rounded-full bg-[#DBE2EF]">
                    <div
                      style={{ width: `${principalSharePercent}%` }}
                      className="bg-[#172554] transition-all duration-300"
                    />
                    <div className="flex-1 bg-[#3F72AF]" />
                  </div>
                </div>

                {/* SUMMARY ROWS */}
                <div className="mt-6 space-y-3 border-t border-[#DBE2EF] pt-5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#4B5563]">Principal Loan Amount</span>
                    <span className="font-bold text-[#112D4E]">
                      {formatCurrency(principal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#4B5563]">Total Interest Payable</span>
                    <span className="font-bold text-[#3F72AF]">
                      {formatCurrency(totalInterest)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#DBE2EF] pt-3">
                    <span className="font-semibold text-[#112D4E]">
                      Total Repayment Amount
                    </span>
                    <span className="text-base font-extrabold text-[#112D4E]">
                      {formatCurrency(totalPayable)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-7 space-y-3">
                <Link
                  href={`/open-account?loan=${activeLoan.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#172554] px-5 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#112D4E]"
                >
                  <span>Apply for {activeLoan.name}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[#6B7280]">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#3F72AF]" />
                  <span>Illustrative estimate only; final terms depend on eligibility.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}