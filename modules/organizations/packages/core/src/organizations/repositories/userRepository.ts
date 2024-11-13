import {
  createUserWithDefaultOrganization,
  getUser,
} from "../adapters/dynamoAdapter";
import { UserEntity } from "../entities/user";
import { OrganizationEntity } from "../entities/organization";
import { MembershipEntity } from "../entities/membership";

export namespace UserRepository {
  export const create = async (props: {
    organization: OrganizationEntity;
    user: UserEntity;
    membership: MembershipEntity;
  }) => {
    const { organization, user, membership } =
      await createUserWithDefaultOrganization({
        organization: props.organization.toDTO(),
        user: props.user.toDTO(),
        membership: props.membership.toDTO(),
      });
    return { organization, user, membership };
  };

  export const get = async (email: string): Promise<UserEntity> => {
    const _user = await getUser(email);
    return UserEntity.create(_user);
  };

  export const update = async () => {
    // Functional update logic here
  };

  export const remove = async () => {
    // Functional remove logic here
  };
}
