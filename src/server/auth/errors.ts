import { NextResponse } from "next/server";

export class ApiError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Authentication required. Please log in.") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Access forbidden. Insufficient permissions.") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found.") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = "Bad request.") {
    super(message, 400);
    this.name = "BadRequestError";
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: error.statusCode }
    );
  }

  const message =
    error instanceof Error ? error.message : "An unexpected server error occurred.";

  console.error("API Unhandled Error:", error);

  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 500 }
  );
}
