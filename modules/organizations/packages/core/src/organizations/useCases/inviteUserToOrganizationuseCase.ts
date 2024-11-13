import { MembershipEntity, MembershipStatus } from "../entities/membership";
import { MembershipRepository } from "../repositories/membershipRepository";
import { OrganizationRepository } from "../repositories/organizationRepository";
import { UserRepository } from "../repositories/userRepository";

export class InviteUserToOrganizationUseCase {
  constructor() {}

  public async execute(props: { userEmail: string; organizationId: string }) {
    // get user
    let user;
    try {
      user = await UserRepository.get(props.userEmail);
    } catch (error) {
      console.error(error);
    }

    let organization;
    try {
      organization = await OrganizationRepository.get(props.organizationId);
    } catch (error) {
      console.error(error);
    }
    if (!organization) {
      // throw error because there should always be an organization
      throw new Error("Organization does not exist");
    }

    // do logic on user

    // check if user is already associated with org
    let membership;
    try {
      membership = await MembershipRepository.get(
        props.userEmail,
        props.organizationId
      );
    } catch (error) {
      console.log(error);
      membership = null;
    }

    if (!membership) {
      membership = MembershipEntity.create({
        email: props.userEmail,
        organizationId: props.organizationId,
        status: MembershipStatus.INVITED,
        role: "user",
      });
    }
    // membership.activateUserMembership();
    membership.inviteUserMembership();
    membership = await MembershipRepository.upsert(membership);
    // do logic on membership
    console.log("finish");
  }
}

(async () => {
  try {
    const uc = new InviteUserToOrganizationUseCase();
    await uc.execute({
      userEmail: "matt@sparkcx.com",
      organizationId: "01JCGY193K3B9RZ5TK6RWY0539",
    });
  } catch (e) {
    // Deal with the fact the chain failed
    console.error(e);
  }
})();
