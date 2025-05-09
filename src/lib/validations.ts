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

export const AccountSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  type: z.enum(["oauth", "credentials"]),
  provider: z.string().nonempty("Provider is required"),
  providerAccountId: z.string().nonempty("Provider account ID is required"),
  password: z.string().optional().nullable(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters long." }),
  image: z
    .string()
    .url({ message: "Please provide a valid URL." })
    .optional()
    .nullable(),
  emailVerified: z.date().optional().nullable(),
  providers: z.array(z.string()).default([]),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const CreatePostSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  field: z.string().min(1, { message: "You should select or create a field" }),
  content: z
    .string()
    .min(10, { message: "Content should contain more than ten characters" }),
});

export const EditPostSchema = CreatePostSchema.extend({
  postId: z.string().min(1, { message: "Post ID is required" }),
});

export const GetPostSchema = z.object({
  postId: z.string().min(1, { message: "Post ID is requried" }),
  userId: z.string().optional(),
});

export const PaginatedSearchParamsSchema = z.object({
  query: z.string().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const GetCommentSchema = z.object({
  postId: z.string().min(1, { message: "Post ID is required" }),
});

export const CreateCommentSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Comment must be at least 10 characters" }),
  rating: z
    .number()
    .int()
    .positive()
    .max(10, { message: "Rating must not higher than 10" }),
});

export const CommentServerSchema = CreateCommentSchema.extend({
  postId: z.string().min(1, { message: "Post ID is required." }),
});

export const SubscribeSchema = z.object({
  fieldId: z.string().min(1, { message: "field ID is required." }),
});

export const CollectionSchema = z.object({
  postId: z.string().min(1, { message: "post ID is required." }),
});

export const GetUserProfileSchema = PaginatedSearchParamsSchema.extend({
  userId: z.string().nullable(),
});

export const UserIdSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
});

export const DeletePostSchema = z.object({
  postId: z.string().min(1, { message: "Post ID is required." }),
  authorId: z.string().min(1, { message: "Author ID is required." }),
});

export const DeleteCommentSchema = z.object({
  commentId: z.string().min(1, { message: "Comment ID is required." }),
  authorId: z.string().min(1, { message: "Author ID is required." }),
});

export const EditCommentSchema = DeleteCommentSchema.extend({
  content: z.string().min(10, { message: "Post ID is required" }),
  rating: z
    .number()
    .int()
    .positive()
    .max(10, { message: "Rating must not higher than 10" }),
});
