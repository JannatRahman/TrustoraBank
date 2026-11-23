
"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
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
} from "@gravity-ui/icons";

interface SecurityPillar {
  id: string;
  title: string;
  badge: string;
  summary: string;
  technicalHighlight: string;
  icon: ComponentType<{ className?: string }>;
  details: string[];
}

const securityPillars: SecurityPillar[] = [
  {
    id: "pin",
    title: "Transaction PIN Protection",
    badge: "Payment security",
    summary:
      "An additional verification step for sensitive transactions, designed to help prevent unauthorized payments.",
    technicalHighlight: "Salted password hashing and attempt limits",
    icon: Key,
    details: [
      "A separate transaction PIN from your login password",
      "Secure one-way hashing rather than storing raw PINs",
      "Temporary lockouts after repeated incorrect attempts",
      "Identity verification before a PIN reset",
    ],
  },
  {
    id: "2fa",
    title: "Two-Factor Authentication",
    badge: "Account access",
    summary:
      "An additional layer of identity verification to help protect account access and sensitive changes.",
    technicalHighlight: "One-time verification and session controls",
    icon: Smartphone,
    details: [
      "Additional verification for supported sign-in flows",
      "Device and session management",
      "Options to revoke unrecognized sessions",
      "Extra verification for sensitive account changes",
    ],
  },
  {
    id: "encryption",
    title: "Data Protection",
    badge: "Privacy by design",
    summary:
      "A security-focused approach to protecting personal information and financial records throughout the platform.",
    technicalHighlight: "Transport encryption and protected data storage",
    icon: Lock,
    details: [
      "HTTPS for secure browser-to-server communication",
      "Protection for sensitive stored information",
      "Role-based access to restricted information",
      "Input validation and secure database access practices",
    ],
  },
  {
    id: "fraud",
    title: "Fraud Prevention",
    badge: "Transaction awareness",
    summary:
      "A framework for identifying unusual account activity and helping customers respond to suspicious behavior.",
    technicalHighlight: "Transaction monitoring and audit records",
    icon: Eye,
    details: [
      "Checks for unusual transaction patterns",
      "Notifications for important account activity",
      "Review processes for potentially suspicious actions",
      "Activity records to support investigation and auditing",
    ],
  },
];

const securityPrinciples = [
  {
    title: "Protect account access",
    description: "Use strong authentication and secure session management.",
    icon: ShieldCheck,
  },
  {
    title: "Protect sensitive data",
    description: "Apply encryption and access controls where appropriate.",
    icon: Lock,
  },
  {
    title: "Monitor activity",
    description: "Identify unusual behavior and maintain useful audit records.",
    icon: Eye,
  },
  {
    title: "Verify transactions",
    description: "Add appropriate checks before sensitive financial actions.",
    icon: Key,
  },
];

