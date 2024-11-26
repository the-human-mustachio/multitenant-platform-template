export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export type UserEntity = {
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatus;
  created: Date;
  updated: Date;
};

export type UserEntityDTO = {
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatus;
  created: Date;
  updated: Date;
};
