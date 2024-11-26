import { z } from "zod";
import { UserStatus } from "./userTypes";

// Full entity schema
export const UserEntitySchema = z.object({
  firstName: z.string().min(1, { message: "First Name cannot be empty" }),
  lastName: z.string().min(1, { message: "Last Name cannot be empty" }),
  email: z.string().email(),
  status: z.nativeEnum(UserStatus),
  created: z.date(),
  updated: z.date(),
});

// Schema for creating a entity
export const UserEntityInputSchema = UserEntitySchema.omit({
  created: true,
  updated: true,
});
