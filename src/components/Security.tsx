"use client";

import { useState } from "react";
import { Link } from "@heroui/react";
import {
  ShieldCheck,
  Lock,
  Key,
  Smartphone,
  Eye,
  CircleCheckFill,
  ArrowRight,
  TriangleExclamation,
  Server,
} from "@gravity-ui/icons";

interface SecurityPillar {
  id: string;
  title: string;
  badge: string;
  summary: string;
  technicalHighlight: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string[];
}

const securityPillars: SecurityPillar[] = [
  {
    id: "pin",
    title: "Transaction PIN Protection",
    badge: "Hashed & Rate-Limited",
    summary:
      "Every fund transfer, beneficiary addition, and high-value payment requires an encrypted personal transaction PIN verified independently of your login password.",
    technicalHighlight: "Bcrypt/Argon2 salted hashing + auto-lock after failed attempts",
    icon: Key,
    details: [
      "Separate 4-to-6 digit transaction PIN distinct from account login credentials",
      "Cryptographically salted one-way hashing—raw PINs are never stored or logged",
      "Automatic cooldown and temporary lock after consecutive invalid PIN attempts",
      "Instant PIN reset flow gated by identity re-verification",
    ],
  },
  {
    id: "2fa",
    title: "Two-Factor Authentication (2FA)",
    badge: "Multi-Factor Login",
    summary:
      "Protects account sign-ins and sensitive profile changes with a second verification step beyond just an email and password.",
    technicalHighlight: "Time-based OTP (TOTP) & device/session verification",
    icon: Smartphone,
    details: [
      "One-time verification codes required on unrecognized devices or browsers",
      "Session token rotation with short-lived access tokens and secure HTTP-only cookies",
      "Instant session revocation so you can sign out of remote devices in one click",
      "Step-up authentication triggered automatically for password or PIN updates",
    ],
  },
  {
    id: "encryption",
    title: "End-to-End & At-Rest Encryption",
    badge: "AES-256 & TLS 1.3",
    summary:
      "All data moving between your browser and Trustora Bank servers—as well as stored financial records—is safeguarded with industry-standard cryptography.",
    technicalHighlight: "TLS 1.3 in transit • AES-256 at rest • Strict RBAC",
    icon: Lock,
    details: [
      "HTTPS / TLS 1.3 enforced across all client-server API communications",
      "AES-256 encryption protecting sensitive personal, KYC, and ledger records at rest",
      "Role-Based Access Control (RBAC) isolating customer, staff, and admin privileges",
      "Strict input sanitization and parameterized queries preventing injection attacks",
    ],
  },
  {
    id: "fraud",
    title: "Real-Time Fraud Monitoring",
    badge: "24/7 Anomaly Detection",
    summary:
      "Continuous automated checks evaluate transaction velocity, unusual transfer spikes, and login patterns before funds leave your account.",
    technicalHighlight: "Rule-based velocity scoring + instant card/account freeze",
    icon: Eye,
    details: [
      "Automated flagging of abnormal transfer amounts, rapid bursts, or new payees",
      "Immediate email and in-app alerts for every debit, login, and security change",
      "One-tap card and account freeze directly from your customer dashboard",
      "Immutable audit logs recording timestamps, IP metadata, and action history",
    ],
  },
];

const complianceBadges = [
  { label: "Encryption Standard", value: "AES-256 / TLS 1.3" },
  { label: "Authentication", value: "2FA + Transaction PIN" },
  { label: "Access Control", value: "Role-Based (RBAC)" },
  { label: "Ledger Integrity", value: "Immutable Audit Trail" },
];

