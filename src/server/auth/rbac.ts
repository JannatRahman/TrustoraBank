import { getServerSession, type AuthenticatedUser, type ServerSession } from "./session";
import { UnauthorizedError, ForbiddenError } from "./errors";
import type { UserRole } from "@/types";

export interface AuthContext {
  user: AuthenticatedUser;
  session: ServerSession["session"];
}

/**
 * Validates that the current request has an active, valid Better Auth session.
 * Throws UnauthorizedError (401) if not logged in.
 */
export async function requireAuth(): Promise<AuthContext> {
  const session = await getServerSession();

  if (!session || !session.user) {
    throw new UnauthorizedError("Authentication required. Please sign in to continue.");
  }

  return session;
}

/**
 * Validates that the current request has an active session AND that the user has
 * one of the explicitly allowed roles.
 * Throws UnauthorizedError (401) if not logged in.
 * Throws ForbiddenError (403) if the user's role is not allowed.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<AuthContext> {
  const authContext = await requireAuth();

  if (!allowedRoles.includes(authContext.user.role)) {
    throw new ForbiddenError(
      `Access denied. This action requires one of the following roles: ${allowedRoles.join(", ")}.`
    );
  }

  return authContext;
}

/**
 * Shortcut to require an Admin user.
 */
export async function requireAdmin(): Promise<AuthContext> {
  return requireRole(["admin"]);
}

/**
 * Shortcut to require Banking Staff or Admin.
 */
export async function requireStaffOrAdmin(): Promise<AuthContext> {
  return requireRole(["banking-staff", "admin"]);
}

/**
 * Shortcut to require a Customer.
 */
export async function requireCustomer(): Promise<AuthContext> {
  return requireRole(["customer"]);
}

/**
 * Checks whether the authenticated user has permission to access a specific resource.
 * - Admin and Banking Staff have elevated access to view customer records.
 * - Customers can ONLY access resources where they are the owner.
 *
 * Throws ForbiddenError (403) if unauthorized.
 */
export function assertOwnershipOrStaff(
  resourceOwnerEmail: string,
  user: AuthenticatedUser
): void {
  if (user.role === "admin" || user.role === "banking-staff") {
    return;
  }

  if (user.email.toLowerCase() !== resourceOwnerEmail.toLowerCase()) {
    throw new ForbiddenError("Access denied. You can only view and manage your own accounts and records.");
  }
}

/**
 * Strictly verifies customer ownership (disallows even staff if the action is personal).
 */
export function assertCustomerOwnership(
  resourceOwnerEmail: string,
  user: AuthenticatedUser
): void {
  if (user.email.toLowerCase() !== resourceOwnerEmail.toLowerCase()) {
    throw new ForbiddenError("Access denied. You do not own this resource.");
  }
}
