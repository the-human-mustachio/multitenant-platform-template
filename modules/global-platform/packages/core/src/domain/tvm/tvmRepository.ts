import {
  PolicyCredentials,
  PolicyDetails,
  RoleAssumptionDetails,
} from "./tvmTypes";

export type GeneratePolicyFunction = (policyDetails: PolicyDetails) => string;

export type AssumeRoleFunction = (
  roleDetails: RoleAssumptionDetails
) => Promise<PolicyCredentials>;

export const createPolicyRepository = (
  generatePolicyFn?: GeneratePolicyFunction,
  assumeRoleFn?: AssumeRoleFunction
) => ({
  generatePolicy: (policyDetails: PolicyDetails) => {
    if (!generatePolicyFn) {
      throw new Error("generatePolicy function is not provided");
    }
    return generatePolicyFn(policyDetails);
  },
  assumeRole: (roleDetails: RoleAssumptionDetails) => {
    if (!assumeRoleFn) {
      throw new Error("assumeRole function is not provided");
    }
    return assumeRoleFn(roleDetails);
  },
});
