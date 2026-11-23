
"use client";

import { Link } from "@heroui/react";
import {
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Clock,
  Lock,
} from "@gravity-ui/icons";
import { Landmark } from "lucide-react";

const features = [
  {
    title: "Everyday Banking",
    description:
      "Manage your accounts, balances, and everyday transactions in one place.",
    href: "/services",
    label: "Explore services",
    icon: CreditCard,
  },
  {
    title: "Flexible Financing",
    description:
      "Explore financing options designed around different financial needs.",
    href: "/loans",
    label: "Explore loans",
    icon: Landmark,
  },
  {
    title: "Security Comes First",
    description:
      "Discover the security-focused features behind the Trustora experience.",
    href: "/security",
    label: "Our security",
    icon: ShieldCheck,
  },
];

export default function HomeLandingBanner() {
  return (
    <main className="w-full overflow-hidden bg-[#F9F7F7] text-[#112D4E]">
      <style jsx global>{`
        @keyframes trustoraFadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes trustoraFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-9px);
          }
        }

        @keyframes trustoraPulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.45;
          }
        }

        .trustora-fade-up {
          animation: trustoraFadeUp 0.85s ease-out both;
        }

        .trustora-float {
          animation: trustoraFloat 5s ease-in-out infinite;
        }

        .trustora-pulse {
          animation: trustoraPulse 2.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .trustora-fade-up,
          .trustora-float,
          .trustora-pulse {
            animation: none !important;
          }

          html {
            scroll-behavior: auto;
          }
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="relative px-5 pb-16 pt-8 sm:px-7 sm:pb-24 sm:pt-12 lg:px-8 lg:pb-28">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-[#DBE2EF]/60 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-[#FCF8E8]/80 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid min-h-[560px] items-center gap-14 lg:grid-cols-2 lg:gap-16 xl:min-h-[620px]">
            {/* LEFT CONTENT */}
            <div
              className="trustora-fade-up relative z-10 order-2 lg:order-1"
              style={{ animationDelay: "100ms" }}
            >
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#DBE2EF] bg-white px-4 py-2 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="trustora-pulse absolute inline-flex h-full w-full rounded-full bg-[#3F72AF]" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3F72AF]" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#3F72AF]">
                  A smarter banking experience
                </span>
              </div>

              <h1 className="mt-8 max-w-2xl text-[2.8rem] font-bold leading-[1.08] tracking-[-0.045em] text-[#112D4E] sm:text-6xl lg:text-[4.25rem] xl:text-[4.7rem]">
                Your money.
                <br />
                Your future.
                <br />
                <span className="text-[#3F72AF]">
                  Your Trustora.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-8 text-[#4B5563] sm:text-lg">
                Experience a more convenient way to manage your finances.
                From everyday banking to financial planning, everything
                starts with a simpler digital experience.
              </p>

              {/* TRUST POINTS */}
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-[#4B5563]">
                  <ShieldCheck className="h-[17px] w-[17px] text-[#3F72AF]" />
                  Customer-focused security
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-[#4B5563]">
                  <Clock className="h-[17px] w-[17px] text-[#3F72AF]" />
                  Convenient digital access
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="group inline-flex cursor-pointer items-center gap-3 rounded-xl bg-[#172554] px-7 py-4 text-sm font-semibold text-white no-underline shadow-lg shadow-[#172554]/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#112D4E] hover:shadow-xl"
                >
                  Open an Account
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/services"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#DBE2EF] bg-white px-7 py-4 text-sm font-semibold text-[#112D4E] no-underline transition-all duration-300 hover:-translate-y-1 hover:border-[#3F72AF] hover:text-[#3F72AF]"
                >
                  Explore Banking
                </Link>
              </div>

              <p className="mt-6 text-xs leading-6 text-[#9CA3AF]">
                Discover banking tools designed around your everyday needs.
              </p>
            </div>

            {/* RIGHT IMAGE COMPOSITION */}
            <div
              className="trustora-fade-up relative order-1 mx-auto w-full max-w-[570px] lg:order-2"
              style={{ animationDelay: "250ms" }}
            >
              {/* Image frame */}
              <div className="relative overflow-hidden rounded-[2rem] border border-white bg-[#DBE2EF] p-2 shadow-[0_30px_90px_rgba(17,45,78,0.14)]">
                <div className="relative h-[340px] overflow-hidden rounded-[1.5rem] sm:h-[440px] lg:h-[490px]">
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85"
                    alt="Contemporary glass architecture representing modern financial services"
                    className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#112D4E]/55 via-transparent to-[#112D4E]/10" />

                  <div className="absolute bottom-7 left-7 right-7 sm:bottom-9 sm:left-9">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#DBE2EF]">
                      The Trustora Experience
                    </p>
                    <h2 className="mt-3 max-w-sm text-2xl font-semibold leading-snug text-white sm:text-3xl">
                      Confidence in every financial decision.
                    </h2>
                  </div>
                </div>
              </div>

              {/* Floating digital banking panel */}
              <div className="trustora-float absolute -bottom-8 -left-2 w-[230px] rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-[0_20px_55px_rgba(17,45,78,0.14)] sm:-left-8 sm:w-[260px]">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172554] text-white">
                    <Landmark size={19} />
                  </div>
                  <span className="rounded-full bg-[#DBE2EF]/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#3F72AF]">
                    Digital Banking
                  </span>
                </div>

                <p className="mt-5 text-sm font-bold text-[#112D4E]">
                  Your finances, in view.
                </p>
                <p className="mt-1 text-xs leading-5 text-[#6B7280]">
                  A connected experience for managing your banking needs.
                </p>

                <div className="mt-4 flex items-center gap-2 border-t border-[#DBE2EF] pt-3">
                  <Lock className="h-3.5 w-3.5 text-[#3F72AF]" />
                  <span className="text-[10px] font-semibold text-[#4B5563]">
                    Security-focused experience
                  </span>
                </div>
              </div>

              {/* Decorative circle */}
              <div className="pointer-events-none absolute -right-5 -top-5 -z-10 h-28 w-28 rounded-full border border-[#3F72AF]/20 sm:-right-9 sm:-top-9 sm:h-40 sm:w-40" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="relative border-t border-[#DBE2EF] bg-white px-5 py-20 sm:px-7 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Section heading */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F72AF]">
              Banking Made Simpler
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#112D4E] sm:text-4xl">
              Everything you need.
              <br className="hidden sm:block" /> Nothing you don't.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#6B7280] sm:text-base">
              Explore the essential services that bring your everyday
              financial activities together.
            </p>
          </div>

          {/* Feature cards */}
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {features.map(({ title, description, href, label, icon: Icon }, index) => (
              <Link
                key={title}
                href={href}
                className="group flex min-h-[255px] cursor-pointer flex-col justify-between rounded-2xl border border-[#DBE2EF] bg-[#F9F7F7] p-7 text-left no-underline transition-all duration-300 hover:-translate-y-2 hover:border-[#3F72AF]/60 hover:bg-white hover:shadow-[0_20px_50px_rgba(17,45,78,0.08)] sm:p-8"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#3F72AF] shadow-sm transition-all duration-300 group-hover:bg-[#172554] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-7 text-lg font-bold text-[#112D4E]">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#6B7280]">
                    {description}
                  </p>
                </div>

                <div className="mt-7 flex items-center gap-2 text-sm font-bold text-[#3F72AF] transition-colors group-hover:text-[#172554]">
                  {label}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
