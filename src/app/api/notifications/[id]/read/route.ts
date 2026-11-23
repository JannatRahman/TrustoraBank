import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { NotificationService } from "@/services/notificationService";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAuth();
    const { id } = await params;

    const updated = await NotificationService.markAsRead(id, user.email);

    return NextResponse.json({
      success: true,
      message: "Notification marked as read.",
      data: updated,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
