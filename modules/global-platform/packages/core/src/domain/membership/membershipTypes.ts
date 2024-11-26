export enum MembershipStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  INVITED = "invited",
}

export enum MembershipRole {
  USER = "user",
  ADMIN = "admin",
}

export type MembershipEntity = {
  email: string;
  organizationId: string;
  status: MembershipStatus;
  role: MembershipRole;
  created: Date;
  updated: Date;
};

export type MembershipEntityDTO = {
  email: string;
  organizationId: string;
  status: MembershipStatus;
  role: MembershipRole;
  created: Date;
  updated: Date;
};
