export enum OrganizationStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export type OrganizationEntity = {
  id: string;
  name: string;
  status: OrganizationStatus;
  created: Date;
  updated: Date;
};

export type OrganizationEntityDTO = {
  id: string;
  name: string;
  status: OrganizationStatus;
  created: Date;
  updated: Date;
};
