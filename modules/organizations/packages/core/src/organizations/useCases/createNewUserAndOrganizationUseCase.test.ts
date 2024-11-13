import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { UserRepository } from "../repositories/userRepository";
import { createNewUserAndOrganization } from "./createNewUserAndOrganizationUseCase";

const validProps = {
  userEmail: "valid@example.com",
  firstName: "John",
  lastName: "Doe",
};

const invalidEmailProps = {
  ...validProps,
  userEmail: "invalid-email",
};

const mockResult = {
  organization: {
    id: "org-id",
    name: validProps.userEmail,
    status: "active",
  },
  user: { id: "user-id", ...validProps, status: "active" },
  membership: {
    id: "membership-id",
    email: validProps.userEmail,
    role: "user",
    status: "active",
  },
};

// Mock UserRepository
vi.mock(import("../repositories/userRepository"), async () => {
  return {
    UserRepository: {
      create: vi.fn(() => {
        return mockResult;
      }),
    },
  };
});

describe("createNewUserAndOrganization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw an error for an invalid email address", async () => {
    await expect(
      createNewUserAndOrganization(invalidEmailProps)
    ).rejects.toThrow("Invalid email address");
  });

  it("should create a new user, organization, and membership for a valid email", async () => {
    // const mockResult = {
    //   organization: {
    //     id: "org-id",
    //     name: validProps.userEmail,
    //     status: "ACTIVE",
    //   },
    //   user: { id: "user-id", ...validProps, status: "ACTIVE" },
    //   membership: {
    //     id: "membership-id",
    //     email: validProps.userEmail,
    //     role: "user",
    //     status: "ACTIVE",
    //   },
    // };

    // (UserRepository.create as Mock).mockResolvedValue(mockResult);

    const result = await createNewUserAndOrganization(validProps);

    expect(result).toEqual(mockResult);
    expect(UserRepository.create).toHaveBeenCalledWith({
      organization: expect.any(Object),
      user: expect.any(Object),
      membership: expect.any(Object),
    });
  });
});
