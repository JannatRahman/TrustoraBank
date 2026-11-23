
"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { Link } from "@heroui/react";
import {
  ArrowRight,
  ShieldCheck,
  CircleCheck,
} from "@gravity-ui/icons";
import {
  Briefcase,
  CreditCard,
  PiggyBank,
} from "lucide-react";

type AccountSegment = "personal" | "business";

interface AccountTier {
  id: string;
  name: string;
  badge: string;
  subtitle: string;
  rateLabel: string;
  rateValue: string;
  minBalance: string;
  highlighted?: boolean;
  icon: ComponentType<{ className?: string }>;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

const accountTypes: AccountTier[] = [
  {
    id: "savings",
    name: "Savings Account",
    badge: "Everyday growth",
    subtitle:
      "A simple way to build your savings, prepare for future goals, and manage your money with confidence.",
    rateLabel: "Illustrative annual yield",
    rateValue: "4.65% APY",
    minBalance: "$100",
    icon: PiggyBank,
    features: [
      "Interest credited monthly",
      "Flexible savings and goal planning",
      "Debit card access",
      "Transaction history and account statements",
    ],
    ctaLabel: "Explore Savings",
    ctaHref: "/open-account?type=savings",
  },
  {
    id: "current",
    name: "Current Account",
    badge: "Most popular",
    subtitle:
      "For everyday banking, regular payments, and convenient access to your money.",
    rateLabel: "Transaction limit",
    rateValue: "Flexible",
    minBalance: "$250",
    highlighted: true,
    icon: CreditCard,
    features: [
      "Convenient everyday transactions",
      "Domestic fund transfers",
      "Digital account activity and statements",
      "Convenient access to banking services",
    ],
    ctaLabel: "Explore Current",
    ctaHref: "/open-account?type=current",
  },
  {
    id: "business",
    name: "Business Account",
    badge: "For growing businesses",
    subtitle:
      "A banking solution designed to help businesses organize payments, manage cash flow, and handle daily operations.",
    rateLabel: "Illustrative treasury rate",
    rateValue: "Up to 5.10%",
    minBalance: "$1,000",
    icon: Briefcase,
    features: [
      "Business-focused account management",
      "Payment and transaction tracking",
      "Team access and approval workflows",
      "Financial activity and reporting tools",
    ],
    ctaLabel: "Explore Business",
    ctaHref: "/open-account?type=business",
  },
];

/* SCROLL REVEAL */

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

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (reducedMotion.matches) {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
      element.style.transition = "none";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: "translateY(24px)",
        transition: `opacity 700ms ease ${delay}ms, transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ACCOUNT CARD */

function AccountCard({
  account,
  selected,
  onSelect,
  index,
}: {
  account: AccountTier;
  selected: boolean;
  onSelect: () => void;
  index: number;
}) {
  const Icon = account.icon;

  return (
    <Reveal delay={index * 100}>
      <article
        className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-white p-7 transition-all duration-300 sm:p-8 ${
          selected
            ? "border-[#3F72AF] shadow-[0_20px_55px_-35px_rgba(17,45,78,0.35)]"
            : "border-[#DBE2EF] hover:-translate-y-1 hover:border-[#A9BEDA] hover:shadow-[0_20px_50px_-35px_rgba(17,45,78,0.25)]"
        }`}
      >
        {account.highlighted && (
          <div className="absolute right-0 top-0 rounded-bl-2xl bg-[#172554] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-white">
            Popular choice
          </div>
        )}

