import z from "zod";

const LoginSchema = z.object({
  email: z
    .email("Email must be valid")
    .min(3, "Email min length is 3 characters")
    .max(255, "Email max length is 255 characters"),
  password: z
    .string("Password must be valid")
    .min(2, "Password must be at least 2 characters long")
    .max(20, "Password must not exceed 20 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

const SignupSchema = LoginSchema.extend({
  username: z
    .string("Username must be valid")
    .trim()
    .min(2, "Username must be at least 2 characters long")
    .max(30, "Username must not exceed 30 characters long"),
  noteToAll: z
    .string("Note must be valid")
    .trim()
    .max(280, "Note to all must not exceed 280 characters long")
    .default(""),
});

const ProfileUpdateSchema = z.object({
  username: z
    .string("Username must be valid")
    .trim()
    .min(2, "Username must be at least 2 characters long")
    .max(30, "Username must not exceed 30 characters long"),
  noteToAll: z
    .string("Note must be valid")
    .trim()
    .max(280, "Note to all must not exceed 280 characters long")
    .default(""),
});

const MessageSchema = z.object({
  content: z
    .string("Message must be valid")
    .trim()
    .min(1, "Message must be at least 1 character long")
    .max(500, "Message must not exceed 500 characters long"),
});

type LoginUser = z.infer<typeof LoginSchema>;
type SignupUser = z.infer<typeof SignupSchema>;
type ProfileUpdateUser = z.infer<typeof ProfileUpdateSchema>;
type MessageUser = z.infer<typeof MessageSchema>;

export default z;
export { LoginSchema, SignupSchema, ProfileUpdateSchema, MessageSchema };
export type { LoginUser, SignupUser, ProfileUpdateUser, MessageUser };
