import z from "zod";

const UserSchema = z.object({
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
type User = z.infer<typeof UserSchema>;

export default z;
export { UserSchema };
export type { User };
