
"use client";

import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Download,
  FileText,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
  AlertTriangle,
  CircleDollarSign,
  MoreHorizontal,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

const kpis = [
  {
    title: "Total Customers",
    value: "12,486",
    change: "+8.2%",
    description: "Compared to last month",
    icon: Users,
    iconBg: "bg-[#DBE2EF]",
    iconColor: "text-[#3F72AF]",
    positive: true,
  },
  {
    title: "Pending KYC",
    value: "248",
    change: "+12",
    description: "Awaiting verification",
    icon: ShieldCheck,
    iconBg: "bg-[#FCF8E8]",
    iconColor: "text-[#A47B29]",
    positive: false,
  },
  {
    title: "Pending Transactions",
    value: "36",
    change: "8 urgent",
    description: "Require your attention",
    icon: ArrowLeftRight,
    iconBg: "bg-[#E5ECF8]",
    iconColor: "text-[#3F72AF]",
    positive: false,
  },
  {
    title: "Loan Applications",
    value: "124",
    change: "18 new",
    description: "Applications to review",
    icon: FileText,
    iconBg: "bg-[#E8EDE9]",
    iconColor: "text-[#54816A]",
    positive: true,
  },
];

const transactions = [
  {
    id: "TXN-829104",
    customer: "Sarah Johnson",
    initials: "SJ",
    type: "Deposit",
    date: "22 Nov, 10:42 AM",
    amount: "+$2,500.00",
    status: "Completed",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: ArrowDownLeft,
  },
  {
    id: "TXN-829103",
    customer: "Michael Chen",
    initials: "MC",
    type: "Withdrawal",
    date: "22 Nov, 10:18 AM",
    amount: "-$850.00",
    status: "Pending",
    color: "text-amber-600",
    bg: "bg-amber-50",
    icon: ArrowUpRight,
  },
  {
    id: "TXN-829102",
    customer: "Emma Williams",
    initials: "EW",
    type: "Transfer",
    date: "22 Nov, 09:56 AM",
    amount: "-$1,200.00",
    status: "Completed",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: ArrowLeftRight,
  },
  {
    id: "TXN-829101",
    customer: "David Miller",
    initials: "DM",
    type: "Deposit",
    date: "22 Nov, 09:24 AM",
    amount: "+$4,200.00",
    status: "Under Review",
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: ArrowDownLeft,
  },
];

