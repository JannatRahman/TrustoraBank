
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
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
  icon: ComponentType<{ className?: string }>;
  highlights: string[];
}

const loanTypes: LoanType[] = [
  {
    id: "personal",
    name: "Personal Loan",
    badge: "Flexible financing",
    description:
      "Finance important plans, unexpected expenses, education, or travel with predictable repayments.",
    defaultPrincipal: 15000,
    defaultRate: 9.5,
    defaultTenureMonths: 36,
    maxAmount: "Up to $50,000",
    aprRange: "7.9% – 14.5%",
    tenureRange: "12 – 60 months",
    icon: Person,
    highlights: [
      "No collateral for eligible applicants",
      "Predictable monthly installments",
      "Direct account disbursement",
    ],
  },
  {
    id: "home",
    name: "Home Loan",
    badge: "Long-term financing",
    description:
      "Take the next step towards home ownership with structured financing and flexible repayment periods.",
    defaultPrincipal: 180000,
    defaultRate: 6.25,
    defaultTenureMonths: 180,
    maxAmount: "Up to $1,000,000",
    aprRange: "5.75% – 8.25%",
    tenureRange: "60 – 360 months",
    icon: House,
    highlights: [
      "Extended repayment schedules",
      "Transparent approval process",
      "Partial principal prepayments",
    ],
  },
  {
    id: "business",
    name: "Business Loan",
    badge: "Built for growth",
    description:
      "Support working capital, equipment, inventory, and the next stage of your business.",
    defaultPrincipal: 75000,
    defaultRate: 8.4,
    defaultTenureMonths: 48,
    maxAmount: "Up to $500,000",
    aprRange: "7.2% – 13.0%",
    tenureRange: "12 – 84 months",
    icon: Briefcase,
    highlights: [
      "Designed for growing businesses",
      "Financing aligned with cash flow",
      "Business account integration",
    ],
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -35px 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 700ms ease ${delay}ms, transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Loans() {
  const [selectedLoanId, setSelectedLoanId] = useState("personal");
  const [principal, setPrincipal] = useState(15000);
  const [annualRate, setAnnualRate] = useState(9.5);
  const [tenureMonths, setTenureMonths] = useState(36);

  const activeLoan =
    loanTypes.find((loan) => loan.id === selectedLoanId) ?? loanTypes[0];

  const handleSelectLoanType = (loan: LoanType) => {
    setSelectedLoanId(loan.id);
    setPrincipal(loan.defaultPrincipal);
    setAnnualRate(loan.defaultRate);
    setTenureMonths(loan.defaultTenureMonths);
  };

  const { emi, totalInterest, totalPayable } = useMemo(() => {
    const p = Math.max(0, principal);
    const n = Math.max(1, Math.round(tenureMonths));
    const monthlyRate = Math.max(0, annualRate) / 1200;

    if (p === 0) {
      return { emi: 0, totalInterest: 0, totalPayable: 0 };
    }

    if (monthlyRate === 0) {
      return {
        emi: p / n,
        totalInterest: 0,
        totalPayable: p,
      };
    }

    const factor = Math.pow(1 + monthlyRate, n);
    const monthlyPayment = (p * monthlyRate * factor) / (factor - 1);
    const total = monthlyPayment * n;

    return {
      emi: monthlyPayment,
      totalInterest: Math.max(0, total - p),
      totalPayable: total,
    };
  }, [principal, annualRate, tenureMonths]);

  const principalShare =
    totalPayable > 0
      ? Math.min(100, (principal / totalPayable) * 100)
      : 100;

  return (
    <section
      id="loans"
      className="w-full scroll-mt-24 bg-[#F9F7F7] py-20 text-[#112D4E] sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* INTRODUCTION */}
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DBE2EF] bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#3F72AF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3F72AF]" />
              Financing made clearer
            </span>

            <h2 className="mt-6 text-3xl font-semibold leading-[1.15] tracking-tight text-[#112D4E] sm:text-4xl lg:text-5xl">
              The right financing.
              <span className="block text-[#3F72AF]">
                A clearer way forward.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6B7280] sm:text-base">
              Whether you are planning something personal, buying a home, or
              growing a business, explore financing options designed around
              your goals.
            </p>
          </div>
        </Reveal>

        {/* LOAN OPTIONS */}
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {loanTypes.map((loan, index) => {
            const Icon = loan.icon;
            const isSelected = loan.id === selectedLoanId;

            return (
              <Reveal key={loan.id} delay={index * 100}>
                <article
                  className={`group flex h-full flex-col rounded-3xl border p-6 transition-all duration-300 sm:p-7 ${
                    isSelected
                      ? "border-[#3F72AF] bg-white shadow-[0_18px_50px_-28px_rgba(17,45,78,0.35)]"
                      : "border-[#DBE2EF] bg-white hover:-translate-y-1 hover:border-[#9BB6D8] hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300 ${
                        isSelected
                          ? "bg-[#172554] text-white"
                          : "bg-[#DBE2EF]/70 text-[#172554] group-hover:bg-[#172554] group-hover:text-white"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="rounded-full bg-[#F3F6FA] px-3 py-1.5 text-[10px] font-semibold tracking-wide text-[#526782]">
                      {loan.badge}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-semibold tracking-tight text-[#112D4E]">
                    {loan.name}
                  </h3>

                  <p className="mt-3 min-h-[66px] text-sm leading-6 text-[#6B7280]">
                    {loan.description}
                  </p>

                  <div className="mt-6 space-y-4 border-y border-[#E8EDF4] py-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-[#7B8798]">
                        Financing limit
                      </span>
                      <span className="text-sm font-semibold text-[#112D4E]">
                        {loan.maxAmount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-[#7B8798]">
                        Indicative APR
                      </span>
                      <span className="text-sm font-semibold text-[#3F72AF]">
                        {loan.aprRange}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-[#7B8798]">
                        Repayment period
                      </span>
                      <span className="text-sm font-semibold text-[#112D4E]">
                        {loan.tenureRange}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {loan.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-2.5"
                      >
                        <CircleCheckFill className="mt-0.5 h-4 w-4 shrink-0 text-[#3F72AF]" />
                        <span className="text-xs leading-5 text-[#526174]">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => handleSelectLoanType(loan)}
                    aria-pressed={isSelected}
                    className={`mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F72AF] focus-visible:ring-offset-2 ${
                      isSelected
                        ? "bg-[#172554] text-white hover:bg-[#263D70]"
                        : "border border-[#DBE2EF] bg-white text-[#172554] hover:border-[#3F72AF] hover:bg-[#F5F8FC]"
                    }`}
                  >
                    {isSelected ? "Selected for estimate" : "Explore this loan"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* EMI CALCULATOR */}
        <Reveal>
          <div
            id="emi-calculator"
            className="mt-20 scroll-mt-28 overflow-hidden rounded-3xl border border-[#DBE2EF] bg-white shadow-[0_20px_60px_-40px_rgba(17,45,78,0.35)] sm:mt-24"
          >
            <div className="border-b border-[#E8EDF4] px-6 py-7 sm:px-9 sm:py-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#172554] text-white">
                    <Calculator className="h-6 w-6" />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#3F72AF]">
                      Plan with confidence
                    </span>
                    <h3 className="mt-1 text-xl font-semibold tracking-tight text-[#112D4E] sm:text-2xl">
                      Loan repayment calculator
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#7B8798]">
                      Adjust the figures to estimate your monthly repayment.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectLoanType(activeLoan)}
                  className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-[#DBE2EF] px-4 py-2.5 text-xs font-semibold text-[#526174] transition-colors hover:border-[#3F72AF] hover:text-[#172554] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F72AF]"
                >
                  Reset to preset
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* INPUTS */}
              <div className="space-y-8 px-6 py-8 sm:px-9 lg:col-span-7 lg:py-10">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#7B8798]">
                    Selected financing
                  </p>
                  <span className="rounded-full bg-[#EDF3FA] px-3 py-1.5 text-xs font-semibold text-[#3F72AF]">
                    {activeLoan.name}
                  </span>
                </div>

                {/* AMOUNT */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label
                      htmlFor="loan-principal"
                      className="text-sm font-semibold text-[#112D4E]"
                    >
                      Loan amount
                    </label>
                    <div className="flex items-center rounded-lg border border-[#DBE2EF] bg-[#F9FAFC] px-3">
                      <span className="text-sm text-[#7B8798]">$</span>
                      <input
                        id="loan-principal"
                        type="number"
                        min={0}
                        max={1000000}
                        step={500}
                        value={principal}
                        onChange={(e) =>
                          setPrincipal(
                            Math.min(
                              1000000,
                              Math.max(0, Number(e.target.value) || 0),
                            ),
                          )
                        }
                        className="w-28 bg-transparent py-2.5 pl-1 text-right text-sm font-bold text-[#112D4E] outline-none"
                      />
                    </div>
                  </div>

                  <input
                    type="range"
                    min={1000}
                    max={1000000}
                    step={1000}
                    value={Math.min(1000000, Math.max(1000, principal))}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    aria-label="Adjust loan amount"
                    className="mt-5 h-1.5 w-full cursor-pointer accent-[#3F72AF]"
                  />

                  <div className="mt-2 flex justify-between text-[11px] text-[#9AA5B4]">
                    <span>$1,000</span>
                    <span>$1,000,000</span>
                  </div>
                </div>

                {/* INTEREST RATE */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label
                      htmlFor="loan-rate"
                      className="text-sm font-semibold text-[#112D4E]"
                    >
                      Annual interest rate
                    </label>
                    <div className="flex items-center rounded-lg border border-[#DBE2EF] bg-[#F9FAFC] px-3">
                      <input
                        id="loan-rate"
                        type="number"
                        min={0}
                        max={30}
                        step={0.1}
                        value={annualRate}
                        onChange={(e) =>
                          setAnnualRate(
                            Math.min(
                              30,
                              Math.max(0, Number(e.target.value) || 0),
                            ),
                          )
                        }
                        className="w-20 bg-transparent py-2.5 text-right text-sm font-bold text-[#112D4E] outline-none"
                      />
                      <span className="pl-1 text-sm text-[#7B8798]">%</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={30}
                    step={0.1}
                    value={annualRate}
                    onChange={(e) => setAnnualRate(Number(e.target.value))}
                    aria-label="Adjust annual interest rate"
                    className="mt-5 h-1.5 w-full cursor-pointer accent-[#3F72AF]"
                  />

                  <div className="mt-2 flex justify-between text-[11px] text-[#9AA5B4]">
                    <span>0%</span>
                    <span>30%</span>
                  </div>
                </div>

                {/* TENURE */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label
                      htmlFor="loan-tenure"
                      className="text-sm font-semibold text-[#112D4E]"
                    >
                      Repayment period
                    </label>
                    <div className="flex items-center rounded-lg border border-[#DBE2EF] bg-[#F9FAFC] px-3">
                      <input
                        id="loan-tenure"
                        type="number"
                        min={3}
                        max={360}
                        step={1}
                        value={tenureMonths}
                        onChange={(e) =>
                          setTenureMonths(
                            Math.min(
                              360,
                              Math.max(3, Number(e.target.value) || 3),
                            ),
                          )
                        }
                        className="w-16 bg-transparent py-2.5 text-right text-sm font-bold text-[#112D4E] outline-none"
                      />
                      <span className="pl-2 text-xs text-[#7B8798]">
                        months
                      </span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min={3}
                    max={360}
                    step={3}
                    value={tenureMonths}
                    onChange={(e) => setTenureMonths(Number(e.target.value))}
                    aria-label="Adjust repayment period"
                    className="mt-5 h-1.5 w-full cursor-pointer accent-[#3F72AF]"
                  />

                  <div className="mt-2 flex justify-between text-[11px] text-[#9AA5B4]">
                    <span>3 months</span>
                    <span>30 years</span>
                  </div>
                </div>
              </div>

              {/* RESULTS */}
              <div className="flex flex-col justify-between bg-[#F5F8FC] px-6 py-8 sm:px-9 lg:col-span-5 lg:border-l lg:border-[#E8EDF4] lg:py-10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#3F72AF]">
                    Your estimated monthly payment
                  </span>

                  <div className="mt-3 flex flex-wrap items-baseline gap-2">
                    <p className="text-4xl font-semibold tracking-tight text-[#112D4E] sm:text-[42px]">
                      {formatCurrency(emi)}
                    </p>
                    <span className="text-xs text-[#7B8798]">/ month</span>
                  </div>

                  <div className="mt-8">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#526174]">
                        Principal
                      </span>
                      <span className="font-semibold text-[#112D4E]">
                        {principalShare.toFixed(1)}%
                      </span>
                    </div>

                    <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-[#DBE2EF]">
                      <div
                        className="rounded-full bg-[#172554] transition-all duration-500"
                        style={{ width: `${principalShare}%` }}
                      />
                      <div className="flex-1 bg-[#7FA4D0] transition-all duration-500" />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-[#7B8798]">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#172554]" />
                        Principal
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#7FA4D0]" />
                        Interest
                      </span>
                    </div>
                  </div>

                  <div className="mt-7 space-y-4 border-t border-[#DBE2EF] pt-6">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-[#7B8798]">Loan amount</span>
                      <span className="font-semibold text-[#112D4E]">
                        {formatCurrency(principal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-[#7B8798]">Total interest</span>
                      <span className="font-semibold text-[#3F72AF]">
                        {formatCurrency(totalInterest)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-[#DBE2EF] pt-4 text-sm">
                      <span className="font-semibold text-[#112D4E]">
                        Total repayment
                      </span>
                      <span className="text-base font-bold text-[#112D4E]">
                        {formatCurrency(totalPayable)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href={`/open-account?loan=${activeLoan.id}`}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#172554] px-5 py-3.5 text-sm font-semibold text-white no-underline transition-all duration-200 hover:bg-[#263D70] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F72AF] focus-visible:ring-offset-2"
                  >
                    Continue to application
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <p className="mt-4 flex items-start justify-center gap-2 text-center text-[11px] leading-5 text-[#8A96A6]">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3F72AF]" />
                    <span>
                      This is an illustrative estimate, not a loan offer.
                      Actual terms depend on eligibility and approval.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* CLOSING NOTE */}
        <Reveal>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#DBE2EF] bg-white px-6 py-6 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-sm font-semibold text-[#112D4E]">
                Have questions about your financing options?
              </p>
              <p className="mt-1 text-xs leading-5 text-[#7B8798]">
                Explore our services or get in touch with our support team.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#3F72AF] no-underline transition-colors hover:text-[#172554]"
            >
              Talk to our team
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
