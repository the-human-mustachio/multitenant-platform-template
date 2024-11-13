import { getOrganization, upsertOrganization } from "../adapters/dynamoAdapter";
import { OrganizationEntity } from "../entities/organization";

export namespace OrganizationRepository {
  export const upsert = async (organization: OrganizationEntity) => {
    const _organization = await upsertOrganization(organization.toDTO());
  };

  export const get = async (organizationId: string) => {
    const _organization = await getOrganization(organizationId);
    return OrganizationEntity.create(_organization);
  };

  export const update = async () => {};

  export const remove = async () => {};
}