const tasks = [
  {
    title: "KYC verification",
    description: "12 customer documents need review",
    count: "12",
    icon: ShieldCheck,
    color: "text-[#3F72AF]",
    bg: "bg-[#DBE2EF]",
  },
  {
    title: "Transaction requests",
    description: "8 transactions awaiting review",
    count: "08",
    icon: ArrowLeftRight,
    color: "text-amber-700",
    bg: "bg-[#FCF8E8]",
  },
  {
    title: "Loan applications",
    description: "6 new applications received",
    count: "06",
    icon: FileText,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
];

const monthlyBars = [
  { month: "Jan", income: 48, outgoing: 32 },
  { month: "Feb", income: 65, outgoing: 42 },
  { month: "Mar", income: 54, outgoing: 36 },
  { month: "Apr", income: 78, outgoing: 49 },
  { month: "May", income: 61, outgoing: 43 },
  { month: "Jun", income: 88, outgoing: 56 },
  { month: "Jul", income: 70, outgoing: 45 },
  { month: "Aug", income: 92, outgoing: 61 },
  { month: "Sep", income: 76, outgoing: 51 },
  { month: "Oct", income: 84, outgoing: 57 },
  { month: "Nov", income: 96, outgoing: 65 },
  { month: "Dec", income: 72, outgoing: 48 },
];

function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: string;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div>
        <h2 className="text-base font-bold text-[#112D4E]">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-xs text-[#6B7280]">{subtitle}</p>
        )}
      </div>

      {action && (
        <button className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#3F72AF] transition hover:text-[#112D4E]">
          {action}
          <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}

function MoneyFlowChart() {
  const dots = Array.from({ length: 12 * 23 }, (_, index) => {
    const row = Math.floor(index / 23);
    const col = index % 23;

    const wave =
      Math.sin(col * 0.38) * 2.2 +
      Math.cos(col * 0.2) * 1.4 +
      5.5;

    const distance = Math.abs(row - wave);
    const visible = distance < 4.5;

    return {
      row,
      col,
      visible,
      active: distance < 1.8,
    };
  });

  return (
    <svg
      viewBox="0 0 460 155"
      className="h-[150px] w-full"
      preserveAspectRatio="none"
    >
      {dots.map((dot) =>
        dot.visible ? (
          <circle
            key={`${dot.row}-${dot.col}`}
            cx={dot.col * 19 + 8}
            cy={dot.row * 12 + 10}
            r={dot.active ? 3 : 2}
            fill={dot.active ? "#3F72AF" : "#DBE2EF"}
            opacity={dot.active ? 1 : 0.8}
          />
        ) : null
      )}
      <path
        d="M8 111 C55 102, 70 76, 105 83 S165 112, 198 69 S260 35, 290 57 S340 94, 375 48 S425 28, 445 20"
        fill="none"
        stroke="#3F72AF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="4 5"
      />
    </svg>
  );
}

function VerificationGauge() {
  const totalDots = 25;
  const completed = 19;

  return (
    <div className="relative mx-auto h-[135px] w-[240px]">
      <svg viewBox="0 0 240 145" className="h-full w-full">
        {Array.from({ length: totalDots }, (_, index) => {
          const angle = Math.PI + (Math.PI * index) / (totalDots - 1);
          const x = 120 + 100 * Math.cos(angle);
          const y = 116 + 100 * Math.sin(angle);

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="5"
              fill={index < completed ? "#3F72AF" : "#DBE2EF"}
            />
          );
        })}
      </svg>

      <div className="absolute inset-x-0 bottom-1 flex flex-col items-center">
        <span className="text-3xl font-bold tracking-tight text-[#112D4E]">
          76%
        </span>
        <span className="text-[10px] font-medium text-[#6B7280]">
          Verification completed
        </span>
      </div>
    </div>
  );
}

