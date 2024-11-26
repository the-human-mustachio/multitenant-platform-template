// organizationRepository.ts
import { OrganizationEntity } from "./organizationTypes";

export type SaveOrganizationFunction = (
  organization: OrganizationEntity
) => Promise<OrganizationEntity>;

export type GetOrganizationByIdFunction = (
  id: string
) => Promise<OrganizationEntity | undefined>;

export type UpdateOrganizationByIdFunction = (
  id: string,
  updatedOrganization: Partial<OrganizationEntity>
) => Promise<OrganizationEntity | undefined>;

export type RemoveOrganizationByIdFunction = (id: string) => Promise<boolean>;

export const createOrganizationRepository = (
  saveOrganizationFn?: SaveOrganizationFunction,
  getOrganizationByIdFn?: GetOrganizationByIdFunction,
  updateOrganizationByIdFn?: UpdateOrganizationByIdFunction,
  removeOrganizationByIdFn?: RemoveOrganizationByIdFunction
) => ({
  saveOrganization: (organization: OrganizationEntity) => {
    if (!saveOrganizationFn) {
      throw new Error("saveOrganization function is not provided");
    }
    return saveOrganizationFn(organization);
  },
  getOrganizationById: (id: string) => {
    if (!getOrganizationByIdFn) {
      throw new Error("getOrganizationById function is not provided");
    }
    return getOrganizationByIdFn(id);
  },
  updateOrganizationById: (
    id: string,
    updatedOrganization: Partial<OrganizationEntity>
  ) => {
    if (!updateOrganizationByIdFn) {
      throw new Error("updateOrganizationById function is not provided");
    }
    return updateOrganizationByIdFn(id, updatedOrganization);
  },
  removeOrganizationById: (id: string) => {
    if (!removeOrganizationByIdFn) {
      throw new Error("removeOrganizationById function is not provided");
    }
    return removeOrganizationByIdFn(id);
  },
});
