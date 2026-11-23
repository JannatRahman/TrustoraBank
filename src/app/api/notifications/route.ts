import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { NotificationService } from "@/services/notificationService";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const searchParams = request.nextUrl.searchParams;

    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;

    const readParam = searchParams.get("read");
    const read = readParam !== null && readParam !== undefined
      ? readParam === "true" || readParam === "1"
      : undefined;

    const result = await NotificationService.getUserNotifications(user.email, {
      page,
      limit,
      read,
    });

    return NextResponse.json({
      success: true,
      data: result.notifications,
      unread: result.unread,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await request.json().catch(() => ({}));

    if (body.markAll) {
      const result = await NotificationService.markAllAsRead(user.email);
      return NextResponse.json({
        success: true,
        message: `Marked ${result.modifiedCount} notification(s) as read.`,
        modifiedCount: result.modifiedCount,
      });
    }

    return NextResponse.json(
      { success: false, message: "Provide { markAll: true } to mark all notifications as read." },
      { status: 400 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
