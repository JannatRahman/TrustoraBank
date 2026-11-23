import { BadRequestError } from "@/server/auth/errors";
import type { AccountType, AccountStatus } from "@/types";

export function validateAccountNumber(accountNumber: string): string {
  if (!accountNumber || typeof accountNumber !== "string") {
    throw new BadRequestError("Account number is required.");
  }

  const trimmed = accountNumber.trim();
  if (trimmed.length < 5 || trimmed.length > 30) {
    throw new BadRequestError("Invalid account number format.");
  }

  return trimmed;
}

export function validateAccountType(type: unknown): AccountType {
  const validTypes: AccountType[] = ["SAVINGS", "CURRENT", "BUSINESS"];
  if (typeof type !== "string" || !validTypes.includes(type.toUpperCase() as AccountType)) {
    throw new BadRequestError(`Invalid account type. Allowed types: ${validTypes.join(", ")}`);
  }
  return type.toUpperCase() as AccountType;
}

export function validateAccountStatus(status: unknown): AccountStatus {
  const validStatuses: AccountStatus[] = ["ACTIVE", "FROZEN", "CLOSED"];
  if (typeof status !== "string" || !validStatuses.includes(status.toUpperCase() as AccountStatus)) {
    throw new BadRequestError(`Invalid account status. Allowed statuses: ${validStatuses.join(", ")}`);
  }
  return status.toUpperCase() as AccountStatus;
}

export function validateAmount(amount: unknown): number {
  const num = Number(amount);
  if (isNaN(num) || !isFinite(num) || num <= 0) {
    throw new BadRequestError("Transaction amount must be a positive number.");
  }
  // Enforce precision to 2 decimal places
  return Math.round(num * 100) / 100;
}
