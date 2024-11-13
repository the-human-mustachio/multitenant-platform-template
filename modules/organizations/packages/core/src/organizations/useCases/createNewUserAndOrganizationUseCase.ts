import { UserEntity, UserStatus } from "../entities/user";
import {
  OrganizationEntity,
  OrganizationStatus,
} from "../entities/organization";
import { UserRepository } from "../repositories/userRepository";
import { MembershipEntity, MembershipStatus } from "../entities/membership";

export const createNewUserAndOrganization = async (props: {
  userEmail: string;
  firstName: string;
  lastName: string;
}) => {
  const user = UserEntity.create({
    firstName: props.firstName,
    lastName: props.lastName,
    email: props.userEmail,
    status: UserStatus.ACTIVE,
  });

  const organization = OrganizationEntity.create({
    name: user.email,
    status: OrganizationStatus.ACTIVE,
  });

  const membership = MembershipEntity.create({
    email: user.email,
    organizationId: organization.id as string,
    status: MembershipStatus.ACTIVE,
    role: "user",
  });
  // membership.activateUserMembership();

  const result = await UserRepository.create({
    organization,
    user,
    membership,
  });
  return result;
};
