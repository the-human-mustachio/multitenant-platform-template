import { MembershipEntity } from "organizations/entities/membership";
import { getMembership, upsertMembership } from "../adapters/dynamoAdapter";

export namespace MembershipRepository {
  export const upsert = async (membership: MembershipEntity) => {
    const _membership = await upsertMembership(membership.toDTO());
    return _membership;
  };

  export const get = async (
    email: string,
    organizationId: string
  ): Promise<MembershipEntity> => {
    const _membership = await getMembership(email, organizationId);
    return MembershipEntity.create(_membership);
  };

  export const update = async () => {
    // Add functional update logic as required
  };

  export const remove = async () => {
    // Add functional remove logic as required
  };
}
