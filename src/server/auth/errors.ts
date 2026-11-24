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

export class ConflictError extends ApiError {
  constructor(message: string = "Conflict.") {
    super(message, 409);
    this.name = "ConflictError";
  }
}

export class TooManyRequestsError extends ApiError {
  constructor(message: string = "Too many requests. Please try again later.") {
    super(message, 429);
    this.name = "TooManyRequestsError";
  }
}

/**
 * Check if an error is a Next.js internal prerendering / navigation signal.
 * In Next.js 16 with cacheComponents, these signals must be re-thrown so the
 * framework can handle prerendering deferral, dynamic rendering, redirects, and notFound.
 */
export function isNextPrerenderSignal(error: unknown): boolean {
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

export function handleApiError(error: unknown) {
  // Never swallow or convert Next.js prerendering or dynamic navigation signals
  if (isNextPrerenderSignal(error)) {
    throw error;
  }

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
