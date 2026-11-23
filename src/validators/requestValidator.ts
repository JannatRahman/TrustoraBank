import { BadRequestError } from "@/server/auth/errors";
import { validateAccountNumber, validateAmount } from "./accountValidator";
import { validatePinFormat } from "./pinValidator";
import type { RequestType, RequestStatus } from "@/types";

export interface CreateRequestPayload {
  account: string;
  type: RequestType;
  amount: number;
  description?: string;
  pin?: string;
}

export function validateCreateRequestPayload(body: unknown): CreateRequestPayload {
  if (!body || typeof body !== "object") {
    throw new BadRequestError("Invalid request body. Expected JSON object.");
  }

  const { account, type, amount, description, pin } = body as Record<string, unknown>;

  const validAccount = validateAccountNumber(String(account || ""));

  const normalizedType = String(type || "").toUpperCase();
  if (normalizedType !== "DEPOSIT" && normalizedType !== "WITHDRAWAL") {
    throw new BadRequestError("Invalid request type. Allowed types: DEPOSIT, WITHDRAWAL.");
  }

  const validAmount = validateAmount(amount);

  let validPin: string | undefined = undefined;
  if (normalizedType === "WITHDRAWAL") {
    validPin = validatePinFormat(pin);
  }

  const cleanDescription =
    typeof description === "string" && description.trim().length > 0
      ? description.trim().slice(0, 200)
      : undefined;

  return {
    account: validAccount,
    type: normalizedType as RequestType,
    amount: validAmount,
    description: cleanDescription,
    pin: validPin,
  };
}

export interface ReviewRequestPayload {
  action: "APPROVE" | "REJECT";
  rejectionReason?: string;
}

export function validateReviewRequestPayload(body: unknown): ReviewRequestPayload {
  if (!body || typeof body !== "object") {
    throw new BadRequestError("Invalid request body. Expected JSON object.");
  }

  const { action, rejectionReason } = body as Record<string, unknown>;
  const normalizedAction = String(action || "").toUpperCase();

  if (normalizedAction !== "APPROVE" && normalizedAction !== "REJECT") {
    throw new BadRequestError("Invalid action. Must be APPROVE or REJECT.");
  }

  const cleanReason =
    typeof rejectionReason === "string" && rejectionReason.trim().length > 0
      ? rejectionReason.trim().slice(0, 300)
      : undefined;

  return {
    action: normalizedAction as "APPROVE" | "REJECT",
    rejectionReason: cleanReason,
  };
}

export interface RequestQueryParams {
  status?: RequestStatus;
  type?: RequestType;
  accountNumber?: string;
  userEmail?: string;
  page?: number;
  limit?: number;
}
