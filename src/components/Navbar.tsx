
"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Landmark,
} from "lucide-react";
import { useSession, authClient } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/", id: "home" },
  { name: "Services", href: "/#services", id: "services" },
  { name: "Loans", href: "/#loans", id: "loans" },
  { name: "Security", href: "/#security", id: "security" },
  { name: "About", href: "/#about", id: "about" },
  { name: "Contact", href: "/#contact", id: "contact" },
];

const sectionIds = [
  "about",
  "services",
  "loans",
  "security",
  "contact",
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const { data: session, isPending } = useSession();
  const user = session?.user;

  const router = useRouter();
  const pathname = usePathname();

  // Role-based dashboard destination
  const dashboardHref =
    user?.role === "admin"
      ? "/dashboard/admin"
      : user?.role === "banking-staff"
        ? "/dashboard/bankStaff"
        : "/dashboard/customer";

  // Close mobile menu after route navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Track navbar scroll appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Detect the currently visible homepage section
  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY;
      const activationPoint = 150;

      // Home is active near the top of the homepage
      if (scrollPosition < 120) {
        setActiveSection("home");
        return;
      }

      // Keep Contact active at the bottom of the page
      const isAtBottom =
        window.innerHeight + scrollPosition >=
        document.documentElement.scrollHeight - 5;

      if (isAtBottom && document.getElementById("contact")) {
        setActiveSection("contact");
        return;
      }

      const visibleSections = sectionIds
        .map((id) => {
          const element = document.getElementById(id);

          if (!element) return null;

          const rect = element.getBoundingClientRect();

          return {
            id,
            top: rect.top,
            bottom: rect.bottom,
          };
        })
        .filter(
          (
            section,
          ): section is {
            id: string;
            top: number;
            bottom: number;
          } => section !== null,
        );

      // Find the section currently crossing the activation point
      const currentSection = visibleSections.find(
        (section) =>
          section.top <= activationPoint &&
          section.bottom > activationPoint,
      );

      if (currentSection) {
        setActiveSection(currentSection.id);
        return;
      }

      // If between sections, select the nearest upcoming section
      const upcomingSections = visibleSections.filter(
        (section) => section.top > activationPoint,
      );

      if (upcomingSections.length > 0) {
        const nearestSection = upcomingSections.reduce((closest, section) =>
          section.top < closest.top ? section : closest,
        );

        setActiveSection(nearestSection.id);
      }
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });

    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [pathname]);

  // Escape key closes mobile menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  // Sign out
  const handleSignOut = async () => {
    closeMenu();

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  // Active navigation link
  const isActiveLink = (id: string) => {
    return pathname === "/" && activeSection === id;
  };

  return (
    <>
      {/* NAVBAR */}
      <header
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${isScrolled
            ? "border-gray-200/80 bg-white/95 shadow-sm backdrop-blur-xl"
            : "border-gray-100 bg-white"
          }`}
      >
        <nav
          className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 xl:px-10"
          aria-label="Main navigation"
        >
          {/* LOGO */}
          <NextLink
            href="/"
            className="flex shrink-0 items-center gap-3 no-underline"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#112D4E] text-white shadow-sm">
              <Landmark size={22} strokeWidth={1.8} />
            </div>

            <div className="flex flex-col">
              <span className="text-[19px] font-bold leading-tight tracking-tight text-[#112D4E]">
                Trustora
              </span>

              <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[3px] text-gray-500">
                Bank
              </span>
            </div>
          </NextLink>

          {/* DESKTOP NAVIGATION */}
          <ul className="hidden items-center gap-2 xl:flex">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.id);

              return (
                <li key={link.name}>
                  <NextLink
                    href={link.href}
                    aria-current={isActive ? "location" : undefined}
                    className={`group relative flex items-center px-3 py-3 text-[13px] font-semibold no-underline transition-colors duration-300 after:absolute after:bottom-1 after:left-3 after:right-3 after:h-[2px] after:origin-center after:rounded-full after:bg-[#3F72AF] after:transition-transform after:duration-300 after:content-[''] ${isActive
                        ? "text-[#172554] after:scale-x-100"
                        : "text-gray-500 after:scale-x-0 hover:text-[#172554] hover:after:scale-x-100"
                      }`}
                  >
                    {link.name}
                  </NextLink>
                </li>
              );
            })}
          </ul>

          {/* DESKTOP AUTH ACTIONS */}
          <div className="hidden shrink-0 items-center gap-3 xl:flex">
            {isPending ? (
              <div className="h-9 w-36 animate-pulse rounded-full bg-gray-100" />
            ) : user ? (
              <>
                {user.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-8 w-8 rounded-full border border-[#DBE2EF] object-cover"
                  />
                )}
                <span className="hidden max-w-32 truncate text-sm font-medium text-gray-600 2xl:block">
                  Welcome, {user.name || "User"}
                </span>

                {dashboardHref && (
                  <NextLink
                    href={dashboardHref}
                    className="flex items-center gap-2 rounded-full border border-[#DBE2EF] px-4 py-2.5 text-[13px] font-semibold text-[#112D4E] no-underline transition-all hover:border-[#3F72AF] hover:bg-[#DBE2EF]/40"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </NextLink>
                )}

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex cursor-pointer items-center gap-2 rounded-full bg-[#112D4E] px-4 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[#1D4168]"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <NextLink
                  href="/login"
                  className="rounded-full px-4 py-2.5 text-[13px] font-semibold text-[#112D4E] no-underline transition-colors hover:bg-gray-100"
                >
                  Login
                </NextLink>

                <NextLink
                  href="/register"
                  className="rounded-full bg-[#112D4E] px-5 py-2.5 text-[13px] font-semibold text-white no-underline shadow-sm transition-all hover:bg-[#1D4168] hover:shadow-md"
                >
                  Open an Account
                </NextLink>
              </>
            )}
          </div>

          {/* MOBILE / TABLET MENU BUTTON */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-gray-200 text-[#112D4E] transition-colors hover:bg-gray-50 xl:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* MOBILE BACKDROP */}
      <button
        type="button"
        onClick={closeMenu}
        tabIndex={isMenuOpen ? 0 : -1}
        aria-label="Close navigation menu"
        className={`fixed inset-0 z-[60] cursor-pointer bg-[#112D4E]/35 backdrop-blur-[2px] transition-opacity duration-300 xl:hidden ${isMenuOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
          }`}
      />

      {/* MOBILE / TABLET DRAWER */}
      <aside
        id="mobile-menu"
        className={`fixed right-0 top-0 z-[70] flex h-dvh w-[88%] max-w-[390px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out xl:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        {/* DRAWER HEADER */}
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-gray-100 px-6">
          <NextLink
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-3 no-underline"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#112D4E] text-white">
              <Landmark size={21} />
            </div>

            <div>
              <p className="text-base font-bold text-[#112D4E]">
                Trustora Bank
              </p>
              <p className="text-[9px] font-semibold tracking-[2px] text-gray-500">
                BANKING WITH CONFIDENCE
              </p>
            </div>
          </NextLink>

          <button
            type="button"
            onClick={closeMenu}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#112D4E]"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* DRAWER CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[2px] text-gray-400">
            Explore Trustora
          </p>

          {/* NAVIGATION LINKS */}
          <ul className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.id);

              return (
                <li key={link.name}>
                  <NextLink
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={isActive ? "location" : undefined}
                    className={`flex items-center rounded-xl border-l-[3px] px-4 py-3.5 text-sm font-semibold no-underline transition-all duration-200 ${isActive
                        ? "border-[#3F72AF] bg-[#DBE2EF]/50 text-[#172554]"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-[#112D4E]"
                      }`}
                  >
                    {link.name}
                  </NextLink>
                </li>
              );
            })}
          </ul>

          {/* AUTHENTICATION ACTIONS */}
          <div className="mt-8 border-t border-gray-100 pt-7">
            {isPending ? (
              <div className="h-12 w-full animate-pulse rounded-xl bg-gray-100" />
            ) : user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  {user.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-10 w-10 shrink-0 rounded-full border border-[#DBE2EF] object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Signed in as
                    </p>
                    <p className="mt-0.5 truncate text-sm font-bold text-[#112D4E]">
                      {user.name || "User"}
                    </p>
                  </div>
                </div>

                {dashboardHref && (
                  <NextLink
                    href={dashboardHref}
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#DBE2EF] px-5 py-3.5 text-sm font-semibold text-[#112D4E] no-underline transition-colors hover:bg-[#DBE2EF]/40"
                  >
                    <LayoutDashboard size={17} />
                    Go to Dashboard
                  </NextLink>
                )}

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4168]"
                >
                  <LogOut size={17} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <NextLink
                  href="/login"
                  onClick={closeMenu}
                  className="flex justify-center rounded-xl border border-[#DBE2EF] px-5 py-3.5 text-sm font-semibold text-[#112D4E] no-underline transition-colors hover:bg-gray-50"
                >
                  Login
                </NextLink>

                <NextLink
                  href="/register"
                  onClick={closeMenu}
                  className="flex justify-center rounded-xl bg-[#112D4E] px-5 py-3.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#1D4168]"
                >
                  Open an Account
                </NextLink>
              </div>
            )}
          </div>
        </div>

        {/* DRAWER FOOTER */}
        <div className="border-t border-gray-100 px-6 py-5">
          <p className="text-center text-xs text-gray-400">
            © 2026 Trustora Bank
          </p>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
