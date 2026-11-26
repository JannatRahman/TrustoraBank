
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Home,
  ShieldCheck,
  Wallet,
  ArrowLeftRight,
  AlertTriangle,
  FileText,
  Settings,
  LogOut,
  Landmark,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  BriefcaseBusiness,
} from "lucide-react";
import { LayoutSideContentLeft } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { authClient, useSession } from "@/lib/auth-client";
import ThemeToggle from "@/components/theme/ThemeToggle";

// BANKING STAFF NAVIGATION
const staffNavItems = [
  {
    label: "Overview",
    href: "/dashboard/bankStaff",
    icon: LayoutDashboard,
  },
  {
    label: "Customer Management",
    href: "/dashboard/bankStaff/customers",
    icon: Users,
  },
  {
    label: "KYC Verification",
    href: "/dashboard/bankStaff/kyc",
    icon: ShieldCheck,
  },
  {
    label: "Bank Accounts",
    href: "/dashboard/bankStaff/accounts",
    icon: Wallet,
  },
  {
    label: "Transactions",
    href: "/dashboard/bankStaff/transactions",
    icon: ArrowLeftRight,
  },
  {
    label: "Suspicious Activity",
    href: "/dashboard/bankStaff/suspicious",
    icon: AlertTriangle,
  },
  {
    label: "Loan Applications",
    href: "/dashboard/bankStaff/loans",
    icon: FileText,
  },
];

// ADMIN NAVIGATION
const adminNavItems = [
  {
    label: "Dashboard & Analytics",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Customer Management",
    href: "/dashboard/admin/customers",
    icon: Users,
  },
  {
    label: "Bank Account Management",
    href: "/dashboard/admin/accounts",
    icon: Wallet,
  },
  {
    label: "Loan Management",
    href: "/dashboard/admin/loans",
    icon: FileText,
  },
];

// CUSTOMER NAVIGATION
const customerNavItems = [
  {
    label: "Dashboard",
    href: "/dashboard/customer",
    icon: LayoutDashboard,
  },
  {
    label: "My Accounts",
    href: "/dashboard/customer/accounts",
    icon: Wallet,
  },
  {
    label: "Fund Transfer",
    href: "/dashboard/customer/transfer",
    icon: Send,
  },
  {
    label: "Deposit Requests",
    href: "/dashboard/customer/deposits",
    icon: ArrowDownLeft,
  },
  {
    label: "Withdrawal Requests",
    href: "/dashboard/customer/withdrawals",
    icon: ArrowUpRight,
  },
  {
    label: "Transactions",
    href: "/dashboard/customer/transactions",
    icon: History,
  },
  {
    label: "Loans",
    href: "/dashboard/customer/loans",
    icon: BriefcaseBusiness,
  },
];

