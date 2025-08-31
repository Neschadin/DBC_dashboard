import { object, string } from "zod";

export const nameSchema = string({ required_error: "Name is required" }).min(
  2,
  "Name must be more than 2 characters",
);

export const emailSchema = string({ required_error: "Email is required" })
  .min(1, "Email is required")
  .email("Invalid email");

export const passwordSchema = string({ required_error: "Password is required" })
  .min(1, "Password is required")
  .min(8, "Password must be more than 8 characters")
  .max(32, "Password must be less than 32 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter and one number",
  );

export const signInSchema = object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});
