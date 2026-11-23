
"use client";

import type { ComponentType } from "react";
import { Link } from "@heroui/react";
import {
  ShieldCheck,
  Target,
  Eye,
  Lock,
  Sparkles,
  ArrowRight,
  CircleCheckFill,
} from "@gravity-ui/icons";

interface ValueItem {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

const coreValues: ValueItem[] = [
  {
    title: "Security by Design",
    description:
      "A security-focused approach to banking, with an emphasis on protecting accounts, transactions, and customer information.",
    icon: Lock,
  },
  {
    title: "Clear and Transparent",
    description:
      "Straightforward financial information and intuitive tools that help customers make informed decisions.",
    icon: ShieldCheck,
  },
  {
    title: "Thoughtful Innovation",
    description:
      "Modern digital banking experiences designed to make everyday financial activities simpler and more accessible.",
    icon: Sparkles,
  },
  {
    title: "People Come First",
    description:
      "A customer-focused experience built around accessibility, useful tools, and dependable support.",
    icon: Target,
  },
];

const principles = [
  "Simple and intuitive banking experiences",
  "A focus on account and transaction security",
  "Clear financial information",
  "Customer-focused digital services",
];

const metrics = [
  { value: "24/7", label: "Digital access" },
  { value: "One", label: "Connected banking experience" },
  { value: "Secure", label: "Security-focused design" },
  { value: "Simple", label: "Customer-first approach" },
];

export default function AboutUs() {
  return (
    <main className="w-full overflow-hidden bg-[#F9F7F7] text-[#112D4E]">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes aboutFadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes aboutFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        .about-reveal {
          animation: aboutFadeUp 0.8s ease-out both;
        }

        .about-float {
          animation: aboutFloat 5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .about-reveal,
          .about-float {
            animation: none;
          }

          * {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* HERO / ABOUT INTRO */}
      <section id="about"  className="relative scroll mt-24 px-5 pb-20 pt-20 sm:pb-24 sm:pt-24 lg:px-8 lg:pb-32 lg:pt-28">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#DBE2EF]/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-40 h-[350px] w-[350px] rounded-full bg-[#FCF8E8]/80 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* IMAGE */}
          <div className="about-reveal relative" style={{ animationDelay: "100ms" }}>
            <div className="relative overflow-hidden rounded-[2rem] border border-[#DBE2EF] bg-white p-2 shadow-[0_25px_70px_rgba(17,45,78,0.10)]">
              <div
                role="img"
                aria-label="Professionals discussing modern digital banking"
                className="h-[340px] rounded-[1.5rem] bg-cover bg-center transition-transform duration-700 hover:scale-[1.025] sm:h-[440px] lg:h-[490px]"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=85)",
                }}
              />

              <div className="pointer-events-none absolute inset-2 rounded-[1.5rem] bg-gradient-to-t from-[#112D4E]/60 via-transparent to-transparent" />

              <div className="absolute bottom-7 left-7 right-7 text-white sm:bottom-9 sm:left-9">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#DBE2EF]">
                  Banking, thoughtfully designed
                </p>
                <h2 className="mt-2 max-w-sm text-2xl font-semibold leading-snug sm:text-3xl">
                  A better way to manage your money.
                </h2>
              </div>
            </div>

