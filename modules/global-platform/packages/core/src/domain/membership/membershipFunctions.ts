// membershipFunctions.ts
import {
  MembershipEntity,
  MembershipEntityDTO,
  MembershipStatus,
} from "./membershipTypes";
import { MembershipInputSchema } from "./membershipSchema";
import { z } from "zod";
import { ulid } from "ulid";

// Validation function
export const validateMembershipInput = (
  input: unknown
): z.infer<typeof MembershipInputSchema> => {
  return MembershipInputSchema.parse(input);
};

// Membership creation function
export const createMembershipEntity = (
  validatedInput: z.infer<typeof MembershipInputSchema>
): MembershipEntity => ({
  email: validatedInput.email,
  organizationId: validatedInput.organizationId,
  status: validatedInput.status,
  role: validatedInput.role,
  created: new Date(),
  updated: new Date(),
});

// DTO transformation function
export const toMembershipDTO = (
  membership: MembershipEntity
): MembershipEntityDTO => ({
  ...membership,
});

// Status transition function
export const transitionMembershipStatus = (
  currentStatus: MembershipStatus,
  newStatus: MembershipStatus
): MembershipStatus => {
  if (
    (currentStatus === MembershipStatus.ACTIVE &&
      newStatus === MembershipStatus.INVITED) ||
    (currentStatus === MembershipStatus.INACTIVE &&
      newStatus === MembershipStatus.INVITED)
  ) {
    throw new Error(
      "Cannot re-invite a user who is already ACTIVE or INACTIVE."
    );
  }

  if (
    (currentStatus === MembershipStatus.ACTIVE &&
      newStatus === MembershipStatus.ACTIVE) ||
    (currentStatus === MembershipStatus.INACTIVE &&
      newStatus === MembershipStatus.INACTIVE)
  ) {
    throw new Error("A user cannot be re-invited to the same status.");
  }

  return newStatus;
};
