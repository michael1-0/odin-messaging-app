import z from "zod";

const User = z.object({
  email: z.email(),
  password: z.string(),
});

export { User };
