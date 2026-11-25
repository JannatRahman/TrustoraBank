
"use client";

import { Link } from "@heroui/react";
import {
  Envelope,
  Handset,
  MapPin,
  LogoFacebook,
  LogoLinkedin,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  LogoGithub,
} from "@gravity-ui/icons";

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Loans & Credit", href: "/loans" },
  { name: "Security", href: "/security" },
];

const quickLinks = [
  { name: "Open an Account", href: "/register" },
  { name: "Customer Login", href: "/login" },
  { name: "Interest Rates", href: "/rates" },
  { name: "Help Center", href: "/help" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Use", href: "/terms" },
  { name: "Legal", href: "/legal" },
  { name: "Site Map", href: "/sitemap" },
];

const socialLinks = [
  {
    name: "Github",
    href: "https://github.com/JannatRahman",
    icon: LogoGithub,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/jannat-amila-rahman/",
    icon: LogoLinkedin,
  },
];

function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-white text-[#112D4E]">
      <style jsx global>{`
        @keyframes footerFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .footer-fade-up {
          animation: footerFadeUp 0.7s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-fade-up {
            animation: none;
          }
        }
      `}</style>

      {/* TOP CALL TO ACTION */}
      <section className="px-5 pb-16 pt-20 sm:px-7 sm:pb-20 lg:px-8 lg:pt-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#172554] px-7 py-12 sm:px-12 sm:py-16 lg:px-16">
          {/* Background decoration */}
          <div className="pointer-events-none absolute -right-20 -top-36 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-5 -top-20 h-60 w-60 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-[#3F72AF]/20 blur-[90px]" />

          <div className="relative flex flex-col items-start justify-between gap-9 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2">
                <ShieldCheck className="h-4 w-4 text-[#DBE2EF]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#DBE2EF]">
                  The Trustora Experience
                </span>
              </div>

              <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.8rem]">
                Take control of your
                <br className="hidden sm:block" /> financial journey.
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-[#DBE2EF] sm:text-base">
                Discover a more convenient way to manage your accounts,
                explore financial services, and stay connected with your money.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link
                href="/register"
                className="group inline-flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-sm font-bold text-[#172554] no-underline transition-all duration-300 hover:-translate-y-1 hover:bg-[#FCF8E8] hover:shadow-xl"
              >
                Open an Account
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-4 text-sm font-semibold text-white no-underline transition-all duration-300 hover:border-white/60 hover:bg-white/10"
              >
                Contact Us
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN FOOTER */}
      <div className="border-t border-[#DBE2EF] bg-[#F9F7F7] px-5 pb-8 pt-16 sm:px-7 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">

            {/* BRAND COLUMN */}
            <div
              className="footer-fade-up space-y-5 lg:col-span-4"
              style={{ animationDelay: "50ms" }}
            >
              <Link
                href="/"
                aria-label="Trustora Bank homepage"
                className="group inline-flex cursor-pointer items-center gap-3 text-[#112D4E] no-underline"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#172554] text-white shadow-md transition-transform duration-300 group-hover:-translate-y-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="27"
                    height="27"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 10h18" />
                    <path d="M5 10v9" />
                    <path d="M9 10v9" />
                    <path d="M15 10v9" />
                    <path d="M19 10v9" />
                    <path d="M2 19h20" />
                    <path d="M12 3 2 8h20L12 3Z" />
                  </svg>
                </div>

                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight">
                    Trustora
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#6B7280]">
                    Bank
                  </span>
                </div>
              </Link>

              <p className="max-w-sm text-sm leading-7 text-[#6B7280]">
                A modern digital banking experience designed to make everyday
                financial activities simpler, clearer, and more convenient.
              </p>

              <div className="flex items-center gap-3 pt-1">
                {socialLinks.map(({ name, href, icon: Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit Trustora on ${name}`}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#DBE2EF] bg-white text-[#112D4E] transition-all duration-300 hover:-translate-y-1 hover:border-[#172554] hover:bg-[#172554] hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* COMPANY LINKS */}
            <div
              className="footer-fade-up lg:col-span-2"
              style={{ animationDelay: "120ms" }}
            >
              <h3 className="text-sm font-bold text-[#112D4E]">
                Company
              </h3>

              <ul className="mt-6 space-y-4">
                {companyLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group inline-flex cursor-pointer items-center gap-1 text-sm text-[#6B7280] no-underline transition-colors duration-200 hover:text-[#3F72AF]"
                    >
                      {item.name}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* QUICK LINKS */}
            <div
              className="footer-fade-up lg:col-span-3"
              style={{ animationDelay: "190ms" }}
            >
              <h3 className="text-sm font-bold text-[#112D4E]">
                Quick Links
              </h3>

              <ul className="mt-6 space-y-4">
                {quickLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group inline-flex cursor-pointer items-center gap-1 text-sm text-[#6B7280] no-underline transition-colors duration-200 hover:text-[#3F72AF]"
                    >
                      {item.name}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACT */}
            <div
              className="footer-fade-up lg:col-span-3"
              style={{ animationDelay: "260ms" }}
            >
              <h3 className="text-sm font-bold text-[#112D4E]">
                Get in Touch
              </h3>

              <p className="mt-5 max-w-xs text-sm leading-6 text-[#6B7280]">
                Have a question about Trustora? Get in touch with our team.
              </p>

              <ul className="mt-6 space-y-5">
                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#3F72AF]">
                    <Envelope className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                      Email
                    </p>
                    <a
                      href="mailto:support@trustorabank.com"
                      className="mt-1 block break-all text-sm font-medium text-[#112D4E] transition-colors hover:text-[#3F72AF]"
                    >
                      support@trustorabank.com
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#3F72AF]">
                    <Handset className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                      Phone
                    </p>
                    <a
                      href="tel:+18004567890"
                      className="mt-1 block text-sm font-medium text-[#112D4E] transition-colors hover:text-[#3F72AF]"
                    >
                      +1 (800) 456-7890
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#3F72AF]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                      Location
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#6B7280]">
                      Digital banking platform
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="flex flex-col gap-5 border-t border-[#DBE2EF] pt-7 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-[#9CA3AF]">
              © 2026 Trustora Bank. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {legalLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="cursor-pointer text-xs font-medium text-[#6B7280] no-underline transition-colors hover:text-[#3F72AF]"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <Link
              href="/"
              className="group inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#3F72AF] no-underline transition-colors hover:text-[#172554]"
            >
              Back to top
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
