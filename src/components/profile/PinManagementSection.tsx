"use client";

import { useState, useEffect } from "react";
import {
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  ArrowRight,
  RefreshCw,
  Mail,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";

interface PinStatusResponse {
  hasPin: boolean;
  isLocked: boolean;
  lockedUntil?: string | null;
  remainingAttempts: number;
}

export default function PinManagementSection() {
  const [pinStatus, setPinStatus] = useState<PinStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Active view: "STATUS" | "SET" | "CHANGE" | "RECOVER_REQUEST" | "RECOVER_CONFIRM"
  const [view, setView] = useState<
    "STATUS" | "SET" | "CHANGE" | "RECOVER_REQUEST" | "RECOVER_CONFIRM"
  >("STATUS");

  // Inputs
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [showPins, setShowPins] = useState(false);

  // Feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await fetch("/api/accounts/pin/status");
      const json = await res.json();
      if (json.success && json.data) {
        setPinStatus(json.data);
      }
    } catch {
      setErrorMsg("Failed to check transaction PIN status.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const resetForm = () => {
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setRecoveryCode("");
    setErrorMsg(null);
  };

  const handleSetOrChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!newPin || newPin.length < 4 || newPin.length > 6) {
      setErrorMsg("New PIN must be 4 to 6 numeric digits.");
      return;
    }

    if (newPin !== confirmPin) {
      setErrorMsg("New PIN and Confirm PIN do not match.");
      return;
    }

    if (pinStatus?.hasPin && !currentPin) {
      setErrorMsg("Current PIN is required to change your transaction PIN.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/accounts/pin/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPin,
          currentPin: pinStatus?.hasPin ? currentPin : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to update PIN.");
      }

      setSuccessMsg(
        pinStatus?.hasPin
          ? "Transaction PIN changed successfully."
          : "Transaction PIN configured successfully."
      );
      resetForm();
      setView("STATUS");
      await fetchStatus();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to update transaction PIN.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestRecovery = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/accounts/pin/recover/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to request recovery code.");
      }

      setSuccessMsg(data.message);
      setView("RECOVER_CONFIRM");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to dispatch recovery code.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!recoveryCode || recoveryCode.length !== 6) {
      setErrorMsg("Please enter the 6-digit recovery code from your email.");
      return;
    }

    if (!newPin || newPin.length < 4 || newPin.length > 6) {
      setErrorMsg("New PIN must be 4 to 6 numeric digits.");
      return;
    }

    if (newPin !== confirmPin) {
      setErrorMsg("New PIN and Confirm PIN do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/accounts/pin/recover/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: recoveryCode,
          newPin,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Recovery failed.");
      }

      setSuccessMsg(data.message || "Transaction PIN reset successfully.");
      resetForm();
      setView("STATUS");
      await fetchStatus();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to reset PIN with recovery code.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#DBE2EF]/80 bg-white p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#3F72AF] shadow-xs">
            <KeyRound size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#112D4E]">Transaction PIN & Security</h3>
            <p className="mt-0.5 text-xs text-gray-500">
              High-security secondary authorization required for fund transfers and withdrawals
            </p>
          </div>
        </div>

        {view === "STATUS" && !isLoading && (
          <div className="flex items-center gap-2">
            {!pinStatus?.hasPin ? (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setView("SET");
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#112D4E] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1D4168]"
              >
                Set Transaction PIN
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setView("CHANGE");
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#DBE2EF] bg-white px-3.5 py-2 text-xs font-semibold text-[#112D4E] shadow-xs transition hover:bg-gray-50"
              >
                Change PIN
              </button>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="mt-5 flex items-center justify-between gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-xs text-emerald-800 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
            <span className="font-medium">{successMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="mt-5 flex items-center justify-between gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs text-rose-800 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span className="font-medium">{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-rose-700 hover:text-rose-900 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10 text-xs text-gray-500">
          <Loader2 size={18} className="mr-2 animate-spin text-[#3F72AF]" />
          Verifying encrypted PIN configuration...
        </div>
      ) : view === "STATUS" ? (
        /* STATUS VIEW */
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-[#F8FAFD] p-4.5">
              <span className="text-xs font-medium text-gray-500">Protection Status</span>
              <div className="mt-2 flex items-center gap-2.5">
                {pinStatus?.hasPin ? (
                  <>
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-800">Configured & Enforced</p>
                      <p className="text-[11px] text-gray-500">PIN verification active for transfers</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                      <ShieldAlert size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-800">PIN Not Configured</p>
                      <p className="text-[11px] text-gray-500">Please set a PIN before withdrawals</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-[#F8FAFD] p-4.5">
              <span className="text-xs font-medium text-gray-500">Lockout & Rate Limiting</span>
              <div className="mt-2 flex items-center gap-2.5">
                {pinStatus?.isLocked ? (
                  <>
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                      <Lock size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-rose-800">Temporarily Locked</p>
                      <p className="text-[11px] text-gray-500">15-minute lockout cooldown active</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-[#3F72AF]">
                      <Shield size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#112D4E]">
                        {pinStatus?.remainingAttempts ?? 3} Attempt(s) Remaining
                      </p>
                      <p className="text-[11px] text-gray-500">Lockout triggers after 3 consecutive failures</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {pinStatus?.hasPin && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
              <p className="text-gray-500">
                Forgotten your transaction PIN? Reset it securely using your registered email.
              </p>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  handleRequestRecovery();
                }}
                disabled={isSubmitting}
                className="font-semibold text-[#3F72AF] hover:text-[#112D4E] hover:underline cursor-pointer disabled:opacity-50 shrink-0"
              >
                Forgot PIN? Request Recovery Code
              </button>
            </div>
          )}
        </div>
      ) : view === "SET" || view === "CHANGE" ? (
        /* SET OR CHANGE PIN VIEW */
        <form onSubmit={handleSetOrChangePin} className="mt-6 space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {view === "SET" ? "Set New Transaction PIN" : "Update Existing Transaction PIN"}
            </h4>
            <button
              type="button"
              onClick={() => setShowPins(!showPins)}
              className="flex items-center gap-1.5 text-xs font-medium text-[#3F72AF] hover:underline cursor-pointer"
            >
              {showPins ? <EyeOff size={14} /> : <Eye size={14} />}
              {showPins ? "Hide Digits" : "Show Digits"}
            </button>
          </div>

          {view === "CHANGE" && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#112D4E]">
                Current Transaction PIN
              </label>
              <input
                type={showPins ? "text" : "password"}
                maxLength={6}
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter current 4-6 digit PIN"
                className="w-full rounded-xl border border-[#DBE2EF] px-3.5 py-2.5 text-sm tracking-widest text-[#112D4E] outline-none transition focus:border-[#3F72AF] focus:ring-2 focus:ring-[#3F72AF]/20"
                required
              />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#112D4E]">
                New Transaction PIN (4-6 digits)
              </label>
              <input
                type={showPins ? "text" : "password"}
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                placeholder="4 to 6 numeric digits"
                className="w-full rounded-xl border border-[#DBE2EF] px-3.5 py-2.5 text-sm tracking-widest text-[#112D4E] outline-none transition focus:border-[#3F72AF] focus:ring-2 focus:ring-[#3F72AF]/20"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#112D4E]">
                Confirm New Transaction PIN
              </label>
              <input
                type={showPins ? "text" : "password"}
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                placeholder="Re-enter new PIN"
                className="w-full rounded-xl border border-[#DBE2EF] px-3.5 py-2.5 text-sm tracking-widest text-[#112D4E] outline-none transition focus:border-[#3F72AF] focus:ring-2 focus:ring-[#3F72AF]/20"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setView("STATUS");
              }}
              disabled={isSubmitting}
              className="cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#112D4E] px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1D4168] disabled:opacity-50"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {view === "SET" ? "Save & Activate PIN" : "Update PIN"}
            </button>
          </div>
        </form>
      ) : (
        /* RECOVER CONFIRM VIEW */
        <form onSubmit={handleConfirmRecovery} className="mt-6 space-y-5">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-xs leading-relaxed text-[#112D4E]">
            <div className="flex items-center gap-2 font-semibold text-[#3F72AF]">
              <Mail size={16} />
              <span>Recovery Code Dispatched</span>
            </div>
            <p className="mt-1 text-gray-600">
              A 6-digit recovery code has been dispatched to your registered email address. Enter the code below alongside your new PIN.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#112D4E]">
              6-Digit Email Recovery Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value.replace(/\D/g, ""))}
              placeholder="e.g. 582914"
              className="w-full rounded-xl border border-[#DBE2EF] px-3.5 py-2.5 text-sm font-mono tracking-widest text-[#112D4E] outline-none transition focus:border-[#3F72AF] focus:ring-2 focus:ring-[#3F72AF]/20"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#112D4E]">
                New Transaction PIN
              </label>
              <input
                type={showPins ? "text" : "password"}
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                placeholder="4 to 6 numeric digits"
                className="w-full rounded-xl border border-[#DBE2EF] px-3.5 py-2.5 text-sm tracking-widest text-[#112D4E] outline-none transition focus:border-[#3F72AF] focus:ring-2 focus:ring-[#3F72AF]/20"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#112D4E]">
                Confirm New PIN
              </label>
              <input
                type={showPins ? "text" : "password"}
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                placeholder="Re-enter new PIN"
                className="w-full rounded-xl border border-[#DBE2EF] px-3.5 py-2.5 text-sm tracking-widest text-[#112D4E] outline-none transition focus:border-[#3F72AF] focus:ring-2 focus:ring-[#3F72AF]/20"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={handleRequestRecovery}
              disabled={isSubmitting}
              className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#3F72AF] hover:underline disabled:opacity-50"
            >
              <RefreshCw size={12} />
              Resend Recovery Code
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setView("STATUS");
                }}
                disabled={isSubmitting}
                className="cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                Reset & Unlock PIN
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
