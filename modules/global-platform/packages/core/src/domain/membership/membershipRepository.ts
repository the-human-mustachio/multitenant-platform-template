// membershipRepository.ts
import { MembershipEntity } from "./membershipTypes";

export type SaveMembershipFunction = (
  membership: MembershipEntity
) => Promise<MembershipEntity>;

export type GetMembershipByEmailAndOrganizationIdFunction = (
  email: string,
  organizationId: string
) => Promise<MembershipEntity | undefined>;

export type UpdateMembershipByEmailAndOrganizationIdFunction = (
  email: string,
  organizationId: string,
  updatedMembership: Partial<MembershipEntity>
) => Promise<MembershipEntity | undefined>;

export type RemoveMembershipByEmailAndOrganizationIdFunction = (
  email: string,
  organizationId: string
) => Promise<boolean>;

export const createMembershipRepository = (
  saveMembershipFn?: SaveMembershipFunction,
  getMembershipByEmailAndOrganizationIdFn?: GetMembershipByEmailAndOrganizationIdFunction,
  updateMembershipByEmailAndOrganizationIdFn?: UpdateMembershipByEmailAndOrganizationIdFunction,
  removeMembershipByEmailAndOrganizationIdFn?: RemoveMembershipByEmailAndOrganizationIdFunction
) => ({
  saveMembership: (membership: MembershipEntity) => {
    if (!saveMembershipFn) {
      throw new Error("saveMembership function is not provided");
    }
    return saveMembershipFn(membership);
  },
  getMembershipByEmailAndOrganizationId: (
    email: string,
    organizationId: string
  ) => {
    if (!getMembershipByEmailAndOrganizationIdFn) {
      throw new Error(
        "getMembershipByEmailAndOrganizationId function is not provided"
      );
    }
    return getMembershipByEmailAndOrganizationIdFn(email, organizationId);
  },
  updateMembershipByEmailAndOrganizationId: (
    email: string,
    organizationId: string,
    updatedMembership: Partial<MembershipEntity>
  ) => {
    if (!updateMembershipByEmailAndOrganizationIdFn) {
      throw new Error(
        "updateMembershipByEmailAndOrganizationId function is not provided"
      );
    }
    return updateMembershipByEmailAndOrganizationIdFn(
      email,
      organizationId,
      updatedMembership
    );
  },
  removeMembershipByEmailAndOrganizationId: (
    email: string,
    organizationId: string
  ) => {
    if (!removeMembershipByEmailAndOrganizationIdFn) {
      throw new Error(
        "removeMembershipByEmailAndOrganizationId function is not provided"
      );
    }
    return removeMembershipByEmailAndOrganizationIdFn(email, organizationId);
  },
});
