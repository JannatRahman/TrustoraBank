"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@heroui/react";
import {
  Person,
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

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleEmailSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (name.trim().length < 2) {
      setErrorMessage("Please enter your full name (at least 2 characters).");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please type your password again.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(
          error.message || "Unable to create your account. Please try again."
        );
        return;
      }

      setSuccessMessage(
        "Account created successfully! Redirecting you to your Trustora Bank dashboard..."
      );
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/");
      }, 1400);
    } catch {
      setErrorMessage("An unexpected network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          {/* LEFT COLUMN: ELEVATED AUTH CARD */}
          <div className="mx-auto w-full max-w-md lg:col-span-6">
            <div className="overflow-hidden rounded-3xl border border-[#DBE2EF] bg-white shadow-xl">
              {/* TOP TABS: SIGN IN / SIGN UP */}


              {/* CARD BODY */}
              <div className="p-6 sm:p-8">
                {/* MINI BANK BRAND & BACK TO SIGN IN */}
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
                    href="/login"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#3F72AF] no-underline hover:text-[#172554]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Sign In</span>
                  </Link>
                </div>

                <h1 className="mt-5 text-center text-2xl font-bold tracking-tight text-[#112D4E]">
                  Create Account
                </h1>
                <p className="mt-1 text-center text-xs text-[#6B7280]">
                  Open your protected digital banking profile in seconds
                </p>

                {/* ERROR MESSAGE BANNER */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="mt-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700"
                  >
                    <CircleExclamationFill className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* SUCCESS MESSAGE BANNER */}
                {successMessage && (
                  <div
                    role="status"
                    className="mt-5 flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800"
                  >
                    <CircleCheckFill className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* SIGN-UP FORM */}
                <form onSubmit={handleEmailSignUp} className="mt-6 space-y-4">
                  {/* NAME FIELD */}
                  <div>
                    <label
                      htmlFor="signup-name"
                      className="mb-1.5 block text-xs font-semibold text-[#112D4E]"
                    >
                      Full Name
                    </label>
                    <div className="flex items-center rounded-full border border-[#DBE2EF] bg-[#F9F7F7] px-3.5 py-2.5 transition-colors focus-within:border-[#3F72AF] focus-within:bg-white">
                      <span className="mr-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#DBE2EF]/80 text-[#172554]">
                        <Person className="h-3.5 w-3.5" />
                      </span>
                      <input
                        id="signup-name"
                        type="text"
                        required
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full bg-transparent text-sm text-[#112D4E] placeholder-[#6B7280] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* EMAIL FIELD */}
                  <div>
                    <label
                      htmlFor="signup-email"
                      className="mb-1.5 block text-xs font-semibold text-[#112D4E]"
                    >
                      Email Address
                    </label>
                    <div className="flex items-center rounded-full border border-[#DBE2EF] bg-[#F9F7F7] px-3.5 py-2.5 transition-colors focus-within:border-[#3F72AF] focus-within:bg-white">
                      <span className="mr-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#DBE2EF]/80 text-[#172554]">
                        <Envelope className="h-3.5 w-3.5" />
                      </span>
                      <input
                        id="signup-email"
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

                  {/* PASSWORD FIELD WITH VISIBILITY TOGGLE */}
                  <div>
                    <label
                      htmlFor="signup-password"
                      className="mb-1.5 block text-xs font-semibold text-[#112D4E]"
                    >
                      Password
                    </label>
                    <div className="flex items-center rounded-full border border-[#DBE2EF] bg-[#F9F7F7] px-3.5 py-2.5 transition-colors focus-within:border-[#3F72AF] focus-within:bg-white">
                      <span className="mr-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#DBE2EF]/80 text-[#172554]">
                        <Lock className="h-3.5 w-3.5" />
                      </span>
                      <input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
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
                    <p className="mt-1 pl-2 text-[11px] text-[#6B7280]">
                      Must contain at least 8 characters.
                    </p>
                  </div>

                  {/* TYPE PASSWORD AGAIN (CONFIRM PASSWORD) WITH VISIBILITY TOGGLE */}
                  <div>
                    <label
                      htmlFor="signup-confirm-password"
                      className="mb-1.5 block text-xs font-semibold text-[#112D4E]"
                    >
                      Type Password Again
                    </label>
                    <div
                      className={`flex items-center rounded-full border bg-[#F9F7F7] px-3.5 py-2.5 transition-colors focus-within:bg-white ${passwordsMismatch
                        ? "border-red-300 focus-within:border-red-500"
                        : passwordsMatch
                          ? "border-emerald-300 focus-within:border-emerald-500"
                          : "border-[#DBE2EF] focus-within:border-[#3F72AF]"
                        }`}
                    >
                      <span className="mr-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#DBE2EF]/80 text-[#172554]">
                        <Lock className="h-3.5 w-3.5" />
                      </span>
                      <input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        className="w-full bg-transparent text-sm text-[#112D4E] placeholder-[#6B7280] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirmed password"
                            : "Show confirmed password"
                        }
                        className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#4B5563] transition-colors hover:bg-[#DBE2EF]/70 hover:text-[#112D4E]"
                      >
                        {showConfirmPassword ? (
                          <EyeSlash className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {passwordsMismatch && (
                      <p className="mt-1 pl-2 text-[11px] font-medium text-red-600">
                        Passwords do not match.
                      </p>
                    )}
                    {passwordsMatch && (
                      <p className="mt-1 pl-2 text-[11px] font-medium text-emerald-700">
                        Passwords match.
                      </p>
                    )}
                  </div>

                  
                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isLoading || isGoogleLoading}
                    className="mt-2 w-full rounded-full bg-[#172554] py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#112D4E] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? "Creating Account..." : "Sign Up"}
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

                {/* GOOGLE LOGIN BUTTON */}
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

                {/* FOOTER SIGN-IN LINK */}
                <p className="mt-6 text-center text-xs text-[#4B5563]">
                  Already have a Trustora Bank account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-[#3F72AF] no-underline hover:text-[#172554] hover:underline"
                  >
                    Sign In here
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: BANKING WELCOME & VISUAL PANEL */}
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
              Manage savings, instant transfers, and smart loan tools in one encrypted banking workspace.
            </p>

            {/* HIGH-QUALITY BANKING IMAGE CARD */}
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
                      Instant onboarding • Zero hidden fees
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