/* REVEAL ANIMATION */

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

    // Show content immediately when reduced motion is preferred.
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
        rootMargin: "0px 0px -35px 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: "translateY(22px)",
        transition: `opacity 700ms ease ${delay}ms, transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* MAIN SECURITY COMPONENT */

export default function Security() {
  const [activePillarId, setActivePillarId] = useState("pin");

  const activePillar =
    securityPillars.find((item) => item.id === activePillarId) ??
    securityPillars[0];

  const ActiveIcon = activePillar.icon;

  return (
    <section
      id="security"
      className="w-full scroll-mt-24 bg-[#F9F7F7] py-20 text-[#112D4E] sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* HERO */}
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-[#112D4E] px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-14 lg:py-20">
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#3F72AF]/20 blur-3xl" />

            <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.17em] text-[#DBE2EF]">
                  <ShieldCheck className="h-4 w-4" />
                  Security & privacy
                </span>

                <h2 className="mt-7 max-w-2xl text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
                  Your trust deserves
                  <span className="block text-[#A9C5E8]">
                    thoughtful protection.
                  </span>
                </h2>

                <p className="mt-6 max-w-xl text-sm leading-7 text-[#DBE2EF] sm:text-base">
                  Security should be part of every banking interaction.
                  Trustora is designed around thoughtful access controls, data
                  protection, transaction verification, and account
                  monitoring.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href="/register"
                    className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#172554] no-underline transition-all duration-200 hover:bg-[#DBE2EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#112D4E]"
                  >
                    Get started
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-white/10"
                  >
                    Contact us
                  </Link>
                </div>
              </div>

              {/* SECURITY VISUAL */}
              <div className="relative mx-auto w-full max-w-sm lg:col-span-5">
                <div className="relative rounded-[2rem] border border-white/15 bg-white/[0.07] p-6 shadow-2xl backdrop-blur-sm sm:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#172554]">
                      <ShieldCheck className="h-7 w-7" />
                    </div>

                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#DBE2EF]">
                      Security framework
                    </span>
                  </div>

                  <h3 className="mt-8 text-xl font-semibold text-white">
                    Protection at every step
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#DBE2EF]">
                    A layered approach to safer digital banking experiences.
                  </p>

                  <div className="mt-7 space-y-3">
                    {[
                      { label: "Identity verification", icon: Smartphone },
                      { label: "Protected information", icon: Lock },
                      { label: "Transaction checks", icon: Key },
                      { label: "Activity monitoring", icon: Eye },
                    ].map((item, index) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.label}
                          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 transition-colors hover:bg-white/10"
                          style={{
                            animation: `securitySlideIn 500ms ease ${index * 100}ms both`,
                          }}
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-[#A9C5E8]">
                            <Icon className="h-5 w-5" />
                          </div>

                          <span className="text-sm font-medium text-white">
                            {item.label}
                          </span>

                          <CircleCheckFill className="ml-auto h-4 w-4 text-[#A9C5E8]" />
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-5 text-center text-[10px] leading-5 text-[#A9BBD2]">
                    Illustrative overview of the platform&apos;s security
                    design.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* SECTION INTRO */}
        <Reveal>
          <div className="mx-auto mt-24 max-w-2xl text-center sm:mt-28">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#3F72AF]">
              Built around protection
            </span>

            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#112D4E] sm:text-3xl lg:text-4xl">
              Four important layers of security
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#6B7280] sm:text-base">
              Explore the principles behind protecting account access,
              personal information, and financial activity.
            </p>
          </div>
        </Reveal>

        {/* SECURITY PILLARS */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
          {securityPillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const isSelected = pillar.id === activePillarId;

            return (
              <Reveal key={pillar.id} delay={index * 90}>
                <article
                  className={`h-full rounded-3xl border bg-white p-6 transition-all duration-300 sm:p-8 ${
                    isSelected
                      ? "border-[#3F72AF] shadow-[0_16px_45px_-30px_rgba(17,45,78,0.4)]"
                      : "border-[#DBE2EF] hover:-translate-y-1 hover:border-[#A9BEDA] hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300 ${
                        isSelected
                          ? "bg-[#172554] text-white"
                          : "bg-[#EDF3FA] text-[#3F72AF]"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="rounded-full bg-[#F3F6FA] px-3 py-1.5 text-[10px] font-semibold tracking-wide text-[#526782]">
                      {pillar.badge}
                    </span>
                  </div>

                  <h4 className="mt-6 text-xl font-semibold tracking-tight text-[#112D4E]">
                    {pillar.title}
                  </h4>

                  <p className="mt-3 text-sm leading-7 text-[#6B7280]">
                    {pillar.summary}
                  </p>

                  <div className="mt-6 border-t border-[#E8EDF4] pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#3F72AF]">
                      Security focus
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#112D4E]">
                      {pillar.technicalHighlight}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActivePillarId(pillar.id)}
                    aria-pressed={isSelected}
                    className={`group mt-6 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F72AF] focus-visible:ring-offset-4 ${
                      isSelected
                        ? "text-[#3F72AF]"
                        : "text-[#112D4E] hover:text-[#3F72AF]"
                    }`}
                  >
                    {isSelected
                      ? "Currently exploring"
                      : "Explore this layer"}

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* SELECTED SECURITY DETAIL */}
        <Reveal>
          <div
            className="mt-8 overflow-hidden rounded-3xl bg-[#172554] text-white"
            aria-live="polite"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="p-7 sm:p-9 lg:col-span-5 lg:p-11">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#A9C5E8]">
                  <ActiveIcon className="h-6 w-6" />
                </div>

                <span className="mt-7 block text-[10px] font-bold uppercase tracking-[0.17em] text-[#A9C5E8]">
                  Explore a security layer
                </span>

                <h3 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">
                  {activePillar.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#DBE2EF]">
                  {activePillar.summary}
                </p>

                <div className="mt-6 inline-flex rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-[#DBE2EF]">
                  {activePillar.badge}
                </div>
              </div>

              <div className="border-t border-white/10 bg-white/[0.04] p-7 sm:p-9 lg:col-span-7 lg:border-l lg:border-t-0 lg:p-11">
                <h4 className="text-sm font-semibold text-white">
                  Key protection considerations
                </h4>

                <ul className="mt-6 space-y-5">
                  {activePillar.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#A9C5E8]/15">
                        <CircleCheckFill className="h-3.5 w-3.5 text-[#A9C5E8]" />
                      </div>

                      <span className="text-sm leading-6 text-[#DBE2EF]">
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 border-t border-white/10 pt-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A9C5E8]">
                    Technical consideration
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#DBE2EF]">
                    {activePillar.technicalHighlight}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* SECURITY PRINCIPLES */}
        <Reveal>
          <div className="mt-24 sm:mt-28">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#3F72AF]">
                Our approach
              </span>

              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#112D4E] sm:text-3xl">
                Security is more than a feature
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#6B7280]">
                A thoughtful banking experience considers security at every
                stage, from signing in to completing a transaction.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {securityPrinciples.map((principle, index) => {
                const Icon = principle.icon;

                return (
                  <div
                    key={principle.title}
                    className="rounded-2xl border border-[#DBE2EF] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    style={{ transitionDelay: `${index * 40}ms` }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDF3FA] text-[#3F72AF]">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h4 className="mt-5 text-sm font-semibold text-[#112D4E]">
                      {principle.title}
                    </h4>

                    <p className="mt-2 text-xs leading-6 text-[#7B8798]">
                      {principle.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* CUSTOMER SAFETY NOTE */}
        <Reveal>
          <div className="mt-16 flex flex-col gap-6 rounded-3xl border border-[#DBE2EF] bg-[#FCF8E8] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#172554] text-white">
                <TriangleExclamation className="h-5 w-5" />
              </div>

              <div>
                <h4 className="text-base font-semibold text-[#112D4E]">
                  Keep your banking information private
                </h4>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">
                  Never share your password, transaction PIN, or one-time
                  verification code with anyone. Be cautious with unexpected
                  links and messages asking for your financial information.
                </p>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#3F72AF] no-underline transition-colors hover:text-[#172554]"
            >
              Need assistance?
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        {/* IMPLEMENTATION DISCLAIMER */}
        <p className="mx-auto mt-8 max-w-3xl text-center text-[11px] leading-5 text-[#929CAB]">
          Security features described on this page represent the platform&apos;s
          intended design and illustrative security approach. Actual
          protections depend on implementation, configuration, and independent
          verification.
        </p>
      </div>

      <style jsx global>{`
        @keyframes securitySlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        html {
          scroll-behavior: smooth;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}
