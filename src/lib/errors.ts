import { CredentialsSignin } from "next-auth";

export const ErrorCodes = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  INVALID_SCHEMA: "INVALID_SCHEMA",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
} as const;

export const ErrorMessages = {
  [ErrorCodes.INVALID_CREDENTIALS]: "Invalid email or password",
  [ErrorCodes.USER_NOT_FOUND]: "User not found",
  [ErrorCodes.USER_ALREADY_EXISTS]: "User with this email already exists",
  [ErrorCodes.INVALID_SCHEMA]: "Invalid credentials",
  [ErrorCodes.UNAUTHORIZED]: "Need authorization",
  [ErrorCodes.FORBIDDEN]: "Access denied",
  [ErrorCodes.VALIDATION_ERROR]: "Validation error",
  [ErrorCodes.INTERNAL_ERROR]: "Internal server error",
  [ErrorCodes.DATABASE_ERROR]: "Database error",
  [ErrorCodes.UNEXPECTED_ERROR]: "Unexpected error",
} as const;

export class AuthError extends CredentialsSignin {
  constructor(code: keyof typeof ErrorCodes) {
    super();
    this.code = code;
    this.message = ErrorMessages[code];
    this.stack = undefined;
  }
}
