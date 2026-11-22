
"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Loans", href: "/loans" },
  { name: "Security", href: "/security" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { data: session, isPending } = useSession();
  const user = session?.user;

  const router = useRouter();
  const pathname = usePathname();

  // Determine the dashboard based on the authenticated user's role.
  const dashboardHref =
    user?.role === "admin"
      ? "/dashboard/admin"
      : user?.role === "banking-staff"
        ? "/dashboard/bankStaff"
        : user?.role === "customer"
          ? "/dashboard/customer"
          : null;

  // Close mobile menu after navigating.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Detect scroll position.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu with Escape.
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

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          isScrolled
            ? "border-gray-200 bg-white/95 shadow-md backdrop-blur-xl"
            : "border-gray-100 bg-white"
        }`}
      >
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto] items-center px-5 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
          {/* LOGO */}
          <NextLink
            href="/"
            className="flex w-fit items-center gap-3 no-underline"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#112D4E] text-white">
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
              <span className="text-lg font-bold leading-tight tracking-tight text-[#112D4E]">
                Trustora
              </span>

              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[3px] text-gray-500">
                Bank
              </span>
            </div>
          </NextLink>

          {/* DESKTOP NAVIGATION */}
          <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);

              return (
                <li key={link.name}>
                  <NextLink
                    href={link.href}
                    className={`relative whitespace-nowrap py-2 text-sm font-medium no-underline transition-colors ${
                      isActive
                        ? "text-[#112D4E]"
                        : "text-gray-600 hover:text-[#112D4E]"
                    }`}
                  >
                    {link.name}

                    {isActive && (
                      <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-[#3F72AF]" />
                    )}
                  </NextLink>
                </li>
              );
            })}
          </ul>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center justify-end gap-3">
            {/* DESKTOP AUTH ACTIONS */}
            <div className="hidden items-center justify-end gap-3 lg:flex">
              {isPending ? (
                <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-100" />
              ) : user ? (
                <>
                  <span className="max-w-36 truncate text-sm font-medium text-[#112D4E]">
                    Welcome, {user.name || "User"}
                  </span>

                  {dashboardHref && (
                    <NextLink
                      href={dashboardHref}
                      className="rounded-lg border border-[#112D4E] px-4 py-2.5 text-sm font-semibold text-[#112D4E] no-underline transition-colors hover:bg-blue-50"
                    >
                      Dashboard
                    </NextLink>
                  )}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="rounded-lg bg-[#112D4E] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4168]"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <NextLink
                    href="/login"
                    className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#112D4E] no-underline transition-colors hover:bg-blue-50"
                  >
                    Login
                  </NextLink>

                  <NextLink
                    href="/register"
                    className="whitespace-nowrap rounded-lg bg-[#112D4E] px-5 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#1D4168]"
                  >
                    Open an Account
                  </NextLink>
                </>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((previous) => !previous)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 text-[#112D4E] transition-colors hover:bg-gray-100 lg:hidden"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
                strokeLinecap="round"
              >
                {isMenuOpen ? (
                  <path d="M6 6l12 12M18 6 6 18" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE BACKDROP */}
      <button
        type="button"
        onClick={closeMenu}
        tabIndex={isMenuOpen ? 0 : -1}
        aria-label="Close navigation menu"
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 lg:hidden ${
          isMenuOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      />

      {/* MOBILE DRAWER */}
      <aside
        id="mobile-menu"
        className={`fixed right-0 top-0 z-[70] flex h-dvh w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        {/* DRAWER HEADER */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-gray-100 px-6">
          <NextLink
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-3 no-underline"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#112D4E] text-white">
              <span className="text-lg font-bold">T</span>
            </div>

            <span className="text-lg font-bold text-[#112D4E]">
              Trustora Bank
            </span>
          </NextLink>

          <button
            type="button"
            onClick={closeMenu}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100"
            aria-label="Close menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* DRAWER CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Navigation
          </p>

          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);

              return (
                <li key={link.name}>
                  <NextLink
                    href={link.href}
                    onClick={closeMenu}
                    className={`block rounded-lg px-4 py-3 text-sm font-medium no-underline transition-colors ${
                      isActive
                        ? "bg-blue-50 text-[#112D4E]"
                        : "text-gray-700 hover:bg-blue-50 hover:text-[#112D4E]"
                    }`}
                  >
                    {link.name}
                  </NextLink>
                </li>
              );
            })}
          </ul>

          {/* MOBILE AUTH ACTIONS */}
          <div className="mt-10 flex flex-col gap-3 border-t border-gray-100 pt-8">
            {isPending ? (
              <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100" />
            ) : user ? (
              <>
                <div className="rounded-lg bg-gray-50 px-4 py-3">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="mt-1 truncate text-sm font-semibold text-[#112D4E]">
                    {user.name || "User"}
                  </p>
                </div>

                {dashboardHref && (
                  <NextLink
                    href={dashboardHref}
                    onClick={closeMenu}
                    className="flex justify-center rounded-lg border border-[#112D4E] px-5 py-3 text-sm font-semibold text-[#112D4E] no-underline transition-colors hover:bg-blue-50"
                  >
                    Dashboard
                  </NextLink>
                )}

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full rounded-lg bg-[#112D4E] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D4168]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <NextLink
                  href="/login"
                  onClick={closeMenu}
                  className="flex justify-center rounded-lg border border-[#112D4E] px-5 py-3 text-sm font-semibold text-[#112D4E] no-underline transition-colors hover:bg-blue-50"
                >
                  Login
                </NextLink>

                <NextLink
                  href="/register"
                  onClick={closeMenu}
                  className="flex justify-center rounded-lg bg-[#112D4E] px-5 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#1D4168]"
                >
                  Open an Account
                </NextLink>
              </>
            )}
          </div>
        </div>

        {/* DRAWER FOOTER */}
        <div className="border-t border-gray-100 px-6 py-4">
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Trustora Bank
          </p>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
