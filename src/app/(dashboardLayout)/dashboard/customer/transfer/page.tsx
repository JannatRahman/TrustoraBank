
"use client";

import { useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  Wallet,
  CreditCard,
  UserRound,
  Hash,
  Banknote,
  FileText,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  X,
  ChevronDown,
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
} from "lucide-react";

type Account = {
  id: string;
  accountNumber: string;
  type: "Savings" | "Current" | "Business";
  balance: number;
  status: "Active" | "Frozen";
};

type Transfer = {
  id: string;
  recipient: string;
  accountNumber: string;
  date: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
};

const accounts: Account[] = [
  {
    id: "1",
    accountNumber: "TRS-1000-4521",
    type: "Savings",
    balance: 245000,
    status: "Active",
  },
  {
    id: "2",
    accountNumber: "TRS-1000-7832",
    type: "Current",
    balance: 580000,
    status: "Active",
  },
  {
    id: "3",
    accountNumber: "TRS-1000-2165",
    type: "Business",
    balance: 125500,
    status: "Active",
  },
];

const initialTransfers: Transfer[] = [
  {
    id: "TRX-2026-00123",
    recipient: "Michael Chen",
    accountNumber: "TRS-1000-8821",
    date: "20 Nov 2026",
    amount: 12000,
    status: "Completed",
  },
  {
    id: "TRX-2026-00116",
    recipient: "Emma Williams",
    accountNumber: "TRS-1000-2165",
    date: "16 Nov 2026",
    amount: 8500,
    status: "Completed",
  },
  {
    id: "TRX-2026-00108",
    recipient: "David Miller",
    accountNumber: "TRS-1000-9024",
    date: "12 Nov 2026",
    amount: 5000,
    status: "Pending",
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

export default function CustomerFundTransferPage() {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0].id);
  const [recipientAccount, setRecipientAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionPin, setTransactionPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  const [transfers, setTransfers] = useState(initialTransfers);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTransaction, setSuccessTransaction] =
    useState<Transfer | null>(null);

  const selectedAccount =
    accounts.find((account) => account.id === selectedAccountId) ?? accounts[0];

  const transferAmount = Number(amount);
  const transferFee = 0;
  const totalDeduction = transferAmount + transferFee;

  const todayTransfers = transfers
    .filter((transfer) => transfer.date === "22 Nov 2026")
    .reduce((total, transfer) => total + transfer.amount, 0);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedAccountId) {
      newErrors.account = "Please select a sender account.";
    }

    if (selectedAccount.status !== "Active") {
      newErrors.account = "This account is not active.";
    }

    if (!recipientAccount.trim()) {
      newErrors.recipient = "Recipient account number is required.";
    } else if (!/^TRS-\d{4}-\d{4}$/.test(recipientAccount.trim())) {
      newErrors.recipient = "Use the format TRS-0000-0000.";
    } else if (
      recipientAccount.trim() === selectedAccount.accountNumber
    ) {
      newErrors.recipient = "You cannot transfer to the same account.";
    }

    if (!amount.trim()) {
      newErrors.amount = "Please enter a transfer amount.";
    } else if (!Number.isFinite(transferAmount) || transferAmount <= 0) {
      newErrors.amount = "Enter a valid amount greater than zero.";
    } else if (transferAmount < 100) {
      newErrors.amount = "Minimum transfer amount is ৳100.";
    } else if (totalDeduction > selectedAccount.balance) {
      newErrors.amount = "Insufficient balance in the selected account.";
    } else if (transferAmount > 200000) {
      newErrors.amount = "Maximum per-transfer limit is ৳200,000.";
    }

    if (!transactionPin.trim()) {
      newErrors.pin = "Transaction PIN is required.";
    } else if (!/^\d{4,6}$/.test(transactionPin)) {
      newErrors.pin = "PIN must contain 4 to 6 digits.";
    }

    if (description.length > 100) {
      newErrors.description = "Description cannot exceed 100 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReviewTransfer = () => {
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmTransfer = () => {
    const newTransfer: Transfer = {
      id: `TRX-2026-${String(Date.now()).slice(-5)}`,
      recipient: "New Bank Recipient",
      accountNumber: recipientAccount.trim(),
      date: "22 Nov 2026",
      amount: transferAmount,
      status: "Completed",
    };

    setTransfers((previous) => [newTransfer, ...previous]);
    setSuccessTransaction(newTransfer);
    setShowConfirmation(false);
    setShowSuccess(true);

    setRecipientAccount("");
    setAmount("");
    setDescription("");
    setTransactionPin("");
    setErrors({});
  };

  const resetForm = () => {
    setShowSuccess(false);
    setSuccessTransaction(null);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-[#3F72AF]">
            Customer Portal / Fund Transfer
          </p>
          <h1 className="text-2xl font-bold text-[#112D4E] sm:text-3xl">
            Fund Transfer
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Transfer money securely to another Trustora Bank account.
          </p>
        </div>

        {/* Summary */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<Wallet size={21} />}
            label="Available Balance"
            value={formatCurrency(selectedAccount.balance)}
            description={`${selectedAccount.type} account`}
            color="blue"
          />
          <SummaryCard
            icon={<ArrowLeftRight size={21} />}
            label="Transfers Today"
            value={String(
              transfers.filter((transfer) => transfer.date === "22 Nov 2026")
                .length
            )}
            description="Illustrative transfer count"
            color="purple"
          />
          <SummaryCard
            icon={<Banknote size={21} />}
            label="Daily Transfer Limit"
            value={formatCurrency(200000)}
            description={`Used: ${formatCurrency(todayTransfers)}`}
            color="green"
          />
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_0.8fr]">
          {/* Transfer Form */}
          <section className="rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
            <div className="border-b border-[#DBE2EF] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-[#3F72AF]">
                  <ArrowLeftRight size={22} />
                </div>
                <div>
                  <h2 className="font-bold text-[#112D4E]">
                    Transfer Details
                  </h2>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Complete the information below
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              {/* Sender Account */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                  From Account
                </label>

                <div className="relative">
                  <Wallet
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3F72AF]"
                  />
                  <select
                    value={selectedAccountId}
                    onChange={(event) => {
                      setSelectedAccountId(event.target.value);
                      setErrors((previous) => ({
                        ...previous,
                        account: "",
                        amount: "",
                      }));
                    }}
                    className="w-full appearance-none rounded-xl border border-[#DBE2EF] bg-white py-3 pl-10 pr-10 text-sm text-[#112D4E] outline-none transition focus:border-[#3F72AF] focus:ring-2 focus:ring-blue-100"
                  >
                    {accounts.map((account) => (
                      <option
                        key={account.id}
                        value={account.id}
                        disabled={account.status !== "Active"}
                      >
                        {account.type} - {account.accountNumber}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                  />
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[#9CA3AF]">
                    Available balance:{" "}
                    <strong className="text-[#112D4E]">
                      {formatCurrency(selectedAccount.balance)}
                    </strong>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle2 size={13} />
                    {selectedAccount.status}
                  </span>
                </div>

                {errors.account && (
                  <ErrorMessage message={errors.account} />
                )}
              </div>

              {/* Recipient */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                  Recipient Account Number
                </label>
                <div className="relative">
                  <Hash
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3F72AF]"
                  />
                  <input
                    type="text"
                    value={recipientAccount}
                    onChange={(event) => {
                      setRecipientAccount(
                        event.target.value.toUpperCase()
                      );
                      setErrors((previous) => ({
                        ...previous,
                        recipient: "",
                      }));
                    }}
                    placeholder="TRS-0000-0000"
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-[#112D4E] outline-none transition placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-blue-100 ${
                      errors.recipient
                        ? "border-red-400 focus:border-red-400"
                        : "border-[#DBE2EF] focus:border-[#3F72AF]"
                    }`}
                  />
                </div>
                {errors.recipient && (
                  <ErrorMessage message={errors.recipient} />
                )}
                <p className="mt-2 text-xs text-[#9CA3AF]">
                  Enter the recipient's Trustora Bank account number.
                </p>
              </div>

              {/* Amount */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                  Transfer Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#3F72AF]">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="100"
                    max="200000"
                    value={amount}
                    onChange={(event) => {
                      setAmount(event.target.value);
                      setErrors((previous) => ({
                        ...previous,
                        amount: "",
                      }));
                    }}
                    placeholder="Enter amount"
                    className={`w-full rounded-xl border bg-white py-3 pl-9 pr-4 text-sm text-[#112D4E] outline-none transition placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-blue-100 ${
                      errors.amount
                        ? "border-red-400 focus:border-red-400"
                        : "border-[#DBE2EF] focus:border-[#3F72AF]"
                    }`}
                  />
                </div>
                {errors.amount && <ErrorMessage message={errors.amount} />}
                <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-[#9CA3AF]">
                  <span>Minimum: ৳100</span>
                  <span>Maximum: ৳200,000 per transfer</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                  Description
                  <span className="ml-1 font-normal text-[#9CA3AF]">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <FileText
                    size={18}
                    className="pointer-events-none absolute left-3 top-3 text-[#3F72AF]"
                  />
                  <textarea
                    rows={3}
                    maxLength={100}
                    value={description}
                    onChange={(event) => {
                      setDescription(event.target.value);
                      setErrors((previous) => ({
                        ...previous,
                        description: "",
                      }));
                    }}
                    placeholder="e.g. Monthly payment, personal transfer..."
                    className="w-full resize-none rounded-xl border border-[#DBE2EF] bg-white py-3 pl-10 pr-4 text-sm text-[#112D4E] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#3F72AF] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs text-[#9CA3AF]">
                  {errors.description ? (
                    <span className="text-red-500">
                      {errors.description}
                    </span>
                  ) : (
                    <span>Help identify your transaction</span>
                  )}
                  <span>{description.length}/100</span>
                </div>
              </div>

              {/* PIN */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#112D4E]">
                  Transaction PIN
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3F72AF]"
                  />
                  <input
                    type={showPin ? "text" : "password"}
                    inputMode="numeric"
                    maxLength={6}
                    value={transactionPin}
                    onChange={(event) => {
                      setTransactionPin(
                        event.target.value.replace(/\D/g, "").slice(0, 6)
                      );
                      setErrors((previous) => ({
                        ...previous,
                        pin: "",
                      }));
                    }}
                    placeholder="Enter your 4–6 digit PIN"
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-12 text-sm tracking-widest text-[#112D4E] outline-none transition placeholder:tracking-normal placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-blue-100 ${
                      errors.pin
                        ? "border-red-400 focus:border-red-400"
                        : "border-[#DBE2EF] focus:border-[#3F72AF]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    aria-label={showPin ? "Hide PIN" : "Show PIN"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#112D4E]"
                  >
                    {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.pin && <ErrorMessage message={errors.pin} />}
                <p className="mt-2 flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Your PIN is used to authorize transfers.
                </p>
              </div>

              {/* Transfer Summary */}
              <div className="rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] p-4">
                <h3 className="mb-4 text-sm font-bold text-[#112D4E]">
                  Transfer Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-[#6B7280]">Transfer amount</span>
                    <span className="font-semibold text-[#112D4E]">
                      {formatCurrency(transferAmount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-[#6B7280]">Transfer fee</span>
                    <span className="font-semibold text-[#112D4E]">
                      {formatCurrency(transferFee)}
                    </span>
                  </div>
                  <div className="border-t border-[#DBE2EF] pt-3">
                    <div className="flex justify-between gap-3">
                      <span className="font-semibold text-[#112D4E]">
                        Total deduction
                      </span>
                      <span className="text-lg font-bold text-[#112D4E]">
                        {formatCurrency(totalDeduction || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReviewTransfer}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#112D4E] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1D4168]"
              >
                Review Transfer
                <ArrowRight size={17} />
              </button>
            </div>
          </section>

          {/* Side Information */}
          <div className="space-y-5">
            <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <ShieldCheck size={22} />
                </div>
                <h2 className="font-bold text-[#112D4E]">
                  Transfer Guidelines
                </h2>
              </div>

              <div className="mt-5 space-y-4">
                {[
                  "Verify the recipient account number before transferring.",
                  "Minimum transfer amount is ৳100.",
                  "Maximum single transfer is ৳200,000.",
                  "Ensure your account has sufficient balance.",
                  "Never share your transaction PIN with anyone.",
                ].map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                    <p className="text-sm leading-relaxed text-[#6B7280]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
              <h2 className="font-bold text-[#112D4E]">
                Transfer Information
              </h2>

              <div className="mt-4 space-y-4">
                <InfoRow
                  label="Transfer Type"
                  value="Bank-to-bank (Trustora)"
                />
                <InfoRow label="Processing Time" value="Instant (demo)" />
                <InfoRow label="Transfer Fee" value="৳0 (demo)" />
                <InfoRow label="Daily Limit" value="৳200,000" />
                <InfoRow label="Minimum Amount" value="৳100" />
              </div>
            </section>

            <section className="rounded-2xl bg-gradient-to-br from-[#112D4E] to-[#3F72AF] p-5 text-white shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck size={21} />
                <h3 className="font-bold">Security Reminder</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-blue-100">
                Always double-check the recipient's account number. Trustora
                Bank will never ask you to share your PIN or password.
              </p>
            </section>
          </div>
        </div>

        {/* Recent Transfers */}
        <section className="overflow-hidden rounded-2xl border border-[#DBE2EF] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-[#DBE2EF] p-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="font-bold text-[#112D4E]">Recent Transfers</h2>
              <p className="mt-1 text-xs text-[#9CA3AF]">
                Your recent outgoing fund transfers
              </p>
            </div>
            <span className="text-xs text-[#9CA3AF]">
              {transfers.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-[#F9F7F7]">
                <tr className="text-xs uppercase tracking-wide text-[#6B7280]">
                  <th className="px-6 py-4 font-semibold">Transaction ID</th>
                  <th className="px-6 py-4 font-semibold">Recipient</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {transfers.map((transfer) => (
                  <tr key={transfer.id} className="transition hover:bg-[#F9FAFB]">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-[#3F72AF]">
                        {transfer.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#112D4E]">
                        {transfer.recipient}
                      </p>
                      <p className="mt-1 text-xs text-[#9CA3AF]">
                        {transfer.accountNumber}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B7280]">
                      {transfer.date}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#112D4E]">
                      {formatCurrency(transfer.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={transfer.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="pb-3 text-center text-xs text-[#9CA3AF]">
          Trustora Bank · Customer Portal · Illustrative demo data
        </p>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#112D4E]/50 p-4">
          <div className="my-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#3F72AF]">
              <ArrowLeftRight size={26} />
            </div>

            <h2 className="mt-4 text-center text-xl font-bold text-[#112D4E]">
              Confirm Transfer
            </h2>
            <p className="mt-2 text-center text-sm text-[#6B7280]">
              Please review your transfer details before proceeding.
            </p>

            <div className="mt-6 space-y-4 rounded-xl bg-[#F9F7F7] p-4">
              <InfoRow
                label="From Account"
                value={selectedAccount.accountNumber}
              />
              <InfoRow
                label="Recipient Account"
                value={recipientAccount}
              />
              <InfoRow
                label="Transfer Amount"
                value={formatCurrency(transferAmount)}
              />
              <InfoRow label="Transfer Fee" value={formatCurrency(transferFee)} />
              <div className="border-t border-[#DBE2EF] pt-3">
                <InfoRow
                  label="Total Deduction"
                  value={formatCurrency(totalDeduction)}
                  strong
                />
              </div>
              {description && (
                <InfoRow label="Description" value={description} />
              )}
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="flex-1 rounded-xl border border-[#DBE2EF] px-4 py-3 text-sm font-semibold text-[#6B7280] transition hover:bg-gray-50"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleConfirmTransfer}
                className="flex-1 rounded-xl bg-[#112D4E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4168]"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && successTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#112D4E]/50 p-4">
          <div className="my-auto w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={34} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-[#112D4E]">
              Demo Transfer Successful!
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              Your illustrative transfer has been added to the recent transfer
              list. No real money has been moved.
            </p>

            <div className="mt-6 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] p-4 text-left">
              <p className="text-xs text-[#9CA3AF]">Transfer Amount</p>
              <p className="mt-1 text-2xl font-bold text-[#112D4E]">
                {formatCurrency(successTransaction.amount)}
              </p>

              <div className="mt-4 space-y-3 border-t border-[#DBE2EF] pt-4">
                <InfoRow
                  label="Transaction ID"
                  value={successTransaction.id}
                />
                <InfoRow
                  label="Recipient Account"
                  value={successTransaction.accountNumber}
                />
                <InfoRow
                  label="Date"
                  value={successTransaction.date}
                />
                <InfoRow label="Status" value="Completed" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(successTransaction.id);
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#DBE2EF] px-4 py-3 text-sm font-semibold text-[#3F72AF] transition hover:bg-blue-50"
            >
              <Copy size={16} />
              Copy Transaction ID
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="mt-3 w-full rounded-xl bg-[#112D4E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4168]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  description,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  color: "blue" | "purple" | "green";
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-[#3F72AF]",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="rounded-2xl border border-[#DBE2EF] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`rounded-xl p-3 ${colorClasses[color]}`}>{icon}</div>
      </div>
      <p className="mt-5 text-sm text-[#6B7280]">{label}</p>
      <h3 className="mt-1 text-2xl font-bold text-[#112D4E]">{value}</h3>
      <p className="mt-2 text-xs text-[#9CA3AF]">{description}</p>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500">
      <AlertCircle size={14} />
      {message}
    </p>
  );
}

function InfoRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-[#6B7280]">{label}</span>
      <span
        className={`break-all text-right text-xs ${
          strong
            ? "text-sm font-bold text-[#112D4E]"
            : "font-semibold text-[#112D4E]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "Completed" | "Pending" | "Failed";
}) {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Failed: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${styles[status]}`}
    >
      {status === "Completed" ? (
        <CheckCircle2 size={13} />
      ) : status === "Pending" ? (
        <Clock size={13} />
      ) : (
        <AlertCircle size={13} />
      )}
      {status}
    </span>
  );
}