        {/* ICON AND BADGE */}
        <div className="flex items-center justify-between gap-3">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${
              selected
                ? "bg-[#172554] text-white"
                : "bg-[#EDF3FA] text-[#3F72AF]"
            }`}
          >
            <Icon className="h-7 w-7" />
          </div>

          {!account.highlighted && (
            <span className="rounded-full bg-[#F3F6FA] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#526782]">
              {account.badge}
            </span>
          )}
        </div>

        {/* ACCOUNT INFORMATION */}
        <div className="mt-7">
          <h3 className="text-2xl font-semibold tracking-tight text-[#112D4E]">
            {account.name}
          </h3>

          <p className="mt-3 min-h-[72px] text-sm leading-7 text-[#6B7280]">
            {account.subtitle}
          </p>
        </div>

        {/* ACCOUNT HIGHLIGHT */}
        <div className="mt-7 rounded-2xl bg-[#F5F7FA] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7B8798]">
            {account.rateLabel}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-[#112D4E]">
            {account.rateValue}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-[#E2E8F0] pt-4">
            <span className="text-xs text-[#6B7280]">
              Minimum opening deposit
            </span>

            <span className="text-sm font-semibold text-[#3F72AF]">
              {account.minBalance}
            </span>
          </div>
        </div>

        {/* FEATURES */}
        <div className="mt-7 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7B8798]">
            Account highlights
          </p>

          <ul className="mt-4 space-y-4">
            {account.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#3F72AF]" />

                <span className="text-sm leading-6 text-[#4B5563]">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 border-t border-[#E8EDF4] pt-6">
          <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className={`mb-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F72AF] focus-visible:ring-offset-2 ${
              selected
                ? "border-[#3F72AF] bg-[#EDF3FA] text-[#172554]"
                : "border-[#DBE2EF] bg-white text-[#4B5563] hover:border-[#3F72AF] hover:text-[#172554]"
            }`}
          >
            {selected ? "Selected account" : "Select account"}
          </button>

          <Link
            href={account.ctaHref}
            className="group/link flex w-full items-center justify-center gap-2 rounded-xl bg-[#172554] px-5 py-3.5 text-sm font-semibold text-white no-underline transition-all duration-200 hover:bg-[#3F72AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F72AF] focus-visible:ring-offset-2"
          >
            {account.ctaLabel}

            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

/* MAIN SERVICES COMPONENT */

export default function Services() {
  const [segmentFilter, setSegmentFilter] =
    useState<AccountSegment>("personal");

  const [selectedAccountId, setSelectedAccountId] =
    useState("current");

  const filteredAccounts =
    segmentFilter === "personal"
      ? accountTypes.filter(
          (account) =>
            account.id === "savings" || account.id === "current",
        )
      : accountTypes.filter((account) => account.id === "business");

  const handleSegmentChange = (segment: AccountSegment) => {
    setSegmentFilter(segment);

    setSelectedAccountId(
      segment === "personal" ? "current" : "business",
    );
  };

  return (
    <section
      id="services"
      className="w-full scroll-mt-24 overflow-hidden bg-[#F9F7F7] py-24 text-[#112D4E] sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* SECTION INTRO */}
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DBE2EF] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.17em] text-[#3F72AF]">
              Banking services
            </span>

            <h2 className="mt-6 text-3xl font-semibold leading-[1.2] tracking-tight text-[#112D4E] sm:text-4xl lg:text-5xl">
              Banking that fits
              <span className="block text-[#3F72AF]">
                the way you live.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#6B7280] sm:text-base sm:leading-8">
              Whether you are building your savings, managing everyday
              expenses, or growing a business, explore an account designed
              around your financial needs.
            </p>
          </div>
        </Reveal>

        {/* ACCOUNT SEGMENT SELECTOR */}
        <Reveal delay={100}>
          <div className="mt-12 flex flex-col items-center">
            <p className="mb-4 text-xs font-semibold text-[#7B8798]">
              Explore accounts for
            </p>

            <div
              className="inline-flex w-full max-w-[360px] rounded-2xl border border-[#DBE2EF] bg-white p-1.5 shadow-sm"
              role="group"
              aria-label="Choose account category"
            >
              <button
                type="button"
                onClick={() => handleSegmentChange("personal")}
                aria-pressed={segmentFilter === "personal"}
                className={`flex-1 cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  segmentFilter === "personal"
                    ? "bg-[#172554] text-white shadow-sm"
                    : "text-[#6B7280] hover:bg-[#F3F6FA] hover:text-[#112D4E]"
                }`}
              >
                Personal
              </button>

              <button
                type="button"
                onClick={() => handleSegmentChange("business")}
                aria-pressed={segmentFilter === "business"}
                className={`flex-1 cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  segmentFilter === "business"
                    ? "bg-[#172554] text-white shadow-sm"
                    : "text-[#6B7280] hover:bg-[#F3F6FA] hover:text-[#112D4E]"
                }`}
              >
                Business
              </button>
            </div>
          </div>
        </Reveal>

        {/* ACCOUNT CARDS */}
        <div
          className={`mt-12 grid grid-cols-1 items-stretch gap-6 lg:mt-16 ${
            segmentFilter === "personal"
              ? "md:grid-cols-2"
              : "mx-auto max-w-2xl"
          }`}
        >
          {filteredAccounts.map((account, index) => (
            <AccountCard
              key={account.id}
              account={account}
              selected={selectedAccountId === account.id}
              onSelect={() => setSelectedAccountId(account.id)}
              index={index}
            />
          ))}
        </div>

        {/* SECURITY AND SUPPORT STRIP */}
        <Reveal>
          <div className="mt-16 overflow-hidden rounded-[1.75rem] border border-[#DBE2EF] bg-white">
            <div className="grid grid-cols-1 items-center gap-7 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:px-10 lg:py-9">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EDF3FA] text-[#3F72AF]">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#112D4E]">
                    Banking with care and clarity
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-7 text-[#6B7280]">
                    Explore account information, understand the available
                    features, and review the terms before choosing an account.
                  </p>
                </div>
              </div>

              <Link
                href="/loans"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] px-5 py-3.5 text-sm font-semibold text-[#172554] no-underline transition-all duration-200 hover:border-[#3F72AF] hover:bg-[#EDF3FA] sm:w-auto"
              >
                Compare loan options

                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* DISCLAIMER */}
        <p className="mx-auto mt-7 max-w-3xl text-center text-[11px] leading-5 text-[#929CAB]">
          Account features, rates, and minimum deposits shown are illustrative
          examples for the Trustora Bank project. Actual products, eligibility,
          fees, and terms would need to be confirmed before launch.
        </p>
      </div>
    </section>
  );
}
