
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@heroui/react";
import {
  Envelope,
  Lock,
  Eye,
  EyeSlash,
  ShieldCheck,
  CircleCheckFill,
  CircleExclamationFill,
  ArrowLeft,
  LogoGooglePlay,
} from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { Landmark } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // EMAIL SIGN IN
  const handleEmailSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        rememberMe,
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(
          error.message || "Unable to sign in. Please check your credentials."
        );
        return;
      }

      setSuccessMessage(
        "Login successful! Redirecting to your Trustora Bank dashboard..."
      );
setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch {
      setErrorMessage(
        "An unexpected network error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // GOOGLE SIGN IN
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(
          error.message || "Google sign-in could not be completed."
        );
        setIsGoogleLoading(false);
      }
    } catch {
      setErrorMessage("Failed to connect with Google authentication.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#F9F7F7] via-[#DBE2EF]/75 to-[#3F72AF]/20 px-4 py-10 text-[#112D4E] sm:px-6 lg:px-8">
      {/* OUTER FROSTED CONTAINER */}
      <div className="w-full max-w-6xl rounded-[32px] border border-[#DBE2EF] bg-white/75 p-4 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">

          {/* LEFT COLUMN: LOGIN CARD */}
          <div className="mx-auto w-full max-w-md lg:col-span-6">
            <div className="overflow-hidden rounded-3xl border border-[#DBE2EF] bg-white shadow-xl">

              <div className="p-6 sm:p-8">

                {/* BANK BRAND & BACK LINK */}
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[#112D4E] no-underline"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#172554] text-white">
                      <Landmark className="h-4 w-4" />
                    </div>

                    <span className="text-sm font-bold tracking-tight">
                      Trustora Bank
                    </span>
                  </Link>

                  <Link
                    href="/"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#3F72AF] no-underline hover:text-[#172554]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Home</span>
                  </Link>
                </div>

                {/* HEADING */}
                <h1 className="mt-5 text-center text-2xl font-bold tracking-tight text-[#112D4E]">
                  Welcome Back
                </h1>

                <p className="mt-1 text-center text-xs text-[#6B7280]">
                  Sign in to access your Trustora Bank account
                </p>

                {/* ERROR MESSAGE */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="mt-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700"
                  >
                    <CircleExclamationFill className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* SUCCESS MESSAGE */}
                {successMessage && (
                  <div
                    role="status"
                    className="mt-5 flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800"
                  >
                    <CircleCheckFill className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* LOGIN FORM */}
                <form
                  onSubmit={handleEmailSignIn}
                  className="mt-6 space-y-4"
                >

                  {/* EMAIL FIELD */}
                  <div>
                    <label
                      htmlFor="login-email"
                      className="mb-1.5 block text-xs font-semibold text-[#112D4E]"
                    >
                      Email Address
                    </label>

                    <div className="flex items-center rounded-full border border-[#DBE2EF] bg-[#F9F7F7] px-3.5 py-2.5 transition-colors focus-within:border-[#3F72AF] focus-within:bg-white">
                      <span className="mr-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#DBE2EF]/80 text-[#172554]">
                        <Envelope className="h-3.5 w-3.5" />
                      </span>

                      <input
                        id="login-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-transparent text-sm text-[#112D4E] placeholder-[#6B7280] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* PASSWORD FIELD */}
                  <div>
                    <label
                      htmlFor="login-password"
                      className="mb-1.5 block text-xs font-semibold text-[#112D4E]"
                    >
                      Password
                    </label>

                    <div className="flex items-center rounded-full border border-[#DBE2EF] bg-[#F9F7F7] px-3.5 py-2.5 transition-colors focus-within:border-[#3F72AF] focus-within:bg-white">
                      <span className="mr-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#DBE2EF]/80 text-[#172554]">
                        <Lock className="h-3.5 w-3.5" />
                      </span>

                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-transparent text-sm text-[#112D4E] placeholder-[#6B7280] focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#4B5563] transition-colors hover:bg-[#DBE2EF]/70 hover:text-[#112D4E]"
                      >
                        {showPassword ? (
                          <EyeSlash className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* REMEMBER ME & FORGOT PASSWORD */}
                  <div className="flex items-center justify-between px-2">
                    <label
                      htmlFor="remember-me"
                      className="flex cursor-pointer items-center gap-2 text-xs font-medium text-[#4B5563]"
                    >
                      <input
                        id="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 cursor-pointer accent-[#172554]"
                      />

                      Remember me
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-[#3F72AF] no-underline hover:text-[#172554] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isLoading || isGoogleLoading}
                    className="mt-2 w-full rounded-full bg-[#172554] py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#112D4E] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </button>
                </form>

                {/* DIVIDER */}
                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#DBE2EF]" />

                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                    Or continue with
                  </span>

                  <div className="h-px flex-1 bg-[#DBE2EF]" />
                </div>

                {/* GOOGLE LOGIN */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || isGoogleLoading}
                  className="flex w-full items-center justify-center gap-2.5 rounded-full border border-[#DBE2EF] bg-[#F9F7F7] py-2.5 text-sm font-semibold text-[#112D4E] transition-colors hover:border-[#3F72AF] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogoGooglePlay className="h-4 w-4 text-[#172554]" />

                  <span>
                    {isGoogleLoading
                      ? "Connecting to Google..."
                      : "Continue with Google"}
                  </span>
                </button>

                {/* REGISTER LINK */}
                <p className="mt-6 text-center text-xs text-[#4B5563]">
                  Do not have a Trustora Bank account?{" "}
                  <Link
                    href="/register"
                    className="font-bold text-[#3F72AF] no-underline hover:text-[#172554] hover:underline"
                  >
                    Register
                  </Link>
                </p>

              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: WELCOME PANEL */}
          <div className="flex flex-col items-center text-center lg:col-span-6">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#172554] text-[#FCF8E8] shadow-lg">
              <Landmark className="h-8 w-8" />
            </div>

            <span className="mt-4 rounded-full border border-[#DBE2EF] bg-[#FCF8E8] px-3.5 py-1 text-xs font-semibold text-[#112D4E]">
              Advanced Digital Banking Management System
            </span>

            <h2 className="mt-4 max-w-md text-2xl font-bold leading-snug text-[#112D4E] sm:text-3xl">
              Welcome to the Trustora Bank Digital Wallet
            </h2>

            <p className="mt-2.5 max-w-md text-sm leading-relaxed text-[#4B5563]">
              Manage savings, instant transfers, and smart loan tools in one
              encrypted banking workspace.
            </p>

            {/* BANKING IMAGE */}
            <div className="relative mt-8 w-full max-w-lg overflow-hidden rounded-3xl border border-[#DBE2EF] bg-white p-2 shadow-xl">

              <img
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=85"
                alt="Digital banking security card and modern financial analytics"
                className="h-64 w-full rounded-2xl object-cover sm:h-72"
              />

              <div className="pointer-events-none absolute inset-2 rounded-2xl bg-gradient-to-t from-[#112D4E]/75 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-left text-white">

                <div className="flex items-center gap-2.5">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#172554] text-[#FCF8E8]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold">
                      Protected by Better Auth &amp; 256-Bit Encryption
                    </p>

                    <p className="text-[11px] text-[#DBE2EF]">
                      Secure access • Reliable banking
                    </p>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
