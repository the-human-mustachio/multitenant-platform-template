import { Resource } from "sst";
import { PolicyDetails } from "./tvmTypes";

export const createPolicyDocument = ({
  userEmail,
  organizationId,
}: PolicyDetails): string => {
  return JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      // DynamoDB access
      {
        Effect: "Allow",
        Action: ["dynamodb:Query", "dynamodb:GetItem"],
        Resource: "arn:aws:dynamodb:region:account-id:table/StaticTableName",
        Condition: {
          StringLike: {
            "dynamodb:LeadingKeys": [
              `${organizationId}/*`,
              `${organizationId}-shared/*`,
            ],
          },
        },
      },
      // S3 access
      {
        Effect: "Allow",
        Action: ["s3:GetObject", "s3:PutObject", "s3:ListBucket"],
        Resource: [
          `arn:aws:s3:::your-bucket-name/${organizationId}/*`,
          `arn:aws:s3:::${Resource.GlobalPlatformBucket.name}`,
        ],
      },
    ],
  });
};
