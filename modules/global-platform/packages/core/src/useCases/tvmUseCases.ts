import { Resource } from "sst";
import { DynamoDBAdapter } from "../adapters/dynamoDBAdapter";
import { assumeAwsRole } from "../adapters/stsAdapter";
import { createMembershipRepository } from "../domain/membership/membershipRepository";
import { createPolicyDocument } from "../domain/tvm/tvmFunctions";
import { createPolicyRepository } from "../domain/tvm/tvmRepository";
import { PolicyCredentials } from "../domain/tvm/tvmTypes";

// Create the repository instance using the policy generation and assume role functions
const policyRepository = createPolicyRepository(
  createPolicyDocument,
  assumeAwsRole
);

const getMembershipByEmailAndOrganizationIdFn =
  DynamoDBAdapter.getMembershipByEmailAndOrgId();

const membershipRepository = createMembershipRepository(
  undefined,
  getMembershipByEmailAndOrganizationIdFn
);

export namespace TVMUseCases {
  export const generateAndAssumePolicy = async (
    userEmail: string,
    organizationId: string
  ): Promise<PolicyCredentials> => {
    // Validate input

    // Get Membership
    const membership =
      await membershipRepository.getMembershipByEmailAndOrganizationId(
        userEmail,
        organizationId
      );
    // Check if active
    if (membership && membership.status === "active") {
    } else {
      throw new Error("Invalid User Membership");
    }

    // Generate Policy
    const policyDocument = policyRepository.generatePolicy({
      userEmail,
      organizationId,
    });

    // Assume role using the dynamically generated policy
    const roleArn = `${Resource.UserOrgScoppedAssumeRole.assumeRoleArn}`;
    const sessionName = `Session-${userEmail.replace(/[@.]/g, "-")}`;

    const creds = await policyRepository.assumeRole({
      roleArn,
      sessionName,
      policyDocument,
    });
    return creds;
  };
}
