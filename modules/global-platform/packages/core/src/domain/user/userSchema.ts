import { z } from "zod";
import { UserStatus } from "./userTypes";

// Full entity schema
export const UserEntitySchema = z.object({
  id: z.string().email(),
  firstName: z.string().min(1, { message: "First Name cannot be empty" }),
  lastName: z.string().min(1, { message: "Last Name cannot be empty" }),
  email: z.string().email(),
  status: z.nativeEnum(UserStatus),
  defaultOrg: z.string().min(1, { message: "default Org Id can not be empty" }),
  created: z.date(),
  updated: z.date(),
});

// Schema for creating a entity
export const UserEntityInputSchema = UserEntitySchema.omit({
  id: true,
  defaultOrg: true,
  created: true,
  updated: true,
});
