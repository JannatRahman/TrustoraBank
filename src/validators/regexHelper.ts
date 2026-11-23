/**
 * Escapes special regular expression characters in a user-supplied string
 * to prevent ReDoS attacks and RegExp syntax errors.
 */
export function escapeRegex(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
