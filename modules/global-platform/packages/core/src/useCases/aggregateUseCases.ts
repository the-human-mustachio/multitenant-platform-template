import { DynamoDBAdapter } from "../adapters/dynamoDBAdapter";
import {
  validateMembershipInput,
  createMembershipEntity,
} from "../domain/membership/membershipFunctions";
import { createMembershipRepository } from "../domain/membership/membershipRepository";
import {
  validateOrganizationInput,
  createOrganizationEntity,
} from "../domain/organization/organizationFunctions";
import { createOrganizationRepository } from "../domain/organization/organizationRepository";
import {
  validateUserInput,
  createUserEntity,
} from "../domain/user/userFunctions";
import { createUserRepository } from "../domain/user/userRepository";
import { UserStatus } from "../domain/user/userTypes";

// User Repo and Adapter Functions
const saveUserFn = DynamoDBAdapter.upsertUser();
const getUserByEmailFn = DynamoDBAdapter.getUserByEmail();
const userRepository = createUserRepository(saveUserFn, getUserByEmailFn);
// Org Repo and Adapter Functions
const saveOrganizationFn = DynamoDBAdapter.upsertOrganization();
const getOrganizationByIdFn = DynamoDBAdapter.getOrganizationById();
const organizationRepository = createOrganizationRepository(
  saveOrganizationFn,
  getOrganizationByIdFn
);
// Membership Repo and Adapter Functions
const saveMembershipFn = DynamoDBAdapter.upsertMembership();
const getMembershipByEmailAndOrganizationIdFn =
  DynamoDBAdapter.getMembershipByEmailAndOrgId();

const membershipRepository = createMembershipRepository(
  saveMembershipFn,
  getMembershipByEmailAndOrganizationIdFn
);

type CreateNewUserAndOrganizationResponse = {
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  memberships: [{ status: string; role: string; org: any }];
};
export namespace AggregateUseCases {
  export const createNewUserAndOrganization = async (props: {
    userEmail: string;
    firstName: string;
    lastName: string;
  }) => {
    const userInput = {
      ...props,
      email: props.userEmail,
      status: UserStatus.ACTIVE,
    };
    // Step 1: Create and Validate User Entity Input
    const _userInput = validateUserInput(userInput);
    const newUser = createUserEntity(_userInput);

    // Step 3: Create and Validate  Org  Entity
    const organizationInput = { name: newUser.email, status: "active" };
    const _orgInput = validateOrganizationInput(organizationInput);
    const newOrganization = createOrganizationEntity(_orgInput);

    // Step 4: Create and Validate Membership Entity
    const membershipInput = {
      email: newUser.email,
      organizationId: newOrganization.id,
      status: "active",
      role: "admin",
    };
    const _membershipInput = validateMembershipInput(membershipInput);
    const newMembership = createMembershipEntity(_membershipInput);

    // Step 3: Save User through the repository
    await userRepository.saveUser(newUser);

    // Step 6: Save Organization through the repository
    await organizationRepository.saveOrganization(newOrganization);

    // Step 3: Save Membership through the repository
    await membershipRepository.saveMembership(newMembership);
    let result: CreateNewUserAndOrganizationResponse = {
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      status: newUser.status,
      memberships: [
        {
          status: newMembership.status,
          role: newMembership.role,
          org: newOrganization,
        },
      ],
    };
    return result;
  };
}
