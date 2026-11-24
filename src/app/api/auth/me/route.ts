import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { requireAuth, handleApiError } from "@/server/auth";
import { isNextPrerenderSignal } from "@/server/auth/errors";
import { getDatabase } from "@/lib/mongodb";
import { COLLECTIONS, type DbUser, type UserPreferences } from "@/types";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthenticated",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: session.user,
    });
  } catch (error) {
    if (isNextPrerenderSignal(error)) {
      throw error;
    }
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await request.json().catch(() => ({}));

    // Strictly whitelist editable profile fields
    // Protected administrative fields (role, status, email, emailVerified, id, _id) are NEVER allowed
    const updates: Partial<DbUser> = {
      updatedAt: new Date(),
    };

    if (typeof body.name === "string" && body.name.trim().length >= 2) {
      updates.name = body.name.trim();
    }

    if (typeof body.phone === "string") {
      updates.phone = body.phone.trim();
    }

    if (typeof body.address === "string") {
      updates.address = body.address.trim();
    }

    if (body.preferences && typeof body.preferences === "object") {
      const prefs: UserPreferences = {
        theme: ["light", "dark", "system"].includes(body.preferences.theme)
          ? body.preferences.theme
          : "light",
        transactionAlerts: Boolean(body.preferences.transactionAlerts),
        depositUpdates: Boolean(body.preferences.depositUpdates),
        withdrawalUpdates: Boolean(body.preferences.withdrawalUpdates),
        loanUpdates: Boolean(body.preferences.loanUpdates),
        securityAlerts: Boolean(body.preferences.securityAlerts),
        promotionalEmails: Boolean(body.preferences.promotionalEmails),
      };
      updates.preferences = prefs;
    }

    if (body.image !== undefined) {
      if (
        typeof body.image === "string" &&
        (body.image.startsWith("http://") ||
          body.image.startsWith("https://") ||
          body.image.startsWith("data:image/"))
      ) {
        updates.image = body.image;
      } else if (body.image === null || body.image === "") {
        updates.image = null;
      }
    }

    const db = await getDatabase();
    await db
      .collection<DbUser>(COLLECTIONS.USER)
      .updateOne({ email: user.email.toLowerCase() }, { $set: updates });

    const updated = await db
      .collection<DbUser>(COLLECTIONS.USER)
      .findOne({ email: user.email.toLowerCase() });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user.id,
        name: updated?.name || user.name,
        email: user.email,
        role: user.role,
        status: updated?.status || "ACTIVE",
        image: updated?.image ?? null,
        phone: updated?.phone ?? "",
        address: updated?.address ?? "",
        preferences: updated?.preferences ?? {
          theme: "light",
          transactionAlerts: true,
          depositUpdates: true,
          withdrawalUpdates: true,
          loanUpdates: true,
          securityAlerts: true,
          promotionalEmails: false,
        },
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
