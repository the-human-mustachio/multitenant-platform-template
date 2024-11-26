// organizationFunctions.ts
import { OrganizationEntity, OrganizationEntityDTO } from "./organizationTypes";
import { OrganizationInputSchema } from "./organizationSchema";
import { z } from "zod";
import { ulid } from "ulid";

// Validation function
export const validateOrganizationInput = (
  input: unknown
): z.infer<typeof OrganizationInputSchema> => {
  return OrganizationInputSchema.parse(input);
};

// Organization creation function
export const createOrganizationEntity = (
  validatedInput: z.infer<typeof OrganizationInputSchema>
): OrganizationEntity => ({
  id: ulid(), // Optional ID
  name: validatedInput.name,
  status: validatedInput.status,
  created: new Date(),
  updated: new Date(),
});

// DTO transformation function
export const toOrganizationDTO = (
  organization: OrganizationEntity
): OrganizationEntityDTO => ({
  ...organization,
});
