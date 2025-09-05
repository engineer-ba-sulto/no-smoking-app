import { z } from "zod";

export class UserProfileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserProfileError";
  }
}

export class UserProfileNotFoundError extends UserProfileError {
  constructor(id: number) {
    super(`User profile with id ${id} not found`);
    this.name = "UserProfileNotFoundError";
  }
}

export class UserProfileValidationError extends UserProfileError {
  constructor(public issues: z.ZodIssue[]) {
    const message = issues.map((i) => i.message).join(", ");
    super(message);
    this.name = "UserProfileValidationError";
  }
}
