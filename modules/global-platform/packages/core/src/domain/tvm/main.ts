import { DynamoDBAdapter } from "../../adapters/dynamoDBAdapter";
import { assumeAwsRole } from "../../adapters/stsAdapter";
import { createMembershipRepository } from "../membership/membershipRepository";
import { createPolicyDocument } from "./tvmFunctions";
import { createPolicyRepository } from "./tvmRepository";
import { PolicyCredentials } from "./tvmTypes";
import { Resource } from "sst";

// Create the repository instance using the policy generation and assume role functions
const policyRepository = createPolicyRepository(
  createPolicyDocument,
  assumeAwsRole
);

const saveMembershipFn = DynamoDBAdapter.upsertMembership();
const getMembershipByEmailAndOrganizationIdFn =
  DynamoDBAdapter.getMembershipByEmailAndOrgId();

const membershipRepository = createMembershipRepository(
  undefined,
  getMembershipByEmailAndOrganizationIdFn
);

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

// console.log(
//   JSON.stringify(
//     JSON.parse(
//       policyRepository.generatePolicy({
//         userEmail: "matt@sparkcx.co",
//         organizationId: "12345",
//       })
//     ),
//     null,
//     2
//   )
// );

// generateAndAssumePolicy("matt@sparkcx.co", "01JD2WFTJJ9T19CBV30AP9QKXH");
