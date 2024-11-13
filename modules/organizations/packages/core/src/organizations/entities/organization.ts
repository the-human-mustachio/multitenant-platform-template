export enum OrganizationStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export type OrganizationDTO = {
  id?: string;
  name: string;
  status: OrganizationStatus;
  created?: Date;
  updated?: Date;
};
export class OrganizationEntity {
  private _id?: string;
  private _name: string;
  private _status: OrganizationStatus;
  private _created?: Date;
  private _updated?: Date;
  constructor(props: OrganizationDTO) {
    this._id = props.id;
    this._name = props.name;
    this._status = props.status;
    this._created = props.created;
    this._updated = props.updated;
  }

  static create(props: OrganizationDTO): OrganizationEntity {
    return new OrganizationEntity(props);
  }

  public get id(): string | undefined {
    return this._id;
  }

  toDTO(): OrganizationDTO {
    return {
      id: this._id,
      name: this._name,
      status: this._status,
      created: this._created,
      updated: this._updated,
    };
  }
}
