export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export type UserEntity = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatus;
  defaultOrg: string;
  created: Date;
  updated: Date;
};

export type UserEntityDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatus;
  defaultOrg: string;
  created: Date;
  updated: Date;
};
