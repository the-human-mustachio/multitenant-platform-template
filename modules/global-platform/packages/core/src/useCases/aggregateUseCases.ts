import { DynamoDBAdapter } from "../adapters/dynamoDBAdapter";
import {
  validateMembershipInput,
  createMembershipEntity,
} from "../domain/membership/membershipFunctions";
import { createMembershipRepository } from "../domain/membership/membershipRepository";
import { MembershipEntity } from "../domain/membership/membershipTypes";
import {
  validateOrganizationInput,
  createOrganizationEntity,
} from "../domain/organization/organizationFunctions";
import { createOrganizationRepository } from "../domain/organization/organizationRepository";
import { OrganizationEntity } from "../domain/organization/organizationTypes";
import {
  validateUserInput,
  createUserEntity,
} from "../domain/user/userFunctions";
import { createUserRepository } from "../domain/user/userRepository";
import { UserEntity, UserStatus } from "../domain/user/userTypes";

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
  /**
   * TODO if user exists this function should return the user, org and membership. Currently today it is only returning the user if they exist already.
   * If the user and org and memberhsip is created then all three get returned
   *
   *
   * @param props
   * @returns
   */
  // TODO change the name of this usecase
  // TODO if user exists this function should return the user, org and membership. Currently today it is only returning the user if they exist already. If the user and org and memberhsip is created then all three get returned
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

    const existingUser = await userRepository.getUserById(_userInput.email);
    let u: UserEntity | undefined;
    let o: OrganizationEntity | undefined;
    let m: MembershipEntity | undefined;
    if (existingUser) {
      o = await organizationRepository.getOrganizationById(
        existingUser.defaultOrg
      );

      u = existingUser;

      // Step 6: Save Membership through the repository
      m = await membershipRepository.getMembershipByEmailAndOrganizationId(
        existingUser.email,
        existingUser.defaultOrg
      );
      // return existingUser;
    } else {
      // Step 2: Create and Validate  Org  Entity
      const newUser = createUserEntity(_userInput);
      const organizationInput = { name: newUser.email, status: "active" };
      const _orgInput = validateOrganizationInput(organizationInput);
      const newOrganization = createOrganizationEntity(_orgInput);
      newUser.defaultOrg = newOrganization.id;

      // Step 3: Create and Validate Membership Entity
      const membershipInput = {
        email: newUser.email,
        organizationId: newOrganization.id,
        status: "active",
        role: "admin",
      };
      const _membershipInput = validateMembershipInput(membershipInput);
      const newMembership = createMembershipEntity(_membershipInput);

      // Step 5: Save Organization through the repository
      o = await organizationRepository.saveOrganization(newOrganization);

      // Step 4: Save User through the repository
      u = await userRepository.saveUser(newUser);

      // Step 6: Save Membership through the repository
      m = await membershipRepository.saveMembership(newMembership);
    }

    if (o && m && u) {
      let result: CreateNewUserAndOrganizationResponse = {
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        status: u.status,
        memberships: [
          {
            status: m.status,
            role: m.role,
            org: o,
          },
        ],
      };
      return result;
    } else {
      throw new Error("Error getting user, org, and membership");
    }
  };
}
