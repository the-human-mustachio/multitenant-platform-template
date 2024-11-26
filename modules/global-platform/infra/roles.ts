/**
 * This role will need to be broad enough for a User and Org combo to access their resources.
 * This will be things like S3 access, DynamoDB access etc..
 * A resource in the platform will belong to either the system, the user, or the org
 */

import { globalPlatformBucket } from "./storage";

// this should be updated to deny all resources that are not needed by the platform
const userOrgAssumeRole = new aws.iam.Role("userOrgAssumeRole", {
  name: `${$app.name}-${$app.stage}-user-org-assume-role`,
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Effect: "Allow",
        Sid: "",
        Principal: {
          AWS: `arn:aws:iam::471112703072:root`,
          // Service: "sts.amazonaws.com",
        },
      },
    ],
  }),
});
// console.log(await bucket.arn);
// Attach a policy to the
const policy = new aws.iam.Policy("assumeRolePolicy", {
  policy: aws.iam.getPolicyDocumentOutput({
    version: "2012-10-17",
    statements: [
      {
        effect: "Allow",
        actions: ["s3:ListBucket"],
        resources: [globalPlatformBucket.arn],
      },
    ],
  }).json,
});
new aws.iam.RolePolicyAttachment("myRolePolicyAttachment", {
  role: userOrgAssumeRole.name,
  policyArn: policy.arn,
});
export const userOrgScoppedAssumeRole = new sst.Linkable(
  "UserOrgScoppedAssumeRole",
  {
    properties: {
      assumeRoleArn: userOrgAssumeRole.arn,
    },
    include: [
      sst.aws.permission({
        actions: ["sts:AssumeRole"],
        resources: [userOrgAssumeRole.arn],
      }),
    ],
  }
);
