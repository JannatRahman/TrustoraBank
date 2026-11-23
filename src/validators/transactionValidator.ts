import { BadRequestError } from "@/server/auth/errors";
import { validateAccountNumber, validateAmount } from "./accountValidator";
import { validatePinFormat } from "./pinValidator";
import type { TransactionType, TransactionStatus } from "@/types";

export interface TransferPayload {
  senderAccount: string;
  receiverAccount: string;
  amount: number;
  pin: string;
  description?: string;
  idempotencyKey?: string;
}

export function validateTransferPayload(body: unknown): TransferPayload {
  if (!body || typeof body !== "object") {
    throw new BadRequestError("Invalid request body. Expected JSON object.");
  }

  const {
    senderAccount,
    receiverAccount,
    amount,
    pin,
    description,
    idempotencyKey,
  } = body as Record<string, unknown>;

  const validSender = validateAccountNumber(String(senderAccount || ""));
  const validReceiver = validateAccountNumber(String(receiverAccount || ""));

  if (validSender === validReceiver) {
    throw new BadRequestError("Sender and recipient account numbers cannot be the same.");
  }

  const validAmount = validateAmount(amount);
  const validPin = validatePinFormat(pin);

  const cleanDesc =
    typeof description === "string" && description.trim().length > 0
      ? description.trim().slice(0, 200)
      : undefined;

  const cleanIdempotency =
    typeof idempotencyKey === "string" && idempotencyKey.trim().length > 0
      ? idempotencyKey.trim().slice(0, 100)
      : undefined;

  return {
    senderAccount: validSender,
    receiverAccount: validReceiver,
    amount: validAmount,
    pin: validPin,
    description: cleanDesc,
    idempotencyKey: cleanIdempotency,
  };
}

export interface TransactionQueryParams {
  accountNumber?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
