import { ObjectId, type ClientSession } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { COLLECTIONS, type DbNotification } from "@/types";
import { NotFoundError, ForbiddenError, BadRequestError } from "@/server/auth/errors";

export interface CreateNotificationParams {
  type: string;
  user: string; // Target user email
  title: string;
  message: string;
  relatedModel?: string;
  relatedId?: string;
}

export interface NotificationQueryOptions {
  page?: number;
  limit?: number;
  read?: boolean;
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
   * Retrieves paginated notifications belonging only to a specific user.
   * Supports filtering by read/unread status and provides unread count.
   */
  static async getUserNotifications(
    userEmail: string,
    options: NotificationQueryOptions = {}
  ) {
    if (!userEmail) {
      throw new BadRequestError("User email is required.");
    }

    const db = await getDatabase();
    const collection = db.collection<DbNotification>(COLLECTIONS.NOTIFICATIONS);
    const normalizedEmail = userEmail.toLowerCase().trim();

    const filter: Record<string, unknown> = {
      user: normalizedEmail,
    };

    if (options.read !== undefined) {
      filter.read = options.read;
    }

    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    const [notifications, total, unread] = await Promise.all([
      collection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
      collection.countDocuments({ user: normalizedEmail, read: false }),
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

  /**
   * Marks a specific notification as read, enforcing strict ownership verification.
   */
  static async markAsRead(notificationId: string, userEmail: string): Promise<DbNotification> {
    if (!notificationId) {
      throw new BadRequestError("Notification ID is required.");
    }

    const db = await getDatabase();
    const collection = db.collection<DbNotification>(COLLECTIONS.NOTIFICATIONS);

    // Build query for ObjectId or raw string ID
    const query: Record<string, unknown> = {};
    if (ObjectId.isValid(notificationId)) {
      query.$or = [{ _id: new ObjectId(notificationId) }, { _id: notificationId as any }];
    } else {
      query._id = notificationId as any;
    }

    const notification = await collection.findOne(query);

    if (!notification) {
      throw new NotFoundError("Notification not found.");
    }

    // Verify ownership
    if (notification.user.toLowerCase() !== userEmail.toLowerCase().trim()) {
      throw new ForbiddenError("Access denied. You can only update your own notifications.");
    }

    const now = new Date();
    const updated = await collection.findOneAndUpdate(
      { _id: notification._id },
      {
        $set: {
          read: true,
          updatedAt: now,
        },
      },
      { returnDocument: "after" }
    );

    return updated!;
  }

  /**
   * Marks all unread notifications for a user as read.
   */
  static async markAllAsRead(userEmail: string): Promise<{ modifiedCount: number }> {
    if (!userEmail) {
      throw new BadRequestError("User email is required.");
    }

    const db = await getDatabase();
    const collection = db.collection<DbNotification>(COLLECTIONS.NOTIFICATIONS);
    const normalizedEmail = userEmail.toLowerCase().trim();

    const result = await collection.updateMany(
      { user: normalizedEmail, read: false },
      {
        $set: {
          read: true,
          updatedAt: new Date(),
        },
      }
    );

    return { modifiedCount: result.modifiedCount };
  }
}
