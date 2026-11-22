"use client";

import { useState, FormEvent } from "react";
import { Link } from "@heroui/react";
import {

  Envelope,
  Handset,
  MapPin,
  LogoFacebook,

  LogoLinkedin,
} from "@gravity-ui/icons";

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Loans & Credit", href: "/loans" },
  { name: "Security", href: "/security" },
];

const quickLinks = [
  { name: "Open an Account", href: "/open-account" },
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
  { name: "Facebook", href: "https://facebook.com", icon: LogoFacebook },
  { name: "LinkedIn", href: "https://linkedin.com", icon: LogoLinkedin },
];

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="w-full bg-[#F9F7F7] pt-16 text-[#112D4E]">
      {/* TOP BAND WITH OVERLAPPING CTA BANNER */}
      <div className="bg-[#DBE2EF]/60 px-5 pt-10 pb-28 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-r from-[#112D4E] via-[#172554] to-[#3F72AF] p-7 shadow-xl sm:p-11">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* LEFT: BANKING VISUAL CARD */}
            <div className="flex justify-center lg:col-span-5 lg:justify-start">
              <div className="relative w-full max-w-[300px] lg:-mt-16 lg:-mb-6">
                <div className="absolute -inset-2 rounded-3xl bg-[#FCF8E8]/15 blur-xl" />

                <div className="relative flex flex-col justify-between rounded-2xl border border-white/20 bg-gradient-to-br from-[#3F72AF] to-[#112D4E] p-5 text-white shadow-2xl transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#172554] text-[#FCF8E8]">

                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#DBE2EF]">
                        Trustora Bank
                      </span>
                    </div>

                    <div className="h-6 w-8 rounded-md border border-[#FCF8E8]/40 bg-[#FCF8E8]/20" />
                  </div>

                  <div className="my-5">
                    <p className="text-[11px] uppercase tracking-wider text-[#DBE2EF]">
                      Total Balance
                    </p>
                    <p className="mt-0.5 text-2xl font-bold tracking-tight text-white">
                      $84,250.00
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#DBE2EF]">
                    <span className="tracking-widest">•••• •••• •••• 7419</span>
                    <span className="rounded-full bg-[#FCF8E8] px-2.5 py-0.5 text-[11px] font-semibold text-[#172554]">
                      256-Bit SSL
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: NEWSLETTER & UPDATES FORM */}
            <div className="text-white lg:col-span-7">
              <span className="inline-block rounded-full bg-[#FCF8E8]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#FCF8E8]">
                Advanced Digital Banking Management System
              </span>

              <h2 className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">
                Subscribe to our newsletter to get updates on smart banking
              </h2>

              <p className="mt-2 text-sm text-[#DBE2EF]">
                Stay informed about loan rates, security alerts, and new digital financial tools.
              </p>

              <form
                onSubmit={handleSubscribe}
                className="mt-6 flex max-w-lg flex-col rounded-2xl border border-white/25 bg-white/15 p-1.5 backdrop-blur-sm sm:flex-row sm:items-center sm:rounded-full"
              >
                <div className="flex flex-1 items-center px-4 py-2.5 sm:py-0">
                  <Envelope className="mr-2.5 h-4 w-4 shrink-0 text-[#DBE2EF]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-transparent text-sm text-white placeholder-[#DBE2EF]/80 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-[#172554] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#112D4E] sm:rounded-full"
                >
                  {subscribed ? "Subscribed!" : "Subscribe"}
                </button>
              </form>

              <p className="mt-3 text-xs text-[#DBE2EF]/90">
                You will be able to unsubscribe at any time. Read our privacy policy{" "}
                <Link
                  href="/privacy-policy"
                  className="text-xs font-medium text-[#FCF8E8] underline hover:text-white"
                >
                  here
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN WHITE FOOTER SECTION */}
      <div className="-mt-20 border-t border-[#DBE2EF] bg-white px-5 pt-28 pb-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 pb-12 md:grid-cols-2 lg:grid-cols-12">
            {/* COLUMN 1: BRAND INFO & SOCIAL ICONS */}
            <div className="space-y-4 lg:col-span-4">
              <Link
                href="/"
                className="flex items-center gap-3 text-[#112D4E] no-underline"
              >
                <div className="">

                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-950 text-white">
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
                  <span className="text-lg font-bold tracking-tight text-[#112D4E]">
                    Trustora
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[3px] text-[#6B7280]">
                    Bank
                  </span>
                </div>
              </Link>

              <p className="text-xs font-semibold uppercase tracking-wider text-[#3F72AF]">
                Advanced Digital Banking Management System
              </p>

              <p className="max-w-sm text-sm leading-relaxed text-[#6B7280]">
                Secure, transparent, and modern digital banking built to simplify everyday payments, savings, and business finance.
              </p>

              {/* GRAVITY UI SOCIAL ICONS */}
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map(({ name, href, icon: Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DBE2EF] bg-[#F9F7F7] text-[#112D4E] transition-colors hover:border-[#172554] hover:bg-[#172554] hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* COLUMN 2: COMPANY */}
            <div className="lg:col-span-2">
              <h3 className="mb-4 text-sm font-bold text-[#112D4E]">Company</h3>
              <ul className="space-y-3">
                {companyLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm font-medium text-[#4B5563] no-underline transition-colors hover:text-[#3F72AF]"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 3: QUICK LINKS */}
            <div className="lg:col-span-3">
              <h3 className="mb-4 text-sm font-bold text-[#112D4E]">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm font-medium text-[#4B5563] no-underline transition-colors hover:text-[#3F72AF]"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 4: CONTACT DETAILS */}
            <div className="lg:col-span-3">
              <h3 className="mb-4 text-sm font-bold text-[#112D4E]">
                Contact Us
              </h3>
              <ul className="space-y-3.5 text-sm text-[#4B5563]">
                <li className="flex items-start gap-3">
                  <Handset className="mt-0.5 h-4 w-4 shrink-0 text-[#3F72AF]" />
                  <span>+1 (800) 456-7890</span>
                </li>

                <li className="flex items-start gap-3">
                  <Envelope className="mt-0.5 h-4 w-4 shrink-0 text-[#3F72AF]" />
                  <span>support@trustorabank.com</span>
                </li>

                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#3F72AF]" />
                  <span className="text-[#6B7280]">
                    100 Financial District Plaza, Suite 400
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* BOTTOM BAR: COPYRIGHT & LEGAL LINKS */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-[#DBE2EF] pt-6 text-xs text-[#6B7280] sm:flex-row">
            © 2026 Trustora Bank. All rights reserved.
            <div className="flex flex-wrap items-center justify-center gap-6">
              {legalLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-xs font-medium text-[#4B5563] no-underline transition-colors hover:text-[#3F72AF]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;