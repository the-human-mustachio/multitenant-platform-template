// userRepository.ts
import { UserEntity } from "./userTypes";

export type SaveUserFunction = (user: UserEntity) => Promise<UserEntity>;

export type GetUserByIdFunction = (
  id: string
) => Promise<UserEntity | undefined>;

export type UpdateUserByIdFunction = (
  id: string,
  updatedUser: Partial<UserEntity>
) => Promise<UserEntity | undefined>;

export type RemoveUserByIdFunction = (id: string) => Promise<boolean>;

export const createUserRepository = (
  saveUserFn?: SaveUserFunction,
  getUserByIdFn?: GetUserByIdFunction,
  updateUserByIdFn?: UpdateUserByIdFunction,
  removeUserByIdFn?: RemoveUserByIdFunction
) => ({
  saveUser: (user: UserEntity) => {
    if (!saveUserFn) {
      throw new Error("saveUser function is not provided");
    }
    return saveUserFn(user);
  },
  getUserById: (id: string) => {
    if (!getUserByIdFn) {
      throw new Error("getUserById function is not provided");
    }
    return getUserByIdFn(id);
  },
  updateUserById: (id: string, updatedUser: Partial<UserEntity>) => {
    if (!updateUserByIdFn) {
      throw new Error("updateUserById function is not provided");
    }
    return updateUserByIdFn(id, updatedUser);
  },
  removeUserById: (id: string) => {
    if (!removeUserByIdFn) {
      throw new Error("removeUserById function is not provided");
    }
    return removeUserByIdFn(id);
  },
});
