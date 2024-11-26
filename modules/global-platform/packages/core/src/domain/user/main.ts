// main.ts
import {
  validateUserInput,
  createUserEntity,
  toUserDTO,
} from "./userFunctions";
import { createUserRepository } from "./userRepository";
import { z } from "zod";
import { UserStatus } from "./userTypes";
import { DynamoDBAdapter } from "../../adapters/dynamoDBAdapter";

const main = async () => {
  // Use the in-memory save function and pass it to the repository
  const saveUserFn = DynamoDBAdapter.upsertUser();
  const getUserByIdFn = DynamoDBAdapter.getUserByEmail();
  const userRepository = createUserRepository(saveUserFn, getUserByIdFn);

  try {
    // Step 1: Validate Input
    const userInput = {
      firstName: "Matt",
      lastName: "Puccio",
      email: "matt@sparkcx.co",
      status: UserStatus.ACTIVE,
    };
    const validatedInput = validateUserInput(userInput);

    // Step 2: Create User Entity
    const newUser = createUserEntity(validatedInput);

    // Step 3: Save User through the repository
    await userRepository.saveUser(newUser);

    // Step 4: Convert to DTO (if needed)
    const userDTO = toUserDTO(newUser);
    // console.log(userDTO);

    // For testing, retrieve the user from the in-memory database
    const retrievedUser = await userRepository.getUserById(newUser.email);
    if (retrievedUser) {
      console.log("Retrieved User:", toUserDTO(retrievedUser));
    } else {
      console.log("User not found in in-memory database.");
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
