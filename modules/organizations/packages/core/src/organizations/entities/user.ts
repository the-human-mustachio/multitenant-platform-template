export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export type UserDTO = {
  // Move to Entity Level
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatus;
  created?: Date;
  updated?: Date;
};
export class UserEntity {
  private _id?: string;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _status: UserStatus;
  private _created?: Date;
  private _updated?: Date;
  constructor(props: UserDTO) {
    this._id = props.id;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
    this._status = props.status;
    this._created = props.created;
    this._updated = props.updated;
  }

  static create(props: UserDTO): UserEntity {
    return new UserEntity(props);
  }

  public get email(): string {
    return this._email;
  }
  set email(value: string) {
    this._email = value;
  }

  toDTO(): UserDTO {
    return {
      id: this._id,
      firstName: this._firstName,
      lastName: this._lastName,
      email: this._email,
      status: this._status,
      created: this._created,
      updated: this._updated,
    };
  }
}
