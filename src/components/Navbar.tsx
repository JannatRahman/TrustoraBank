
"use client";

import { useEffect, useState } from "react";
import { Button, Link } from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";


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
  const {data:session , isPending } = useSession();
  const user = session?.user;
  const router = useRouter();
  const handleSignOut = async () => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        router.push("/");
      },
    },
  });
};

const [currentYear, setCurrentYear] = useState<number | null>(null);



  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when pressing Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          isScrolled
            ? "border-gray-200 bg-white/95 shadow-md backdrop-blur-xl"
            : "border-transparent bg-white"
        }`}
      >
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto] items-center px-5 lg:grid-cols-[1fr_auto_1fr] lg:px-8">

          {/* LEFT: LOGO AND BANK NAME */}
          <Link
            href="/"
            className="flex items-center gap-3 text-gray-900 no-underline"
          >
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
              <span className="text-lg font-bold tracking-tight text-blue-950">
                Trustora
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-[3px] text-gray-500">
                Bank
              </span>
            </div>
          </Link>

          {/* CENTER: DESKTOP NAVIGATION */}
          <ul className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-950 no-underline"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* RIGHT: ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-3">

            {/* DESKTOP BUTTONS */}
            <div className="hidden items-center gap-3 lg:flex">
              {
                user ? <>
                Welcome, {user.name}
                <Button onClick={handleSignOut} className="rounded-lg bg-blue-950 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-900 no-underline">Signout</Button>
                </> :
                <Link
                href="/login"
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-blue-950 transition-colors hover:bg-blue-50 no-underline"
              >
                Login
              </Link>
              }
              

              <Link
                href="/register"
                className="rounded-lg bg-blue-950 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-900 no-underline"
              >
                Open an Account
              </Link>
            </div>

            {/* MOBILE HAMBURGER */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 text-blue-950 transition-colors hover:bg-gray-100 lg:hidden"
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
      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 lg:hidden ${
          isMenuOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* MOBILE SLIDE-IN DRAWER */}
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
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950 text-white">
              <span className="text-lg font-bold">T</span>
            </div>

            <span className="text-lg font-bold text-blue-950">
              Trustora Bank
            </span>
          </div>

          <button
            type="button"
            onClick={closeMenu}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* DRAWER NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Navigation
          </p>

          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className="block rounded-lg px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-950 no-underline"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* DRAWER ACTIONS */}
          <div className="mt-10 flex flex-col gap-3 border-t border-gray-100 pt-8">
            <Link
              href="/login"
              onClick={closeMenu}
              className="flex justify-center rounded-lg border border-blue-950 px-5 py-3 font-semibold text-blue-950 no-underline"
            >
              Login
            </Link>

            <Link
              href="/register"
              onClick={closeMenu}
              className="flex justify-center rounded-lg bg-blue-950 px-5 py-3 font-semibold text-white no-underline"
            >
              Open an Account
            </Link>
          </div>
        </div>

        {/* DRAWER FOOTER */}
        
      </aside>
    </>
  );
}

export default Navbar;
