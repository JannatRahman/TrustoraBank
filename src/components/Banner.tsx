"use client";

import { useState } from "react";
import { Link } from "@heroui/react";
import {
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Play,
  Pause,
  CircleCheckFill,
  
  Clock,
  Lock,
} from "@gravity-ui/icons";
import { Landmark } from "lucide-react";

interface BannerMediaOption {
  id: string;
  label: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  caption: string;
}

const BANNER_MEDIA_OPTIONS: BannerMediaOption[] = [
  {
    id: "calm-architecture",
    label: "Quiet Finance Scene",
    type: "image",
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=90",
    alt: "Modern glass financial towers rising calmly into soft sky",
    caption: "Calm, dependable digital banking built for clarity",
  },
  {
    id: "treasury-motion",
    label: "Ambient Motion Video",
    type: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4",
    poster:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=2000&q=90",
    alt: "Smooth real-time financial movement and modern commerce flow",
    caption: "Real-time settlements moving quietly behind the scenes",
  },
  {
    id: "executive-desk",
    label: "Modern Banking Desk",
    type: "image",
    src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=2000&q=90",
    alt: "Clean financial planning workspace with analytical ledger view",
    caption: "Structured wealth & account control at your fingertips",
  },
];

export default function HomeLandingBanner() {
  const [selectedMediaId, setSelectedMediaId] = useState<string>("calm-architecture");
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);

  const activeMedia =
    BANNER_MEDIA_OPTIONS.find((item) => item.id === selectedMediaId) ??
    BANNER_MEDIA_OPTIONS[0];

  const handleSelectMedia = (option: BannerMediaOption) => {
    setSelectedMediaId(option.id);
    if (option.type === "video") {
      setIsVideoPlaying(true);
    }
  };

  const toggleVideoPlayback = () => {
    if (!videoEl) return;
    if (videoEl.paused) {
      void videoEl.play();
      setIsVideoPlaying(true);
    } else {
      videoEl.pause();
      setIsVideoPlaying(false);
    }
  };

  return (
    <section
      aria-label="Trustora Bank Hero Banner"
      className="w-full bg-[#F9F7F7] px-4 pt-4 pb-16 text-[#112D4E] sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* MAIN FULL-BLEED EDITORIAL BANNER (INSPIRED BY REFERENCE COMPOSITION) */}
        <div className="relative min-h-[560px] overflow-hidden rounded-3xl border border-[#DBE2EF] bg-[#DBE2EF] shadow-xl sm:min-h-[620px] lg:min-h-[660px]">
          {/* BACKGROUND IMAGE OR LOOPING VIDEO */}
          {activeMedia.type === "video" ? (
            <video
              ref={setVideoEl}
              key={activeMedia.src}
              src={activeMedia.src}
              poster={activeMedia.poster}
              autoPlay
              loop
              muted
              playsInline
              aria-label={activeMedia.alt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <img
              src={activeMedia.src}
              alt={activeMedia.alt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* SOFT ATMOSPHERIC OVERLAY FOR HIGH TEXT READABILITY */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#F9F7F7]/85 via-[#DBE2EF]/45 to-[#112D4E]/45" />

          {/* BANNER CONTENT LAYER */}
          <div className="relative z-10 flex min-h-[560px] flex-col justify-between p-6 sm:min-h-[620px] sm:p-10 lg:min-h-[660px] lg:p-12">
            {/* TOP ROW: PILL BADGE + MEDIA / VIDEO SWITCHER */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#112D4E]/15 bg-[#F9F7F7]/90 px-4 py-1.5 text-xs font-semibold text-[#112D4E] shadow-xs backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#3F72AF]" />
                <span>The future of quiet banking</span>
              </div>

              {/* MEDIA & VIDEO SELECTOR PILLS */}
              <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-[#112D4E]/15 bg-[#F9F7F7]/90 p-1 shadow-xs backdrop-blur-md">
                {BANNER_MEDIA_OPTIONS.map((option) => {
                  const isActive = option.id === activeMedia.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelectMedia(option)}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${isActive
                          ? "bg-[#172554] text-white"
                          : "text-[#4B5563] hover:text-[#112D4E]"
                        }`}
                    >
                      {option.type === "video" ? "Video" : "Photo"} · {option.label.split(" ")[0]}
                    </button>
                  );
                })}

                {activeMedia.type === "video" && (
                  <button
                    type="button"
                    onClick={toggleVideoPlayback}
                    aria-label={isVideoPlaying ? "Pause background video" : "Play background video"}
                    className="ml-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#3F72AF] text-white transition-colors hover:bg-[#172554]"
                  >
                    {isVideoPlaying ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* MIDDLE & LOWER GRID: EDITORIAL HEADLINE LEFT, FLOATING CARD CENTER, CTA BOTTOM RIGHT */}
            <div className="my-auto grid grid-cols-1 items-center gap-8 py-8 lg:grid-cols-12">
              {/* LEFT: SERIF EDITORIAL HEADLINE + SYSTEM SUBTITLE */}
              <div className="lg:col-span-5">
                <h1 className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-[#112D4E] sm:text-5xl lg:text-[56px]">
                  Money should
                  <br />
                  feel effortless.
                </h1>

                <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-[#4B5563] sm:text-base">
                  <span className="font-semibold text-[#112D4E]">
                    Trustora Bank
                  </span>{" "}
                  — Advanced Digital Banking Management System for calm, instant accounts, loans, and protected transfers.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#112D4E]">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#3F72AF]" />
                    <span>2FA &amp; PIN Secured</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#3F72AF]" />
                    <span>Instant Settlement</span>
                  </span>
                </div>
              </div>

              {/* CENTER: FLOATING TRANSLUCENT / GLASS BANKING CARD (INSPIRED BY REFERENCE CARD) */}
              <div className="flex justify-center lg:col-span-4">
                <div className="group relative w-full max-w-[270px] rounded-2xl border border-white/50 bg-gradient-to-br from-[#F9F7F7]/45 via-[#DBE2EF]/35 to-[#172554]/55 p-5 text-[#112D4E] shadow-2xl backdrop-blur-md transition-transform duration-300 hover:-translate-y-1.5">
                  <div className="flex items-center justify-between">
                    {/* EMV Chip */}
                    <div className="h-7 w-9 rounded-md border border-[#112D4E]/30 bg-[#FCF8E8]/75 shadow-inner" />
                    <div className="flex items-center gap-1.5 rounded-full bg-[#172554]/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                      <Landmark className="h-3 w-3 text-[#FCF8E8]" />
                      <span>Trustora</span>
                    </div>
                  </div>

                  <div className="mt-10">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#112D4E]/75">
                      Quiet Vault Balance
                    </p>
                    <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-[#112D4E]">
                      $42,890.00
                    </p>
                  </div>

                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-widest text-[#4B5563]">
                        Digital Card
                      </p>
                      <p className="text-xs font-bold tracking-widest text-[#112D4E]">
                        •••• 8842
                      </p>
                    </div>

                    {/* Dual Overlapping Circles (Inspired by Card Emblem in Image) */}
                    <div className="flex items-center">
                      <span className="h-6 w-6 rounded-full bg-[#172554]/90" />
                      <span className="-ml-2.5 h-6 w-6 rounded-full bg-[#3F72AF]/90" />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: SPACER FOR BALANCED COMPOSITION ON DESKTOP */}
              <div className="hidden lg:col-span-3 lg:block" />
            </div>

            {/* BOTTOM ROW: MEDIA CAPTION LEFT + ROUNDED ACTION BUTTON BOTTOM-RIGHT (LIKE REFERENCE) */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DBE2EF] bg-[#F9F7F7]/90 px-3.5 py-1.5 text-xs font-medium text-[#4B5563] backdrop-blur-md">
                <Lock className="h-3.5 w-3.5 text-[#3F72AF]" />
                <span>{activeMedia.caption}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
                <Link
                  href="/open-account"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#112D4E]/15 bg-[#FCF8E8]/95 px-6 py-3 text-sm font-semibold text-[#172554] no-underline shadow-lg backdrop-blur-md transition-all hover:bg-[#172554] hover:text-white"
                >
                  <span>Start Quietly</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BELOW-BANNER QUICK HIGHLIGHTS STRIP (CONNECTS TO ACCOUNTS, LOANS & SECURITY) */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              title: "Savings, Current & Business",
              desc: "Open digital accounts with transparent yields, instant transfers, and multi-user business tools.",
              href: "/services",
              cta: "Explore Accounts",
              icon: CreditCard,
            },
            {
              title: "Personal, Home & Business Loans",
              desc: "Compare clear credit options and estimate monthly installments with our instant EMI calculator.",
              href: "/loans",
              cta: "Calculate EMI",
              icon: CircleCheckFill,
            },
            {
              title: "PIN, 2FA & Fraud Defense",
              desc: "Protected by hashed transaction PINs, two-factor authentication, encryption, and live monitoring.",
              href: "/security",
              cta: "View Security",
              icon: ShieldCheck,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col justify-between rounded-2xl border border-[#DBE2EF] bg-white p-6 shadow-xs transition-colors hover:border-[#3F72AF]"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DBE2EF]/70 text-[#172554]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-base font-bold text-[#112D4E]">
                    {item.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#4B5563]">
                    {item.desc}
                  </p>
                </div>

                <Link
                  href={item.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3F72AF] no-underline hover:text-[#172554]"
                >
                  <span>{item.cta}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}