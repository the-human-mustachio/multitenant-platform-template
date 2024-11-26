// Input for generating a policy document
export interface PolicyDetails {
  userEmail: string;
  organizationId: string;
}

// Input for assuming an AWS role
export interface RoleAssumptionDetails {
  roleArn: string;
  sessionName: string;
  policyDocument: string;
}

// Temporary AWS credentials returned after assuming a role
export interface PolicyCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
}
