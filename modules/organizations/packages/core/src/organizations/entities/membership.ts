import { z } from "zod";

export enum MembershipStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  INVITED = "invited",
}

// Validation schema using Zod
const MembershipEntitySchema = z.object({
  _email: z.string().email("Invalid email address."),
  _organizationId: z.string().optional(),
  _status: z.nativeEnum(MembershipStatus),
  _role: z.string().min(1, "Role must be specified."),
  _created: z.date().optional(),
  _updated: z.date().optional(),
});

export type MembershipDTO = {
  email: string;
  organizationId?: string;
  status: MembershipStatus;
  role: string;
  created?: Date;
  updated?: Date;
};

export class MembershipEntity {
  private _email: string;
  private _organizationId?: string;
  private _status: MembershipStatus;
  private _role: string;
  private _created?: Date;
  private _updated?: Date;

  constructor(props: MembershipDTO) {
    this._email = props.email;
    this._organizationId = props.organizationId;
    this._status = props.status;
    this._role = props.role;
    this._created = props.created;
    this._updated = props.updated;

    // Perform initial validation
    this.validate();
  }

  static create(props: MembershipDTO): MembershipEntity {
    return new MembershipEntity(props);
  }

  get status(): MembershipStatus {
    return this._status;
  }

  private set status(value: MembershipStatus) {
    this.validateStatusTransition(value);
    this._status = value;
  }

  // Validates if the status transition is allowed
  private validateStatusTransition(newStatus: MembershipStatus): void {
    const allowedTransitions: Record<MembershipStatus, MembershipStatus[]> = {
      [MembershipStatus.INVITED]: [MembershipStatus.ACTIVE],
      [MembershipStatus.ACTIVE]: [MembershipStatus.INACTIVE],
      [MembershipStatus.INACTIVE]: [MembershipStatus.ACTIVE],
    };

    const allowedNextStatuses = allowedTransitions[this._status];
    if (!allowedNextStatuses.includes(newStatus)) {
      throw new Error(
        `Invalid status transition from ${this._status} to ${newStatus}`
      );
    }
  }

  activateUserMembership() {
    this.status = MembershipStatus.ACTIVE;
  }

  inactivateUserMembership() {
    this.status = MembershipStatus.INACTIVE;
  }

  inviteUserMembership() {
    this.status = MembershipStatus.INVITED;
  }

  // Validation function to ensure the current state is valid
  validate(): void {
    MembershipEntitySchema.parse(this);
  }

  toDTO(): MembershipDTO {
    return {
      email: this._email,
      organizationId: this._organizationId,
      status: this._status,
      role: this._role,
      created: this._created,
      updated: this._updated,
    };
  }
}
