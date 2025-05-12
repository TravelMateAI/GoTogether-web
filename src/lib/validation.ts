import { z } from "zod";

// Define a reusable schema for a required non-empty string
const requiredString = z.string().trim().min(1, "This field cannot be empty");

// Password validation schema enforcing strong password rules
const passwordSchema = z
  .string()
  .min(8, "Must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
  .min(
    1,
    "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character",
  );

// Schema for validating sign-up form data
export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed",
  ),
  password: passwordSchema,
  firstName: requiredString,
  lastName: requiredString,
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  email: requiredString.email("Invalid email address"),
  caption: requiredString,
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
});


export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Must be at most 1000 characters").optional(),
  avatarUrl: z.string().url("Invalid avatar URL").optional(),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;

// Schema for validating comment creation data
export const createCommentSchema = z.object({
  // Comment content must be a non-empty string
  content: requiredString,
});

// No TypeScript type inference is shown here for the comment schema, but it could be done similarly:
// export type CreateCommentValues = z.infer<typeof createCommentSchema>;
