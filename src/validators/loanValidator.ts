import { BadRequestError } from "@/server/auth/errors";
import { validateAccountNumber, validateAmount } from "./accountValidator";
import { validatePinFormat } from "./pinValidator";
import type { LoanType } from "@/types";

export interface LoanApplicationPayload {
  account: string;
  type: LoanType;
  amount: number;
  durationMonths: number;
  monthlyIncome: number;
  employmentStatus: string;
  description: string;
}

export function validateLoanApplicationPayload(body: unknown): LoanApplicationPayload {
  if (!body || typeof body !== "object") {
    throw new BadRequestError("Invalid request body. Expected JSON object.");
  }

  const {
    account,
    type,
    amount,
    durationMonths,
    monthlyIncome,
    employmentStatus,
    description,
  } = body as Record<string, unknown>;

  const validAccount = validateAccountNumber(String(account || ""));

  const validTypes: LoanType[] = ["PERSONAL", "HOME", "BUSINESS", "EDUCATION", "CAR"];
  const normalizedType = String(type || "").toUpperCase() as LoanType;
  if (!validTypes.includes(normalizedType)) {
    throw new BadRequestError(`Invalid loan type. Allowed: ${validTypes.join(", ")}`);
  }

  const validAmount = validateAmount(amount);
  if (validAmount < 10000) {
    throw new BadRequestError("Minimum loan application amount is ৳10,000.");
  }
  if (validAmount > 50000000) {
    throw new BadRequestError("Maximum loan application amount is ৳50,000,000.");
  }

  const duration = parseInt(String(durationMonths), 10);
  if (isNaN(duration) || duration < 3 || duration > 120) {
    throw new BadRequestError("Loan duration must be between 3 and 120 months.");
  }

  const income = validateAmount(monthlyIncome);

  if (typeof employmentStatus !== "string" || employmentStatus.trim().length === 0) {
    throw new BadRequestError("Employment status is required.");
  }

  if (typeof description !== "string" || description.trim().length < 5) {
    throw new BadRequestError("Please provide a description of the loan purpose (at least 5 characters).");
  }

  return {
    account: validAccount,
    type: normalizedType,
    amount: validAmount,
    durationMonths: duration,
    monthlyIncome: income,
    employmentStatus: employmentStatus.trim().slice(0, 50),
    description: description.trim().slice(0, 500),
  };
}

export function validateStaffNotePayload(body: unknown): { note: string } {
  if (!body || typeof body !== "object") {
    throw new BadRequestError("Invalid request body. Expected JSON object.");
  }

  const { note } = body as Record<string, unknown>;
  if (typeof note !== "string" || note.trim().length < 2) {
    throw new BadRequestError("Internal staff note cannot be empty.");
  }

  return { note: note.trim().slice(0, 500) };
}

export interface AdminReviewPayload {
  action: "APPROVE" | "REJECT";
  rejectionReason?: string;
  approvedAmount?: number;
  interestRate?: number;
  durationMonths?: number;
}

export function validateAdminReviewPayload(body: unknown): AdminReviewPayload {
  if (!body || typeof body !== "object") {
    throw new BadRequestError("Invalid request body. Expected JSON object.");
  }

  const { action, rejectionReason, approvedAmount, interestRate, durationMonths } =
    body as Record<string, unknown>;

  const normAction = String(action || "").toUpperCase();
  if (normAction !== "APPROVE" && normAction !== "REJECT") {
    throw new BadRequestError("Action must be either APPROVE or REJECT.");
  }

  let cleanReason: string | undefined = undefined;
  if (normAction === "REJECT") {
    if (typeof rejectionReason !== "string" || rejectionReason.trim().length < 2) {
      throw new BadRequestError("Rejection reason is required when rejecting a loan.");
    }
    cleanReason = rejectionReason.trim().slice(0, 300);
  }

  return {
    action: normAction as "APPROVE" | "REJECT",
    rejectionReason: cleanReason,
    approvedAmount: approvedAmount ? validateAmount(approvedAmount) : undefined,
    interestRate: interestRate ? Number(interestRate) : undefined,
    durationMonths: durationMonths ? parseInt(String(durationMonths), 10) : undefined,
  };
}

export interface PayInstallmentPayload {
  pin: string;
  account?: string;
}

export function validatePayInstallmentPayload(body: unknown): PayInstallmentPayload {
  if (!body || typeof body !== "object") {
    throw new BadRequestError("Invalid request body. Expected JSON object.");
  }

  const { pin, account } = body as Record<string, unknown>;
  const validPin = validatePinFormat(pin);
  const validAccount = account ? validateAccountNumber(String(account)) : undefined;

  return {
    pin: validPin,
    account: validAccount,
  };
}
