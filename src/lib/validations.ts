import { z } from "zod";

export const LogInWithOAuthSchema = z.object({
  provider: z.enum(["google", "github"]),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required" }),
  user: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    username: z
      .string()
      .min(4, { message: "Username must be at least 4 charaters long" }),
    email: z
      .string()
      .email({ message: "Please provide a valid email address" }),
    image: z.string().url("Invalid image URL").optional(),
  }),
});

export const LogInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 charaters." }),
});

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 charaters." }),
  name: z
    .string()
    .min(1, { message: "name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters long." })
    .max(12, { message: "Username cannot exceed 12 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),
});
