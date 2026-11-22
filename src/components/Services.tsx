"use client";

import { useState } from "react";
import { Link } from "@heroui/react";
import {
  ArrowRight,
  ShieldCheck,
 
} from "@gravity-ui/icons";
import { Briefcase, CircleCheck, CreditCard, PiggyBank, TrendingUp } from "lucide-react";

type BillingCycle = "personal" | "business";

interface AccountTier {
  id: string;
  name: string;
  badge: string;
  subtitle: string;
  rateLabel: string;
  rateValue: string;
  minBalance: string;
  highlighted?: boolean;
  cardBg: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

const accountTypes: AccountTier[] = [
  {
    id: "savings",
    name: "Savings Account",
    badge: "Everyday Growth",
    subtitle:
      "Designed for steady wealth accumulation, emergency reserves, and automated goal-based saving.",
    rateLabel: "Annual Yield",
    rateValue: "4.65% APY",
    minBalance: "$100 minimum opening deposit",
    highlighted: false,
    cardBg: "bg-white",
    icon: PiggyBank,
    features: [
      "Daily compounded interest credited monthly",
      "Automated round-up & recurring goal vaults",
      "Free virtual & physical debit card access",
      "Instant transfers to checking & external banks",
      "Real-time spending alerts & biometric lock",
    ],
    ctaLabel: "Open Savings Account",
    ctaHref: "/open-account?type=savings",
  },
  {
    id: "current",
    name: "Current Account",
    badge: "Most Popular",
    subtitle:
      "Built for high-frequency daily transactions, instant settlements, and frictionless cash management.",
    rateLabel: "Transaction Limit",
    rateValue: "Unlimited",
    minBalance: "$250 minimum opening deposit",
    highlighted: true,
    cardBg: "bg-[#FCF8E8]",
    icon: CreditCard,
    features: [
      "Unlimited domestic & instant peer-to-peer transfers",
      "Overdraft protection buffer with transparent terms",
      "Multi-currency wallet support & live FX conversion",
      "Full ledger history, CSV/PDF statements & receipts",
      "24/7 priority support via our banking platform",
    ],
    ctaLabel: "Open Current Account",
    ctaHref: "/open-account?type=current",
  },
  {
    id: "business",
    name: "Business Account",
    badge: "Enterprise & SME",
    subtitle:
      "Engineered for companies managing payroll, vendor payouts, multi-user approvals, and treasury liquidity.",
    rateLabel: "Treasury Boost",
    rateValue: "Up to 5.10%",
    minBalance: "$1,000 minimum opening deposit",
    highlighted: false,
    cardBg: "bg-white",
    icon: Briefcase,
    features: [
      "Role-based team access & multi-level payment approvals",
      "Batch payroll disbursement & automated invoicing",
      "Corporate virtual & physical cards with spend limits",
      "Real-time cash-flow analytics & ERP export tools",
      "Dedicated relationship manager & treasury advisory",
    ],
    ctaLabel: "Open Business Account",
    ctaHref: "/open-account?type=business",
  },
];

export default function Services() {
  const [selectedAccountId, setSelectedAccountId] = useState<string>("current");
  const [segmentFilter, setSegmentFilter] = useState<BillingCycle>("personal");

  return (
    <section
      id="services"
      className="w-full bg-[#F9F7F7] py-20 text-[#112D4E] lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* SECTION HEADER */}
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DBE2EF] bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#3F72AF]">
              Services & Accounts
            </span>

            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#112D4E] sm:text-4xl">
              Accounts Tailored to How You Save, Spend, and Scale
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#6B7280] sm:text-base">
              Part of the{" "}
              <span className="font-semibold text-[#112D4E]">
                Trustora Bank
              </span>{" "}
              Advanced Digital Banking Management System—choose a Savings, Current, or Business account with clear terms and instant digital control.
            </p>
          </div>

          {/* SEGMENT TOGGLE PILL */}
          <div className="inline-flex rounded-xl border border-[#DBE2EF] bg-white p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setSegmentFilter("personal")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                segmentFilter === "personal"
                  ? "bg-[#172554] text-white"
                  : "text-[#4B5563] hover:text-[#112D4E]"
              }`}
            >
              Personal & Everyday
            </button>
            <button
              type="button"
              onClick={() => setSegmentFilter("business")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                segmentFilter === "business"
                  ? "bg-[#172554] text-white"
                  : "text-[#4B5563] hover:text-[#112D4E]"
              }`}
            >
              Business & Treasury
            </button>
          </div>
        </div>

        {/* THREE ACCOUNT CARDS (SAVINGS, CURRENT, BUSINESS) */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {accountTypes.map((account) => {
            const Icon = account.icon;
            const isSelected = selectedAccountId === account.id;
            const isRecommendedForFilter =
              (segmentFilter === "personal" &&
                (account.id === "savings" || account.id === "current")) ||
              (segmentFilter === "business" && account.id === "business");

            return (
              <div
                key={account.id}
                onClick={() => setSelectedAccountId(account.id)}
                className={`relative flex cursor-pointer flex-col justify-between rounded-3xl border p-7 transition-all duration-200 sm:p-8 ${
                  account.cardBg
                } ${
                  isSelected
                    ? "border-[#3F72AF] ring-2 ring-[#3F72AF]/25 shadow-xl"
                    : "border-[#DBE2EF] shadow-sm hover:-translate-y-1 hover:border-[#3F72AF]/70"
                }`}
              >
                <div>
                  {/* TOP BADGE ROW */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#172554] text-white">
                      <Icon className="h-6 w-6" />
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        account.highlighted
                          ? "bg-[#172554] text-[#FCF8E8]"
                          : "bg-[#DBE2EF]/80 text-[#112D4E]"
                      }`}
                    >
                      {account.badge}
                    </span>
                  </div>

                  {/* TITLE & SUBTITLE */}
                  <h3 className="mt-6 text-2xl font-bold text-[#112D4E]">
                    {account.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">
                    {account.subtitle}
                  </p>

                  {/* HIGHLIGHT METRIC STRIP */}
                  <div className="mt-6 flex items-center justify-between rounded-2xl border border-[#DBE2EF] bg-[#F9F7F7] px-4 py-3.5">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                        {account.rateLabel}
                      </p>
                      <p className="mt-0.5 text-lg font-extrabold text-[#112D4E]">
                        {account.rateValue}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-medium text-[#6B7280]">
                        Opening Requirement
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-[#3F72AF]">
                        {account.minBalance}
                      </p>
                    </div>
                  </div>

                  {/* FEATURES LIST */}
                  <ul className="mt-6 space-y-3">
                    {account.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#3F72AF]" />
                        <span className="text-sm text-[#4B5563]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* FOOTER ACTION */}
                <div className="mt-8 border-t border-[#DBE2EF] pt-6">
                  {isRecommendedForFilter && (
                    <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-[#3F72AF]">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>
                        Matches{" "}
                        {segmentFilter === "personal"
                          ? "Personal & Everyday"
                          : "Business & Treasury"}{" "}
                        profile
                      </span>
                    </p>
                  )}

                  <Link
                    href={account.ctaHref}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold no-underline transition-colors ${
                      account.highlighted || isSelected
                        ? "bg-[#172554] text-white hover:bg-[#112D4E]"
                        : "border border-[#172554] bg-white text-[#172554] hover:bg-[#172554] hover:text-white"
                    }`}
                  >
                    <span>{account.ctaLabel}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM COMPARISON & SECURITY NOTE */}
        <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl border border-[#DBE2EF] bg-white p-6 shadow-xs sm:p-8 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DBE2EF]/70 text-[#172554]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#112D4E]">
                Protected Accounts Across Every Tier
              </h4>
              <p className="mt-1 text-sm text-[#6B7280]">
                All Savings, Current, and Business accounts include real-time fraud protection, instant card freeze controls, and transparent monthly statements.
              </p>
            </div>
          </div>

          <Link
            href="/loans"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] px-5 py-2.5 text-sm font-semibold text-[#112D4E] no-underline transition-colors hover:border-[#3F72AF] hover:text-[#3F72AF]"
          >
            <span>Compare Loan Options</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}