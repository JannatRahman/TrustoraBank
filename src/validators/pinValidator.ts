import { BadRequestError } from "@/server/auth/errors";

/**
 * Validates transaction PIN format (4 to 6 numeric digits).
 */
export function validatePinFormat(pin: unknown): string {
  if (typeof pin !== "string" || !pin) {
    throw new BadRequestError("Transaction PIN is required.");
  }

  const trimmed = pin.trim();
  if (!/^\d{4,6}$/.test(trimmed)) {
    throw new BadRequestError("Transaction PIN must be 4 to 6 numeric digits.");
  }

  return trimmed;
}
