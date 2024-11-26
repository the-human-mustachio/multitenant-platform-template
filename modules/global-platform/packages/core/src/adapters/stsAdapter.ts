// awsAdapter.ts

import { AssumeRoleCommand, STSClient } from "@aws-sdk/client-sts";
import { AssumeRoleFunction } from "../domain/tvm/tvmRepository";

// Initialize the STS client (AWS SDK v3)
const sts = new STSClient({});

// Assume an IAM role and return temporary credentials
export const assumeAwsRole: AssumeRoleFunction = async ({
  roleArn,
  sessionName,
  policyDocument,
}) => {
  try {
    const params = {
      RoleArn: roleArn,
      RoleSessionName: sessionName,
      Policy: policyDocument,
    };

    // Assuming the role via AWS STS
    const data = await sts.send(new AssumeRoleCommand(params));

    // Return the temporary credentials
    if (data.Credentials) {
      return {
        accessKeyId: data.Credentials.AccessKeyId!,
        secretAccessKey: data.Credentials.SecretAccessKey!,
        sessionToken: data.Credentials.SessionToken!,
      };
    }

    throw new Error("Failed to assume role or no credentials returned.");
  } catch (error) {
    console.error("Error assuming role:", error);
    throw new Error(
      "Error assuming role and retrieving temporary credentials."
    );
  }
};