export default function BankStaffPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(" ")[0] || "Team Member";

  return (
    <div className="min-h-screen bg-[#F9F7F7] text-[#4B5563]">
      {/* SOFT BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#DBE2EF]/50 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 h-[350px] w-[350px] rounded-full bg-[#DBE2EF]/40 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] space-y-7 p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <header className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#6B7280]">
                Branch operations / Overview
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#112D4E] sm:text-3xl">
              Good morning, {userName}
              <span className="ml-2">✦</span>
            </h1>

            <p className="mt-2 text-sm text-[#6B7280]">
              Welcome to your Banking Staff workspace. Here's what's happening
              with your branch today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-1 sm:flex-none">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
              />
              <input
                type="search"
                placeholder="Search anything..."
                className="h-11 w-full rounded-xl border border-[#DBE2EF] bg-white/80 pl-9 pr-3 text-xs outline-none transition placeholder:text-[#9CA3AF] focus:border-[#3F72AF] focus:ring-2 focus:ring-[#3F72AF]/10 sm:w-52"
              />
            </div>

            <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#DBE2EF] bg-white/80 text-[#112D4E] transition hover:bg-[#DBE2EF]/50">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
            </button>

            <button className="flex h-11 items-center gap-2 rounded-xl bg-[#172554] px-4 text-xs font-semibold text-white shadow-lg shadow-[#172554]/10 transition hover:bg-[#112D4E]">
              <CalendarDays size={15} />
              <span>22 Nov 2026</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </header>

        {/* FEATURED OPERATIONS CARDS */}
        <section className="grid gap-4 xl:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl bg-[#112D4E] p-5 text-white shadow-xl shadow-[#112D4E]/10 sm:p-6">
            <div className="absolute -right-10 -top-14 h-48 w-48 rounded-full border-[25px] border-white/[0.04]" />
            <div className="absolute -bottom-24 right-20 h-48 w-48 rounded-full bg-[#3F72AF]/20 blur-2xl" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[2px] text-[#DBE2EF]/70">
                  Branch activity
                </span>
                <Activity size={19} className="text-[#DBE2EF]" />
              </div>

              <p className="mt-7 text-3xl font-bold tracking-tight">
                2,846
              </p>
              <p className="mt-1 text-xs text-[#DBE2EF]/70">
                Transactions processed this month
              </p>

              <div className="mt-5 flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                  <TrendingUp size={12} />
                  14.8%
                </span>
                <span className="text-[10px] text-[#DBE2EF]/60">
                  vs. previous month
                </span>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white/80 p-5 shadow-sm backdrop-blur-xl sm:p-6">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#DBE2EF]/60 blur-2xl" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[2px] text-[#6B7280]">
                  Account portfolio
                </span>
                <div className="rounded-xl bg-[#DBE2EF] p-2 text-[#3F72AF]">
                  <Wallet size={18} />
                </div>
              </div>

              <p className="mt-7 text-3xl font-bold tracking-tight text-[#112D4E]">
                8,920
              </p>
              <p className="mt-1 text-xs text-[#6B7280]">
                Active customer accounts
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-[10px] text-[#6B7280]">
                  Account activity
                </span>
                <span className="text-xs font-bold text-[#3F72AF]">
                  92.4%
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#DBE2EF]">
                <div className="h-full w-[92.4%] rounded-full bg-[#3F72AF]" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#E8E1C9] bg-[#FCF8E8] p-5 shadow-sm sm:p-6">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#F0E8C9] blur-2xl" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[2px] text-[#8A784D]">
                  Your review queue
                </span>
                <div className="rounded-xl bg-white/80 p-2 text-[#A47B29]">
                  <Clock3 size={18} />
                </div>
              </div>

              <p className="mt-7 text-3xl font-bold tracking-tight text-[#172554]">
                36
              </p>
              <p className="mt-1 text-xs text-[#8A784D]">
                Items awaiting your attention
              </p>

              <div className="mt-5 flex items-center gap-2">
                <span className="rounded-full bg-[#F0E8C9] px-2.5 py-1 text-[10px] font-semibold text-[#8A6420]">
                  8 urgent
                </span>
                <span className="text-[10px] text-[#8A784D]">
                  Prioritize pending reviews
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* KPI CARDS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {kpis.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-[#DBE2EF]/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#112D4E]/5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#6B7280]">
                    {item.title}
                  </span>
                  <div className={`rounded-xl p-2.5 ${item.iconBg}`}>
                    <Icon size={19} className={item.iconColor} />
                  </div>
                </div>

                <div className="mt-4 flex items-end justify-between gap-2">
                  <h3 className="text-3xl font-bold tracking-tight text-[#112D4E]">
                    {item.value}
                  </h3>
                  <span
                    className={`mb-1 rounded-full px-2 py-1 text-[10px] font-bold ${item.positive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-[#FCF8E8] text-[#A47B29]"
                      }`}
                  >
                    {item.change}
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-[#9CA3AF]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* CHARTS */}
        <section className="grid gap-5 xl:grid-cols-3">
          {/* MONEY FLOW */}
          <div className="rounded-2xl border border-[#DBE2EF]/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl xl:col-span-2 sm:p-6">
            <SectionHeading
              title="Transaction flow"
              subtitle="Incoming and outgoing transaction activity"
              action="View transactions"
            />

            <div className="mb-5 flex flex-wrap items-center gap-5">
              <div>
                <p className="text-[10px] text-[#6B7280]">
                  Total transaction volume
                </p>
                <p className="mt-1 text-2xl font-bold text-[#112D4E]">
                  $284,590.00
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                +18.6% this month
              </span>
            </div>

            <MoneyFlowChart />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#DBE2EF]/70 pt-4">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-[10px] text-[#6B7280]">
                  <span className="h-2 w-2 rounded-full bg-[#3F72AF]" />
                  Incoming
                </span>
                <span className="flex items-center gap-2 text-[10px] text-[#6B7280]">
                  <span className="h-2 w-2 rounded-full bg-[#DBE2EF]" />
                  Outgoing
                </span>
              </div>

              <span className="text-[10px] text-[#9CA3AF]">
                Last 30 days
              </span>
            </div>
          </div>

          {/* KYC GAUGE */}
          <div className="rounded-2xl border border-[#DBE2EF]/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl sm:p-6">
            <SectionHeading
              title="Verification progress"
              subtitle="Customer KYC overview"
            />

            <VerificationGauge />

            <div className="mt-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#3F72AF]" />
                  <span className="text-xs text-[#6B7280]">
                    Verified customers
                  </span>
                </div>
                <span className="text-xs font-bold text-[#112D4E]">
                  9,482
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#DBE2EF]" />
                  <span className="text-xs text-[#6B7280]">
                    Pending verification
                  </span>
                </div>
                <span className="text-xs font-bold text-[#112D4E]">
                  248
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#FCF8E8] ring-1 ring-[#E8D9A9]" />
                  <span className="text-xs text-[#6B7280]">
                    Rejected / Incomplete
                  </span>
                </div>
                <span className="text-xs font-bold text-[#112D4E]">
                  126
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* MONTHLY OVERVIEW + TASK QUEUE */}
        <section className="grid gap-5 xl:grid-cols-3">
          {/* MONTHLY BAR CHART */}
          <div className="rounded-2xl border border-[#DBE2EF]/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl xl:col-span-2 sm:p-6">
            <SectionHeading
              title="Monthly overview"
              subtitle="Incoming and outgoing transaction volume"
              action="Download report"
            />

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] text-[#6B7280]">
                  Total processed volume
                </p>
                <p className="mt-1 text-2xl font-bold text-[#112D4E]">
                  $1.82M
                </p>
              </div>

              <button className="flex items-center gap-2 rounded-lg border border-[#DBE2EF] px-3 py-2 text-[10px] font-semibold text-[#4B5563] hover:bg-[#DBE2EF]/30">
                <CalendarDays size={13} />
                This year
                <ChevronDown size={13} />
              </button>
            </div>

            <div className="flex h-[190px] gap-3">
              <div className="flex flex-col justify-between pb-6 text-[9px] text-[#9CA3AF]">
                <span>100k</span>
                <span>75k</span>
                <span>50k</span>
                <span>25k</span>
                <span>0</span>
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex flex-1 items-end justify-between gap-1 border-b border-[#DBE2EF]">
                  {monthlyBars.map((bar) => (
                    <div
                      key={bar.month}
                      className="flex h-full flex-1 items-end justify-center gap-0.5 sm:gap-1"
                    >
                      <div
                        className="w-2 rounded-t-sm bg-[#3F72AF] transition-all hover:bg-[#112D4E] sm:w-3"
                        style={{ height: `${bar.income}%` }}
                      />
                      <div
                        className="w-2 rounded-t-sm bg-[#DBE2EF] transition-all hover:bg-[#A9BEDA] sm:w-3"
                        style={{ height: `${bar.outgoing}%` }}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex justify-between">
                  {monthlyBars.map((bar) => (
                    <span
                      key={bar.month}
                      className="text-[8px] text-[#9CA3AF] sm:text-[9px]"
                    >
                      {bar.month}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-5 border-t border-[#DBE2EF]/70 pt-4">
              <span className="flex items-center gap-2 text-[10px] text-[#6B7280]">
                <span className="h-2 w-2 rounded-full bg-[#3F72AF]" />
                Incoming
              </span>
              <span className="flex items-center gap-2 text-[10px] text-[#6B7280]">
                <span className="h-2 w-2 rounded-full bg-[#DBE2EF]" />
                Outgoing
              </span>
            </div>
          </div>

          {/* REVIEW QUEUE */}
          <div className="rounded-2xl border border-[#DBE2EF]/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl sm:p-6">
            <SectionHeading
              title="Pending actions"
              subtitle="Your operational review queue"
              action="View all"
            />

            <div className="space-y-3">
              {tasks.map((task) => {
                const Icon = task.icon;

                return (
                  <div
                    key={task.title}
                    className="group flex items-center gap-3 rounded-xl border border-[#DBE2EF]/70 bg-white/70 p-3 transition hover:border-[#3F72AF]/40 hover:bg-[#DBE2EF]/20"
                  >
                    <div className={`rounded-xl p-2.5 ${task.bg}`}>
                      <Icon size={18} className={task.color} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#112D4E]">
                        {task.title}
                      </p>
                      <p className="mt-1 text-[10px] text-[#6B7280]">
                        {task.description}
                      </p>
                    </div>

                    <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#F9F7F7] px-2 text-xs font-bold text-[#112D4E]">
                      {task.count}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-xl bg-[#112D4E] p-4 text-white">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-[#F3D58A]" />
                <p className="text-xs font-semibold">Priority reminder</p>
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-[#DBE2EF]">
                Review urgent transaction requests and outstanding KYC
                submissions first.
              </p>
            </div>
          </div>
        </section>

        {/* RECENT TRANSACTIONS */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF]/80 bg-white/80 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <h2 className="text-base font-bold text-[#112D4E]">
                Recent transactions
              </h2>
              <p className="mt-1 text-xs text-[#6B7280]">
                Monitor the latest customer banking activities
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="flex items-center gap-2 rounded-lg border border-[#DBE2EF] px-3 py-2 text-[10px] font-semibold text-[#4B5563] hover:bg-[#DBE2EF]/30">
                <Download size={13} />
                Export
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-[#172554] px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-[#112D4E]">
                View all transactions
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-y border-[#DBE2EF]/70 bg-[#F9F7F7]/80 text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-4 py-3">Transaction ID</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => {
                  const Icon = transaction.icon;

                  return (
                    <tr
                      key={transaction.id}
                      className="border-b border-[#DBE2EF]/50 transition hover:bg-[#DBE2EF]/15"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DBE2EF] text-[10px] font-bold text-[#112D4E]">
                            {transaction.initials}
                          </div>
                          <span className="text-xs font-semibold text-[#112D4E]">
                            {transaction.customer}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-[11px] text-[#6B7280]">
                        {transaction.id}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-xs text-[#4B5563]">
                          <Icon size={14} />
                          {transaction.type}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-[11px] text-[#6B7280]">
                        {transaction.date}
                      </td>

                      <td
                        className={`px-4 py-4 text-xs font-bold ${transaction.color}`}
                      >
                        {transaction.amount}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${transaction.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : transaction.status === "Pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-blue-50 text-blue-700"
                            }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {transaction.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          aria-label={`More options for ${transaction.id}`}
                          className="rounded-lg p-2 text-[#9CA3AF] transition hover:bg-[#DBE2EF]/50 hover:text-[#112D4E]"
                        >
                          <MoreHorizontal size={17} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-between gap-2 px-6 py-4 sm:flex-row sm:items-center">
            <p className="text-[10px] text-[#9CA3AF]">
              Showing 4 of 2,846 transactions
            </p>
            <button className="flex items-center gap-1 text-[10px] font-bold text-[#3F72AF] hover:text-[#112D4E]">
              See all transactions
              <ChevronRight size={13} />
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="flex flex-col justify-between gap-2 pb-3 text-[10px] text-[#9CA3AF] sm:flex-row sm:items-center">
          <p>© 2026 Trustora Bank. Staff Portal.</p>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={12} className="text-emerald-600" />
            <span>All systems operational</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
