// main.ts
import { DynamoDBAdapter } from "../../adapters/dynamoDBAdapter";
import {
  validateMembershipInput,
  createMembershipEntity,
  toMembershipDTO,
  transitionMembershipStatus,
} from "./membershipFunctions";
import { createMembershipRepository } from "./membershipRepository";
import { MembershipStatus } from "./membershipTypes";
import { z } from "zod";

const main = async () => {
  // Use the in-memory save and get functions and pass them to the repository
  const saveMembershipFn = DynamoDBAdapter.upsertMembership();
  const getMembershipByEmailAndOrganizationIdFn =
    DynamoDBAdapter.getMembershipByEmailAndOrgId();

  const membershipRepository = createMembershipRepository(
    saveMembershipFn,
    getMembershipByEmailAndOrganizationIdFn
  );

  try {
    // Step 1: Validate Membership Input
    const membershipInput = {
      email: "user@example.com",
      organizationId: "org123",
      status: "active",
      role: "admin",
    };
    const validatedInput = validateMembershipInput(membershipInput);

    // Step 2: Create Membership Entity
    const newMembership = createMembershipEntity(validatedInput);

    // Step 3: Save Membership through the repository
    await membershipRepository.saveMembership(newMembership);

    // Step 4: Convert to DTO (if needed)
    const membershipDTO = toMembershipDTO(newMembership);
    console.log(membershipDTO);

    // Step 5: Transition Membership Status (active to inactive or vice versa)
    const currentMembership =
      await membershipRepository.getMembershipByEmailAndOrganizationId(
        newMembership.email,
        newMembership.organizationId
      );
    if (currentMembership) {
      const updatedStatus = transitionMembershipStatus(
        currentMembership.status,
        MembershipStatus.INACTIVE
      );
      currentMembership.status = updatedStatus;
      await membershipRepository.saveMembership(currentMembership); // Save updated membership
      console.log("Updated Membership:", toMembershipDTO(currentMembership));
    } else {
      console.log("Membership not found in in-memory database.");
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation failed:", error.errors);
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

main();