            {/* FLOATING CARD */}
            <div className="about-float relative mx-4 -mt-5 rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-xl sm:absolute sm:-bottom-8 sm:-right-5 sm:mx-0 sm:mt-0 sm:max-w-[290px]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#172554] text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#112D4E]">
                    Security-focused banking
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">
                    Designed with customer protection in mind.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* INTRO TEXT */}
          <div className="about-reveal lg:pl-2" style={{ animationDelay: "250ms" }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DBE2EF] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#3F72AF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3F72AF]" />
              About Trustora
            </span>

            <h1 className="mt-7 max-w-xl text-4xl font-bold leading-[1.13] tracking-tight text-[#112D4E] sm:text-5xl lg:text-[3.6rem]">
              Banking that puts{" "}
              <span className="text-[#3F72AF]">you</span> first.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#4B5563] sm:text-lg">
              We believe managing money should feel clear, convenient, and
              empowering. Trustora brings essential banking experiences
              together in one thoughtfully designed digital platform.
            </p>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#6B7280]">
              From everyday account management to transfers and loan
              applications, our goal is to make financial tools easier to
              understand and more comfortable to use.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {principles.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CircleCheckFill className="mt-0.5 h-4 w-4 shrink-0 text-[#3F72AF]" />
                  <span className="text-sm font-medium leading-6 text-[#112D4E]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="group inline-flex cursor-pointer items-center gap-3 rounded-xl bg-[#172554] px-6 py-3.5 text-sm font-semibold text-white no-underline shadow-lg shadow-[#172554]/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#112D4E] hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/#security"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#DBE2EF] bg-white px-6 py-3.5 text-sm font-semibold text-[#112D4E] no-underline transition-all duration-300 hover:-translate-y-1 hover:border-[#3F72AF] hover:text-[#3F72AF]"
              >
                Explore Security
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHT STRIP */}
      <section className="px-5 py-5 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-7 rounded-3xl border border-[#DBE2EF] bg-white px-6 py-9 shadow-sm sm:grid-cols-4 sm:px-10">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className="about-reveal text-center sm:text-left"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="text-2xl font-bold tracking-tight text-[#112D4E] sm:text-3xl">
                {metric.value}
              </p>
              <p className="mt-2 text-xs font-medium leading-5 text-[#6B7280] sm:text-sm">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-3 max-w-7xl text-right text-[10px] text-[#9CA3AF]">
          Illustrative platform highlights
        </p>
      </section>

      {/* MISSION & VISION */}
      <section className="px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F72AF]">
              Our Purpose
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#112D4E] sm:text-4xl">
              What drives Trustora
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#6B7280] sm:text-base">
              Everything we build starts with a simple idea: financial
              technology should work for people.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <div className="group rounded-3xl border border-[#DBE2EF] bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#112D4E]/5 sm:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DBE2EF]/70 text-[#172554] transition-colors duration-300 group-hover:bg-[#172554] group-hover:text-white">
                <Target className="h-6 w-6" />
              </div>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[#3F72AF]">
                Our Mission
              </p>
              <h3 className="mt-3 text-2xl font-bold text-[#112D4E]">
                Make banking simpler.
              </h3>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#6B7280]">
                To create accessible, transparent, and intuitive digital
                banking experiences that help people manage their finances
                with greater confidence.
              </p>
            </div>

            <div className="group rounded-3xl border border-[#E8E0C9] bg-[#FCF8E8]/70 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#112D4E]/5 sm:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#172554] text-white transition-transform duration-300 group-hover:rotate-6">
                <Eye className="h-6 w-6" />
              </div>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[#3F72AF]">
                Our Vision
              </p>
              <h3 className="mt-3 text-2xl font-bold text-[#112D4E]">
                Build trust through technology.
              </h3>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#6B7280]">
                To shape a more approachable digital banking experience where
                thoughtful innovation, customer protection, and human needs
                come together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="border-y border-[#DBE2EF] bg-white px-5 py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F72AF]">
                What Matters to Us
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#112D4E] sm:text-4xl">
                Our values shape every experience.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#6B7280]">
              The principles behind the way we think, design, and build our
              digital banking platform.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map(({ title, description, icon: Icon }, index) => (
              <article
                key={title}
                className="about-reveal group rounded-2xl border border-[#DBE2EF] bg-[#F9F7F7] p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[#3F72AF]/60 hover:bg-white hover:shadow-xl hover:shadow-[#112D4E]/5"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#3F72AF] shadow-sm transition-all duration-300 group-hover:bg-[#172554] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-7 text-lg font-bold text-[#112D4E]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#6B7280]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="px-5 py-24 lg:px-8 lg:py-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#172554] px-7 py-16 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute right-20 top-10 h-40 w-40 rounded-full bg-[#3F72AF]/20 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#DBE2EF]">
              Your Next Step
            </span>
            <h2 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Make your banking experience work better for you.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#DBE2EF] sm:text-base">
              Explore a more convenient way to manage accounts, make
              transactions, and stay connected with your finances.
            </p>
            <Link
              href="/register"
              className="group mt-9 inline-flex cursor-pointer items-center gap-3 rounded-xl bg-white px-7 py-4 text-sm font-bold text-[#172554] no-underline transition-all duration-300 hover:-translate-y-1 hover:bg-[#FCF8E8] hover:shadow-xl"
            >
              Open Your Account
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
