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
    <div className="rounded-2xl border border-[#DBE2EF] bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2.5 text-[#3F72AF]">
            <KeyRound size={22} />
          </div>
          <div>
            <h3 className="font-bold text-[#112D4E]">Transaction PIN & Security</h3>
            <p className="mt-0.5 text-xs text-gray-500">
              Required to authorize withdrawals and financial transfers
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
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#112D4E] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1D4168]"
              >
                Set PIN
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setView("CHANGE");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#DBE2EF] px-3.5 py-2 text-xs font-semibold text-[#112D4E] transition hover:bg-gray-50"
              >
                Change PIN
              </button>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800">
          <AlertCircle size={16} className="shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-xs text-gray-500">
          <Loader2 size={18} className="mr-2 animate-spin text-[#3F72AF]" />
          Checking PIN status...
        </div>
      ) : view === "STATUS" ? (
        /* STATUS VIEW */
        <div className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-[#F9F7F7] p-4">
              <span className="text-xs text-gray-500">PIN Configuration</span>
              <div className="mt-1 flex items-center gap-2">
                {pinStatus?.hasPin ? (
                  <>
                    <ShieldCheck size={18} className="text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">Configured & Active</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert size={18} className="text-amber-600" />
                    <span className="text-sm font-semibold text-amber-700">Not Configured</span>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-[#F9F7F7] p-4">
              <span className="text-xs text-gray-500">Lockout & Integrity</span>
              <div className="mt-1 flex items-center gap-2">
                {pinStatus?.isLocked ? (
                  <>
                    <Lock size={18} className="text-red-600" />
                    <span className="text-sm font-semibold text-red-700">
                      Locked (15m lockout active)
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} className="text-[#3F72AF]" />
                    <span className="text-sm font-semibold text-[#112D4E]">
                      {pinStatus?.remainingAttempts} attempt(s) remaining
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {pinStatus?.hasPin && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-gray-500">
                Forgot your transaction PIN? Reset it via your verified email.
              </p>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  handleRequestRecovery();
                }}
                disabled={isSubmitting}
                className="text-xs font-semibold text-[#3F72AF] hover:underline disabled:opacity-50"
              >
                Forgot PIN?
              </button>
            </div>
          )}
        </div>
      ) : view === "SET" || view === "CHANGE" ? (
        /* SET OR CHANGE PIN VIEW */
        <form onSubmit={handleSetOrChangePin} className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {view === "SET" ? "Set New Transaction PIN" : "Change Existing PIN"}
            </h4>
            <button
              type="button"
              onClick={() => setShowPins(!showPins)}
              className="flex items-center gap-1 text-xs text-[#3F72AF] hover:underline"
            >
              {showPins ? <EyeOff size={13} /> : <Eye size={13} />}
              {showPins ? "Hide Digits" : "Show Digits"}
            </button>
          </div>

          {view === "CHANGE" && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#112D4E]">
                Current Transaction PIN
              </label>
              <input
                type={showPins ? "text" : "password"}
                maxLength={6}
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter current 4-6 digit PIN"
                className="w-full rounded-xl border border-[#DBE2EF] px-3.5 py-2.5 text-sm tracking-widest text-[#112D4E] outline-none focus:border-[#3F72AF]"
                required
              />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#112D4E]">
                New Transaction PIN
              </label>
              <input
                type={showPins ? "text" : "password"}
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                placeholder="4 to 6 numeric digits"
                className="w-full rounded-xl border border-[#DBE2EF] px-3.5 py-2.5 text-sm tracking-widest text-[#112D4E] outline-none focus:border-[#3F72AF]"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#112D4E]">
                Confirm New PIN
              </label>
              <input
                type={showPins ? "text" : "password"}
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                placeholder="Re-enter new PIN"
                className="w-full rounded-xl border border-[#DBE2EF] px-3.5 py-2.5 text-sm tracking-widest text-[#112D4E] outline-none focus:border-[#3F72AF]"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setView("STATUS");
              }}
              disabled={isSubmitting}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-xl bg-[#112D4E] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1D4168] disabled:opacity-50"
            >
              {isSubmitting && <Loader2 size={13} className="animate-spin" />}
              {view === "SET" ? "Save PIN" : "Update PIN"}
            </button>
          </div>
        </form>
      ) : (
        /* RECOVER CONFIRM VIEW */
        <form onSubmit={handleConfirmRecovery} className="mt-5 space-y-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3.5 text-xs leading-relaxed text-[#112D4E]">
            <div className="flex items-center gap-2 font-semibold text-[#3F72AF]">
              <Mail size={16} />
              <span>Recovery Code Dispatched</span>
            </div>
            <p className="mt-1 text-gray-600">
              A 6-digit recovery code has been sent to your registered email address. Enter it below alongside your desired new PIN.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#112D4E]">
              6-Digit Recovery Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value.replace(/\D/g, ""))}
              placeholder="e.g. 582914"
              className="w-full rounded-xl border border-[#DBE2EF] px-3.5 py-2.5 text-sm font-mono tracking-widest text-[#112D4E] outline-none focus:border-[#3F72AF]"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#112D4E]">
                New Transaction PIN
              </label>
              <input
                type={showPins ? "text" : "password"}
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                placeholder="4 to 6 numeric digits"
                className="w-full rounded-xl border border-[#DBE2EF] px-3.5 py-2.5 text-sm tracking-widest text-[#112D4E] outline-none focus:border-[#3F72AF]"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#112D4E]">
                Confirm New PIN
              </label>
              <input
                type={showPins ? "text" : "password"}
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                placeholder="Re-enter new PIN"
                className="w-full rounded-xl border border-[#DBE2EF] px-3.5 py-2.5 text-sm tracking-widest text-[#112D4E] outline-none focus:border-[#3F72AF]"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleRequestRecovery}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 text-xs text-[#3F72AF] hover:underline disabled:opacity-50"
            >
              <RefreshCw size={12} />
              Resend Code
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setView("STATUS");
                }}
                disabled={isSubmitting}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSubmitting && <Loader2 size={13} className="animate-spin" />}
                Reset & Unlock PIN
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
