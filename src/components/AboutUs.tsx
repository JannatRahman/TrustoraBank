"use client";

import { Link } from "@heroui/react";
import {
  ShieldCheck,
  Target,
  Eye,
  Lock,
  Sparkles,
 PersonFill,
  ArrowRight,
  CircleCheckFill,
 
} from "@gravity-ui/icons";

interface ValueItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const coreValues: ValueItem[] = [
  {
    title: "Uncompromising Security",
    description:
      "Multi-layered encryption, real-time fraud monitoring, and strict regulatory compliance protect every transaction around the clock.",
    icon: Lock,
  },
  {
    title: "Radical Transparency",
    description:
      "Zero hidden fees, clear interest structures, and instant audit trails so individuals and businesses always stay in full control.",
    icon: ShieldCheck,
  },
  {
    title: "Intelligent Innovation",
    description:
      "Built on an Advanced Digital Banking Management System that streamlines payments, liquidity, and automated credit decisions.",
    icon: Sparkles,
  },
  {
    title: "Customer-First Trust",
    description:
      "Dedicated human support paired with intuitive digital tools designed around real financial milestones.",
    icon: PersonFill,
  },
];

const credibilityMetrics = [
  { value: "$4.8B+", label: "Assets Safeguarded" },
  { value: "450K+", label: "Active Account Holders" },
  { value: "99.99%", label: "Platform Uptime" },
  { value: "24/7", label: "Fraud & Treasury Monitoring" },
];

export default function AboutUs() {
  return (
    <section
      id="about"
      className="w-full bg-[#F9F7F7] py-20 text-[#112D4E] lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* TOP HEADER & BANK STORY */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* LEFT: RELEVANT BANKING IMAGE WITH FLOATING CREDIBILITY CARD */}
          <div className="relative lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border border-[#DBE2EF] bg-white p-2.5 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85"
                alt="Trustora Bank financial advisors reviewing digital banking analytics"
                className="h-[380px] w-full rounded-2xl object-cover sm:h-[450px]"
              />
              {/* Subtle Navy Gradient Overlay at Bottom */}
              <div className="pointer-events-none absolute inset-2.5 rounded-2xl bg-gradient-to-t from-[#112D4E]/60 via-transparent to-transparent" />

              {/* Bottom Left Caption inside Image */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#172554]/90 text-[#FCF8E8] backdrop-blur-md">
                   
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#DBE2EF]">
                      Est. 2016 • Regulated Institution
                    </p>
                    <p className="text-sm font-bold">
                      Trustora Bank Global Headquarters
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FLOATING ACCENT BADGE (Cream #FCF8E8 + Navy #172554) */}
            <div className="mt-6 rounded-2xl border border-[#DBE2EF] bg-[#FCF8E8] p-5 shadow-lg sm:absolute sm:-bottom-8 sm:right-6 sm:mt-0 sm:max-w-xs">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#172554] text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#112D4E]">
                    FDIC & ISO-27001 Certified
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#4B5563]">
                    Institutional-grade governance backed by real-time ledger verification.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: BANK'S STORY */}
          <div className="lg:col-span-6 lg:pt-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DBE2EF] bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#3F72AF]">
              About Trustora Bank
            </span>

            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#112D4E] sm:text-4xl">
              Redefining Modern Finance with Security, Clarity, and Speed
            </h2>

            <p className="mt-5 text-base leading-relaxed text-[#4B5563]">
              Founded with a clear conviction that banking should empower rather than slow people down,{" "}
              <span className="font-semibold text-[#112D4E]">Trustora Bank</span>{" "}
              bridges the dependability of traditional financial stewardship with the agility of cloud-native technology.
            </p>

            <p className="mt-4 text-sm leading-relaxed text-[#6B7280]">
              Powered by our proprietary{" "}
              <span className="font-medium text-[#3F72AF]">
                Advanced Digital Banking Management System
              </span>
              , we serve individuals, growing startups, and established enterprises with instant cross-border transfers, intelligent savings tools, and transparent lending—all within one unified platform.
            </p>

            {/* CREDIBILITY CHECKLIST */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "Licensed & Audited Core Banking",
                "Instant Real-Time Settlements",
                "Zero Hidden Account Maintenance Fees",
                "Dedicated 24/7 Relationship Support",
              ].map((point) => (
                <div key={point} className="flex items-center gap-2.5">
                  <CircleCheckFill className="h-4 w-4 shrink-0 text-[#3F72AF]" />
                  <span className="text-sm font-medium text-[#112D4E]">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA BUTTONS */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/open-account"
                className="inline-flex items-center gap-2 rounded-xl bg-[#172554] px-6 py-3 text-sm font-semibold text-white no-underline shadow-sm transition-colors hover:bg-[#112D4E]"
              >
                <span>Open an Account</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/security"
                className="inline-flex items-center gap-2 rounded-xl border border-[#DBE2EF] bg-white px-6 py-3 text-sm font-semibold text-[#112D4E] no-underline transition-colors hover:border-[#3F72AF] hover:text-[#3F72AF]"
              >
                Explore Our Security
              </Link>
            </div>
          </div>
        </div>

        {/* CREDIBILITY METRICS BAR */}
        <div className="mt-20 grid grid-cols-2 gap-6 rounded-3xl border border-[#DBE2EF] bg-white p-8 shadow-sm lg:grid-cols-4">
          {credibilityMetrics.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <span className="text-2xl font-extrabold tracking-tight text-[#112D4E] sm:text-3xl">
                {metric.value}
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                {metric.label}
              </span>
            </div>
          ))}
        </div>

        {/* MISSION & VISION CARDS */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* MISSION */}
          <div className="rounded-3xl border border-[#DBE2EF] bg-white p-8 shadow-sm transition-all hover:border-[#3F72AF]/60">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DBE2EF]/70 text-[#172554]">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-[#112D4E]">
              Our Mission
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">
              To make institutional-grade financial management accessible, transparent, and effortless for every customer—delivering real-time banking tools that protect wealth and unlock sustainable growth.
            </p>
          </div>

          {/* VISION */}
          <div className="rounded-3xl border border-[#DBE2EF] bg-[#FCF8E8]/70 p-8 shadow-sm transition-all hover:border-[#3F72AF]/60">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#172554] text-white">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-[#112D4E]">
              Our Vision
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">
              To set the global benchmark for digital banking trust—where intelligent automation, ironclad security, and human-centered service work seamlessly together across borders.
            </p>
          </div>
        </div>

        {/* CORE VALUES GRID */}
        <div className="mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#3F72AF]">
              What Guides Every Decision
            </span>
            <h3 className="mt-2 text-2xl font-bold text-[#112D4E] sm:text-3xl">
              Our Core Banking Values
            </h3>
            <p className="mt-3 text-sm text-[#6B7280]">
              Every product we launch and every account we safeguard is built on four foundational principles.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="group rounded-2xl border border-[#DBE2EF] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#3F72AF]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F9F7F7] text-[#3F72AF] transition-colors group-hover:bg-[#172554] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="mt-5 text-base font-bold text-[#112D4E]">
                  {title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}