export default function Security() {
  const [activePillarId, setActivePillarId] = useState<string>("pin");

  const activePillar =
    securityPillars.find((item) => item.id === activePillarId) ??
    securityPillars[0];

  return (
    <section
      id="security"
      className="w-full bg-[#F9F7F7] py-20 text-[#112D4E] lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* TOP HERO BANNER */}
        <div className="grid grid-cols-1 items-center gap-10 rounded-3xl border border-[#DBE2EF] bg-white p-8 shadow-sm sm:p-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DBE2EF] bg-[#F9F7F7] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#3F72AF]">
              <ShieldCheck className="h-4 w-4" />
              <span>Bank-Grade Security Architecture</span>
            </span>

            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#112D4E] sm:text-4xl">
              Engineered to Protect Every Login, Ledger Entry, and Transfer
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-[#4B5563] sm:text-base">
              Security is built directly into the core of the{" "}
              <span className="font-semibold text-[#112D4E]">
                Trustora Bank
              </span>{" "}
              <span className="font-medium text-[#3F72AF]">
                Advanced Digital Banking Management System
              </span>
              —combining hashed transaction PINs, two-factor authentication, end-to-end encryption, and automated fraud monitoring.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/open-account"
                className="inline-flex items-center gap-2 rounded-xl bg-[#172554] px-6 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#112D4E]"
              >
                <span>Open a Protected Account</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] px-6 py-3 text-sm font-semibold text-[#112D4E] no-underline transition-colors hover:border-[#3F72AF] hover:text-[#3F72AF]"
              >
                Report a Security Concern
              </Link>
            </div>
          </div>

          {/* RIGHT: LIVE SECURITY ARCHITECTURE SUMMARY CARD */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[#DBE2EF] bg-[#FCF8E8] p-6 shadow-md">
              <div className="flex items-center justify-between border-b border-[#DBE2EF] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172554] text-white">
                    <Server className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#112D4E]">
                      Defense-in-Depth Stack
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      Active System Safeguards
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#172554] border border-[#DBE2EF]">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  Operational
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3.5">
                {complianceBadges.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-[#DBE2EF] bg-white p-3.5"
                  >
                    <p className="text-[11px] font-medium text-[#6B7280]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs font-bold text-[#112D4E] sm:text-sm">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOUR CORE SECURITY PILLARS */}
        <div className="mt-16">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#3F72AF]">
              Core Protection Layers
            </span>
            <h3 className="mt-2 text-2xl font-bold text-[#112D4E] sm:text-3xl">
              How We Safeguard Your Money & Data
            </h3>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {securityPillars.map((pillar) => {
              const Icon = pillar.icon;
              const isSelected = pillar.id === activePillarId;

              return (
                <div
                  key={pillar.id}
                  onClick={() => setActivePillarId(pillar.id)}
                  className={`cursor-pointer rounded-3xl border p-7 transition-all duration-200 sm:p-8 ${
                    isSelected
                      ? "border-[#3F72AF] bg-white ring-2 ring-[#3F72AF]/20 shadow-lg"
                      : "border-[#DBE2EF] bg-white shadow-xs hover:-translate-y-1 hover:border-[#3F72AF]/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#172554] text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-[#DBE2EF]/80 px-3 py-1 text-xs font-semibold text-[#112D4E]">
                      {pillar.badge}
                    </span>
                  </div>

                  <h4 className="mt-6 text-xl font-bold text-[#112D4E]">
                    {pillar.title}
                  </h4>

                  <p className="mt-2.5 text-sm leading-relaxed text-[#4B5563]">
                    {pillar.summary}
                  </p>

                  {/* TECHNICAL IMPLEMENTATION CALLOUT */}
                  <div className="mt-5 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] px-4 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#3F72AF]">
                      Under the Hood
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-[#112D4E]">
                      {pillar.technicalHighlight}
                    </p>
                  </div>

                  {/* BULLET DETAILS */}
                  <ul className="mt-5 space-y-2.5">
                    {pillar.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2.5">
                        <CircleCheckFill className="mt-0.5 h-4 w-4 shrink-0 text-[#3F72AF]" />
                        <span className="text-sm text-[#4B5563]">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* INTERACTIVE TRANSACTION VERIFICATION FLOW WALKTHROUGH */}
        <div className="mt-16 rounded-3xl border border-[#DBE2EF] bg-gradient-to-r from-[#112D4E] via-[#172554] to-[#3F72AF] p-8 text-white shadow-xl sm:p-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="inline-block rounded-full bg-[#FCF8E8]/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#FCF8E8]">
                Selected Layer Spotlight
              </span>
              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
                {activePillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#DBE2EF]">
                Click any of the four security cards above to inspect how each protection layer operates inside our digital banking workflow.
              </p>

              {/* LAYER SWITCHER PILLS */}
              <div className="mt-6 flex flex-wrap gap-2">
                {securityPillars.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivePillarId(item.id)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      item.id === activePillarId
                        ? "bg-[#FCF8E8] text-[#172554]"
                        : "bg-white/10 text-[#DBE2EF] hover:bg-white/20"
                    }`}
                  >
                    {item.title.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: 3-STEP TRANSACTION SECURITY FLOW */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
              {[
                {
                  step: "01",
                  title: "2FA Session Check",
                  desc: "Verifies device trust and active encrypted token before dashboard access.",
                },
                {
                  step: "02",
                  title: "Encrypted PIN Gate",
                  desc: "Validates salted transaction PIN against rate-limited security checks.",
                },
                {
                  step: "03",
                  title: "Fraud & Ledger Audit",
                  desc: "Screens amount velocity and writes an immutable timestamped receipt.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
                >
                  <span className="inline-block rounded-lg bg-[#FCF8E8] px-2.5 py-0.5 text-xs font-bold text-[#172554]">
                    Step {item.step}
                  </span>
                  <h4 className="mt-3 text-base font-bold text-white">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#DBE2EF]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CUSTOMER SECURITY BEST PRACTICES CALLOUT */}
        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl border border-[#DBE2EF] bg-[#FCF8E8] p-6 sm:p-8 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#172554] text-[#FCF8E8]">
              <TriangleExclamation className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#112D4E]">
                Trustora Bank Will Never Ask for Your PIN or 2FA Code
              </h4>
              <p className="mt-1 text-sm text-[#4B5563]">
                Our support team will never request your password, transaction PIN, or one-time verification code by phone, SMS, or email. If you notice suspicious activity, freeze your card immediately or contact our 24/7 security desk.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#172554] px-5 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#112D4E]"
          >
            <span>Contact Security Team</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}