// main.ts
import { DynamoDBAdapter } from "../../adapters/dynamoDBAdapter";
import {
  validateOrganizationInput,
  createOrganizationEntity,
  toOrganizationDTO,
} from "./organizationFunctions";
import { createOrganizationRepository } from "./organizationRepository";
import { z } from "zod";

const main = async () => {
  // Use the in-memory save and get functions and pass them to the repository
  const saveOrganizationFn = DynamoDBAdapter.upsertOrganization();
  const getOrganizationByIdFn = DynamoDBAdapter.getOrganizationById();
  const organizationRepository = createOrganizationRepository(
    saveOrganizationFn,
    getOrganizationByIdFn
  );

  try {
    // Step 1: Validate Input
    const organizationInput = { name: "Tech Corp", status: "active" };
    const validatedInput = validateOrganizationInput(organizationInput);

    // Step 2: Create Organization Entity
    const newOrganization = createOrganizationEntity(validatedInput);

    // Step 3: Save Organization through the repository
    await organizationRepository.saveOrganization(newOrganization);

    // Step 4: Convert to DTO (if needed)
    const organizationDTO = toOrganizationDTO(newOrganization);
    console.log(organizationDTO);

    // Step 5: Retrieve Organization by ID through the repository
    const retrievedOrganization =
      await organizationRepository.getOrganizationById(
        newOrganization.id as string
      );
    if (retrievedOrganization) {
      console.log(
        "Retrieved Organization:",
        toOrganizationDTO(retrievedOrganization)
      );
    } else {
      console.log("Organization not found in in-memory database.");
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