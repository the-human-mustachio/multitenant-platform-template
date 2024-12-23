// userFunctions.ts
import { UserEntity, UserEntityDTO } from "./userTypes";
import { UserEntityInputSchema } from "./userSchema";
import { z } from "zod";

// Validation function
export const validateUserInput = (
  input: unknown
): z.infer<typeof UserEntityInputSchema> => {
  return UserEntityInputSchema.parse(input);
};

// User creation function
export const createUserEntity = (
  validatedInput: z.infer<typeof UserEntityInputSchema>
): UserEntity => ({
  id: validatedInput.email,
  firstName: validatedInput.firstName,
  lastName: validatedInput.lastName,
  status: validatedInput.status,
  email: validatedInput.email,
  created: new Date(),
  updated: new Date(),
  defaultOrg: "",
});

// DTO transformation function
export const toUserDTO = (user: UserEntity): UserEntityDTO => ({
  ...user,
});
