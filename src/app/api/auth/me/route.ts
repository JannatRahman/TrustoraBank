import { NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { isNextPrerenderSignal } from "@/server/auth/errors";

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
