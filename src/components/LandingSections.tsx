"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CreditCard,
  ArrowLeftRight,
  ArrowDownUp,
  Landmark,
  Key,
  Lock,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

export default function LandingSections() {
  return (
    <div className="w-full bg-[#F9F7F7] text-[#112D4E]">
      {/* =========================================================================
          SECTION A: Banking Made Simple
          Image-led feature block showcasing digital convenience
          ========================================================================= */}
      <section id="services" className="relative scroll-mt-20 border-t border-[#DBE2EF] bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* High-Resolution Image Container */}
            <div className="relative order-2 overflow-hidden rounded-3xl border border-[#DBE2EF] bg-[#F9F7F7] p-2 shadow-xl shadow-[#112D4E]/5 lg:order-1">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:aspect-[16/11]">
                <Image
                  src="/images/landing/banking-app.jpg"
                  alt="Customer managing digital banking on a smartphone with seamless real-time analytics"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#112D4E]/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6">
                  <span className="inline-block rounded-full bg-[#3F72AF]/90 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
                    Real-Time Dashboard
                  </span>
                  <p className="mt-2 text-base font-semibold text-white sm:text-lg">
                    Instant access to balances, transfers, and statements.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Beside Image */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DBE2EF] bg-[#F9F7F7] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#3F72AF]">
                <span>Banking Made Simple</span>
              </div>

              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#112D4E] sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]">
                Complete Financial Control, <br className="hidden sm:inline" />
                Right at Your Fingertips.
              </h2>

              <p className="mt-5 text-base leading-relaxed text-[#4B5563] sm:text-lg">
                Manage your everyday banking without branches or paperwork. Open savings and checking accounts, initiate instant transfers, request deposits, and track expenditures through an intuitive digital interface built for clarity.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div className="flex items-center gap-2.5 text-sm font-medium text-[#112D4E]">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#3F72AF]" />
                  <span>Instant internal account transfers</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-medium text-[#112D4E]">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#3F72AF]" />
                  <span>Real-time balance notifications</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-medium text-[#112D4E]">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#3F72AF]" />
                  <span>Downloadable CSV and PDF statements</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-medium text-[#112D4E]">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#3F72AF]" />
                  <span>Zero hidden maintenance fees</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#112D4E] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#1D4168] hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#DBE2EF] bg-white px-6 py-3.5 text-sm font-semibold text-[#112D4E] transition-all hover:border-[#3F72AF] hover:text-[#3F72AF] hover:-translate-y-0.5 cursor-pointer"
                >
                  Explore All Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: Everyday Banking Services
          Four compact, high-utility service cards in a 4-column grid
          ========================================================================= */}
      <section className="border-t border-[#DBE2EF] bg-[#F9F7F7] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3F72AF]">
              Everyday Banking Services
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#112D4E] sm:text-3xl">
              Essential Tools for Every Financial Goal
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#6B7280] sm:text-base">
              Streamlined financial products engineered for security, speed, and day-to-day dependability.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Bank Accounts */}
            <div className="group relative flex flex-col justify-between rounded-2xl border border-[#DBE2EF] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#3F72AF] hover:shadow-md">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#3F72AF] transition-colors group-hover:bg-[#112D4E] group-hover:text-white">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#112D4E]">
                  Bank Accounts
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                  Flexible Savings, Current, and Business accounts with real-time balance tracking.
                </p>
              </div>
              <Link
                href="/services"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#3F72AF] transition-colors group-hover:text-[#112D4E] cursor-pointer"
              >
                Learn More
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Card 2: Money Transfers */}
            <div className="group relative flex flex-col justify-between rounded-2xl border border-[#DBE2EF] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#3F72AF] hover:shadow-md">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#3F72AF] transition-colors group-hover:bg-[#112D4E] group-hover:text-white">
                  <ArrowLeftRight className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#112D4E]">
                  Money Transfers
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                  Send and receive funds between accounts instantly with automated transaction fees.
                </p>
              </div>
              <Link
                href="/services"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#3F72AF] transition-colors group-hover:text-[#112D4E] cursor-pointer"
              >
                Learn More
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Card 3: Deposits & Withdrawals */}
            <div className="group relative flex flex-col justify-between rounded-2xl border border-[#DBE2EF] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#3F72AF] hover:shadow-md">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#3F72AF] transition-colors group-hover:bg-[#112D4E] group-hover:text-white">
                  <ArrowDownUp className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#112D4E]">
                  Deposits & Withdrawals
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                  Submit deposit proofs and request secure cash withdrawals with staff approval workflows.
                </p>
              </div>
              <Link
                href="/services"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#3F72AF] transition-colors group-hover:text-[#112D4E] cursor-pointer"
              >
                Learn More
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Card 4: Loan Services */}
            <div className="group relative flex flex-col justify-between rounded-2xl border border-[#DBE2EF] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#3F72AF] hover:shadow-md">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#3F72AF] transition-colors group-hover:bg-[#112D4E] group-hover:text-white">
                  <Landmark className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#112D4E]">
                  Loan Services
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                  Apply for structured financing with clear amortization schedules and predictable EMIs.
                </p>
              </div>
              <Link
                href="/loans"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#3F72AF] transition-colors group-hover:text-[#112D4E] cursor-pointer"
              >
                Learn More
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION C: Security You Can Trust
          High-res cybersecurity vault imagery + 3 verified security highlights
          ========================================================================= */}
      <section id="security" className="relative scroll-mt-20 border-t border-[#DBE2EF] bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Content Column */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DBE2EF] bg-[#F9F7F7] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#3F72AF]">
                <span>Security You Can Trust</span>
              </div>

              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#112D4E] sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]">
                Defensive Engineering to Safeguard Your Wealth.
              </h2>

              <p className="mt-5 text-base leading-relaxed text-[#4B5563] sm:text-lg">
                Every transaction and authentication request is verified through multi-tier authorization layers and tamper-proof database transactions.
              </p>

              {/* 3 Implemented Security Highlights */}
              <div className="mt-8 space-y-5">
                <div className="flex gap-4 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] p-4 transition-colors hover:bg-white hover:border-[#3F72AF]/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[#3F72AF]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#112D4E]">
                      Secure Authentication
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">
                      Protected by Better Auth session verification and server-side RBAC isolating Customer, Staff, and Admin boundaries.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] p-4 transition-colors hover:bg-white hover:border-[#3F72AF]/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[#3F72AF]">
                    <Key className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#112D4E]">
                      Transaction PIN Protection
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">
                      One-way salted bcrypt-hashed PINs required for withdrawals and transfers, backed by brute-force lockouts and email recovery.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] p-4 transition-colors hover:bg-white hover:border-[#3F72AF]/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[#3F72AF]">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#112D4E]">
                      Account Security
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">
                      Active status enforcement across sensitive endpoints immediately halts unauthorized access for restricted profiles.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/security"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#112D4E] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#1D4168] hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                >
                  View Full Security Architecture
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* High-Resolution Security Vault Imagery */}
            <div className="relative overflow-hidden rounded-3xl border border-[#DBE2EF] bg-[#F9F7F7] p-2 shadow-xl shadow-[#112D4E]/5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:aspect-[16/11]">
                <Image
                  src="/images/landing/security-vault.jpg"
                  alt="High security financial technology infrastructure and data integrity vault"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#112D4E]/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6">
                  <span className="inline-block rounded-full bg-[#112D4E]/90 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
                    Multi-Document ACID Integrity
                  </span>
                  <p className="mt-2 text-base font-semibold text-white sm:text-lg">
                    Every monetary movement is cryptographically validated and logged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D: Financing Your Next Step
          Professional financial planning imagery + clear loan overview
          ========================================================================= */}
      <section id="loans" className="relative scroll-mt-20 border-t border-[#DBE2EF] bg-[#F9F7F7] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Professional Financial Consultation Image */}
            <div className="relative overflow-hidden rounded-3xl border border-[#DBE2EF] bg-white p-2 shadow-xl shadow-[#112D4E]/5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:aspect-[16/11]">
                <Image
                  src="/images/landing/loan-consultation.jpg"
                  alt="Professional financial consultation session discussing loan options and repayment schedules"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#112D4E]/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6">
                  <span className="inline-block rounded-full bg-[#3F72AF]/90 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
                    Predictable Repayment Schedules
                  </span>
                  <p className="mt-2 text-base font-semibold text-white sm:text-lg">
                    Transparent tenure choices and calculated monthly EMIs.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DBE2EF] bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#3F72AF]">
                <span>Financing Your Next Step</span>
              </div>

              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#112D4E] sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]">
                Structured Financing with Predictable Installments.
              </h2>

              <p className="mt-5 text-base leading-relaxed text-[#4B5563] sm:text-lg">
                Whether you are planning personal aspirations, home improvements, or business expansion, Trustora Bank delivers streamlined loan origination with clear monthly schedules and direct account disbursement.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#3F72AF]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#112D4E]">Personal, Home & Business Financing</h4>
                    <p className="text-xs text-[#6B7280]">Select the loan category tailored to your specific financial milestone.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#3F72AF]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#112D4E]">Staff Review & Admin Approval Pipeline</h4>
                    <p className="text-xs text-[#6B7280]">Track your application status from initial review to final disbursement.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#3F72AF]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#112D4E]">Integrated Amortization Breakdown</h4>
                    <p className="text-xs text-[#6B7280]">View principal and interest calculations before submitting your request.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/loans"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#112D4E] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#1D4168] hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                >
                  View Loan Options
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION E: About Trustora
          Executive corporate banking team photography + concise company summary
          ========================================================================= */}
      <section id="about" className="relative scroll-mt-20 border-t border-[#DBE2EF] bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Content Column */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DBE2EF] bg-[#F9F7F7] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#3F72AF]">
                <span>About Trustora Bank</span>
              </div>

              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#112D4E] sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]">
                Built on Trust, Modernized for Digital Reliability.
              </h2>

              <p className="mt-5 text-base leading-relaxed text-[#4B5563] sm:text-lg">
                Trustora Bank was engineered to replace outdated, opaque banking systems with modern digital infrastructure. We combine institutional security protocols with user-first software design to empower customers, staff, and administrators alike.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] p-4 text-left">
                  <p className="text-2xl font-extrabold text-[#112D4E]">24/7</p>
                  <p className="mt-1 text-xs font-medium text-[#6B7280]">Continuous digital service availability</p>
                </div>
                <div className="rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] p-4 text-left">
                  <p className="text-2xl font-extrabold text-[#3F72AF]">100%</p>
                  <p className="mt-1 text-xs font-medium text-[#6B7280]">Server-side authorization enforcement</p>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#DBE2EF] bg-white px-6 py-3.5 text-sm font-semibold text-[#112D4E] transition-all hover:border-[#3F72AF] hover:text-[#3F72AF] hover:-translate-y-0.5 cursor-pointer"
                >
                  Learn About Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* High-Resolution Team / Corporate Office Image */}
            <div className="relative overflow-hidden rounded-3xl border border-[#DBE2EF] bg-[#F9F7F7] p-2 shadow-xl shadow-[#112D4E]/5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:aspect-[16/11]">
                <Image
                  src="/images/landing/trustora-team.jpg"
                  alt="Trustora professional banking team collaborating in a modern corporate headquarters"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#112D4E]/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6">
                  <span className="inline-block rounded-full bg-[#112D4E]/90 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
                    Institutional Governance
                  </span>
                  <p className="mt-2 text-base font-semibold text-white sm:text-lg">
                    Dedicated to transparency, compliance, and financial integrity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION F: Final Call to Action
          Compact, visually striking CTA banner encouraging account access
          ========================================================================= */}
      <section className="relative overflow-hidden bg-[#112D4E] py-14 sm:py-16">
        {/* Subtle geometric background accents */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#3F72AF]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#3F72AF]/15 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-7 lg:px-8">
          <span className="inline-block rounded-full bg-[#3F72AF]/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#DBE2EF]">
            Ready to Get Started?
          </span>

          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Experience a Smarter, Safer Way to Bank Today.
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#DBE2EF] sm:text-base">
            Open your account in minutes or access your existing portal to manage balances, review loan applications, and execute transactions.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-[#112D4E] shadow-md transition-all hover:bg-gray-100 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            >
              Open an Account
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-transparent px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white hover:-translate-y-0.5 cursor-pointer"
            >
              Customer Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