export function StaffDashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const isAdmin = pathname.startsWith("/dashboard/admin");
  const isCustomer = pathname.startsWith("/dashboard/customer");

  const navItems = isAdmin
    ? adminNavItems
    : isCustomer
      ? customerNavItems
      : staffNavItems;

  const profileHref = isAdmin
    ? "/dashboard/admin/profile"
    : isCustomer
      ? "/dashboard/customer/profile"
      : "/dashboard/bankStaff/profile";

  const portalLabel = isAdmin
    ? "ADMIN PORTAL"
    : isCustomer
      ? "CUSTOMER PORTAL"
      : "STAFF PORTAL";

  const workspaceLabel = isAdmin
    ? "ADMINISTRATION"
    : isCustomer
      ? "MY BANKING"
      : "WORKSPACE";

  const roleLabel = isAdmin
    ? "Administrator"
    : isCustomer
      ? "Bank Customer"
      : "Banking Staff";

  const roleDescription = isAdmin
    ? "Full administrative access"
    : isCustomer
      ? "Personal banking workspace"
      : "Authorized staff workspace";

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  };

  // MAIN ROLE-BASED NAVIGATION
  const navContent = (
    <nav className="flex flex-col gap-1.5">
      {navItems.map((item) => {
        const Icon = item.icon;

        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard/admin" &&
            item.href !== "/dashboard/customer" &&
            item.href !== "/dashboard/bankStaff" &&
            pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${
              isActive
                ? "bg-[#3F72AF] font-semibold text-white shadow-lg"
                : "text-[#DBE2EF] hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon size={19} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  // BACK TO HOMEPAGE
  const homepageLink = (
    <div className="mt-6 border-t border-white/10 pt-4">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#DBE2EF] transition-colors hover:bg-white/10 hover:text-white"
      >
        <Home size={19} />
        <span>Back to Homepage</span>
      </Link>
    </div>
  );

  // PROFILE AND SIGN OUT
  const bottomContent = (
    <div className="border-t border-white/10 p-4">
      <Link
        href={profileHref}
        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
          pathname === profileHref
            ? "bg-white/10 text-white"
            : "text-[#DBE2EF] hover:bg-white/10 hover:text-white"
        }`}
      >
        <Settings size={19} />
        Profile & Settings
      </Link>

      <button
        type="button"
        onClick={handleSignOut}
        className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#DBE2EF] transition-colors hover:bg-red-500/15 hover:text-red-300"
      >
        <LogOut size={19} />
        Sign Out
      </button>

      <div className="mt-2 flex items-center justify-between rounded-xl px-3 py-2 text-xs text-[#DBE2EF]/80">
        <span className="font-medium">Theme Mode</span>
        <ThemeToggle />
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
        {user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name || "User Avatar"}
            className="h-9 w-9 shrink-0 rounded-lg border border-white/20 object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3F72AF] text-sm font-bold text-white">
            {user?.name?.charAt(0) || "U"}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-white">{user?.name || roleLabel}</p>
          <p className="truncate text-[10px] text-[#DBE2EF]/60">
            {roleDescription}
          </p>
        </div>
      </div>
    </div>
  );

  // SIDEBAR HEADER
  const sidebarHeader = (
    <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCF8E8] text-[#172554]">
        <Landmark size={22} />
      </div>

      <div>
        <h2 className="text-lg font-bold">Trustora Bank</h2>
        <p className="text-[10px] font-semibold tracking-[2px] text-[#DBE2EF]">
          {portalLabel}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto bg-[#112D4E] text-[#F9F7F7] lg:flex">
        {sidebarHeader}

        <div className="flex-1 px-4 py-6">
          <p className="mb-4 px-3 text-[10px] font-bold tracking-[2px] text-[#DBE2EF]/60">
            {workspaceLabel}
          </p>

          {navContent}

          {homepageLink}
        </div>

        {bottomContent}
      </aside>

      {/* MOBILE SIDEBAR */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-default bg-[#F9F7F7] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#112D4E] text-white">
            <Landmark size={19} />
          </div>

          <div>
            <p className="text-sm font-bold text-[#112D4E]">
              Trustora Bank
            </p>
            <p className="text-[9px] font-semibold tracking-widest text-[#3F72AF]">
              {portalLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Drawer>
            <Button variant="secondary" isIconOnly={false}>
              <LayoutSideContentLeft />
              Menu
            </Button>

            <Drawer.Backdrop>
              <Drawer.Content placement="left">
                <Drawer.Dialog className="bg-[#112D4E] text-[#F9F7F7]">
                  <Drawer.CloseTrigger />

                  <Drawer.Header className="border-b border-white/10">
                    <Drawer.Heading>
                      {sidebarHeader}
                    </Drawer.Heading>
                  </Drawer.Header>

                  <Drawer.Body className="px-4 py-6">
                    <p className="mb-4 px-3 text-[10px] font-bold tracking-[2px] text-[#DBE2EF]/60">
                      {workspaceLabel}
                    </p>

                    {navContent}

                    {homepageLink}
                  </Drawer.Body>

                  <div className="mt-auto">
                    {bottomContent}
                  </div>
                </Drawer.Dialog>
              </Drawer.Content>
            </Drawer.Backdrop>
          </Drawer>
        </div>
      </div>
    </>
  );
}
