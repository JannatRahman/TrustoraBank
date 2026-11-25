import { connection } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { COLLECTIONS, type UserRole, type CustomerStatus, type DbUser, type UserPreferences } from "@/types";
import { redirect } from "next/navigation";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: CustomerStatus;
  image?: string | null;
  phone?: string;
  address?: string;
  preferences?: UserPreferences;
}

export interface ServerSession {
  user: AuthenticatedUser;
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
}

export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  return session?.user || null
}


function isNextPrerenderSignal(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }
  const err = error as Record<string, unknown>;
  const digest = typeof err.digest === "string" ? err.digest : "";
  const code = typeof err.code === "string" ? err.code : "";

  return (
    digest === "HANGING_PROMISE_REJECTION" ||
    digest === "DYNAMIC_SERVER_USAGE" ||
    digest === "NEXT_PRERENDER_INTERRUPTED" ||
    digest === "NEXT_REDIRECT" ||
    digest === "NEXT_NOT_FOUND" ||
    code === "NEXT_STATIC_GEN_BAILOUT"
  );
}


export async function getServerSession(): Promise<ServerSession | null> {
  // Signal to Next.js 16 prerenderer that session resolution must wait for an incoming request
  await connection();

  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session || !session.user) {
      return null;
    }

    // Query live database status to ensure BLOCKED/DEACTIVATED status is enforced immediately
    const db = await getDatabase();
    const dbUser = await db
      .collection<DbUser>(COLLECTIONS.USER)
      .findOne({ email: session.user.email.toLowerCase() });

    const rawRole = dbUser?.role || (session.user as { role?: string }).role;
    const validatedRole: UserRole =
      rawRole === "admin" || rawRole === "banking-staff" || rawRole === "customer"
        ? (rawRole as UserRole)
        : "customer";

    const userStatus: CustomerStatus = dbUser?.status || "ACTIVE";

    return {
      user: {
        id: session.user.id,
        name: dbUser?.name || session.user.name,
        email: session.user.email,
        role: validatedRole,
        status: userStatus,
        image: dbUser?.image || session.user.image || null,
        phone: dbUser?.phone || undefined,
        address: dbUser?.address || undefined,
        preferences: dbUser?.preferences || undefined,
      },
      session: {
        id: session.session.id,
        userId: session.session.userId,
        token: session.session.token,
        expiresAt: session.session.expiresAt,
        ipAddress: session.session.ipAddress,
        userAgent: session.session.userAgent,
      },
    };
  } catch (error: unknown) {
    // Next.js dynamic prerendering signals: rethrow so Next.js correctly handles route lifecycle
    if (isNextPrerenderSignal(error)) {
      throw error;
    }
    console.error("Error retrieving server session:", error);
    return null;
  }
}

export const requireRole = async( role: string) => {
  const user = await getUserSession();
  if (!user || user.role !== role) {
    return redirect("/Unauthorized");
  }
} 

