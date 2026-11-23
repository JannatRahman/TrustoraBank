import type { ClientSession } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { COLLECTIONS, type DbNotification } from "@/types";

export interface CreateNotificationParams {
  type: string;
  user: string; // Target user email
  title: string;
  message: string;
  relatedModel?: string;
  relatedId?: string;
}

export class NotificationService {
  /**
   * Creates an in-app notification for a user.
   * Accepts an optional MongoDB ClientSession for transactional execution.
   */
  static async createNotification(
    params: CreateNotificationParams,
    session?: ClientSession
  ): Promise<void> {
    const db = await getDatabase();
    const now = new Date();
    const notification: DbNotification = {
      type: params.type,
      user: params.user.toLowerCase(),
      title: params.title,
      message: params.message,
      relatedModel: params.relatedModel,
      relatedId: params.relatedId,
      read: false,
      createdAt: now,
      updatedAt: now,
    };

    if (session) {
      await db.collection<DbNotification>(COLLECTIONS.NOTIFICATIONS).insertOne(notification, { session });
    } else {
      await db.collection<DbNotification>(COLLECTIONS.NOTIFICATIONS).insertOne(notification);
    }
  }

  /**
   * Retrieves notifications for a user with pagination.
   */
  static async getUserNotifications(userEmail: string, page: number = 1, limit: number = 20) {
    const db = await getDatabase();
    const collection = db.collection<DbNotification>(COLLECTIONS.NOTIFICATIONS);
    const filter = { user: userEmail.toLowerCase() };

    const skip = Math.max(0, (page - 1) * limit);
    const [notifications, total, unread] = await Promise.all([
      collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
      collection.countDocuments({ ...filter, read: false }),
    ]);

    return {
      notifications,
      unread,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
