import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
// import { createNewUserAndOrganization } from "../../core/src/useCases/useCases";
// import { generateAndAssumePolicy } from "../../core/src/domain/tvm/main";
import { z } from "zod";
import { APIRouter } from "./router";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { Resource } from "sst";
import { createNewUserAndOrganization } from "@platform-organizations/core/useCases/useCases";
import { generateAndAssumePolicy } from "@platform-organizations/core/domain/tvm/main";

// Lambda router handler
const apiRouter = new APIRouter();

// Define routes
apiRouter.addRoute("GET", "/user/test", async ({ pathParams, queryParams }) => {
  const tenantScope = await generateAndAssumePolicy(
    "matt@sparkcx.co",
    "01JDATQVTAQ3V003004AMPA300"
  );
  const files = await listS3BucketContents(
    Resource.GlobalPlatformBucket.name,
    {
      accessKeyId: tenantScope.accessKeyId,
      secretAccessKey: tenantScope.secretAccessKey,
      sessionToken: tenantScope.sessionToken,
      region: "us-west-2",
    },
    ""
  );
  console.log(files);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Fetched user with ID: ${files}`,
      queryParams,
    }),
  };
});

const CreateNewUserAndOrganizationSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .refine(
      (val) => !/^\s/.test(val),
      "First name cannot start with whitespace"
    ),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .refine(
      (val) => !/^\s/.test(val),
      "Last name cannot start with whitespace"
    ),

  userEmail: z
    .string()
    .email("Invalid email address")
    .refine((val) => !/^\s/.test(val), "Email cannot start with whitespace"),
});

apiRouter.addRoute(
  "POST",
  "/user/newUser",
  async ({ pathParams, queryParams, body }) => {
    const data = body as z.infer<typeof CreateNewUserAndOrganizationSchema>;
    // validate request body
    const valid = CreateNewUserAndOrganizationSchema.safeParse(data);

    if (!valid.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: valid.error.format() }),
      };
    }
    // check is user already exists

    // create new user with default workspace using the users email as their workspace name
    const result = await createNewUserAndOrganization({
      firstName: data.firstName,
      lastName: data.lastName,
      userEmail: data.userEmail,
    });
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: `User & Organization created`,
        result,
      }),
    };
  }
);

interface S3ClientConfig {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  region: string;
}

const listS3BucketContents = async (
  bucketName: string,
  config: S3ClientConfig,
  prefix: string = ""
): Promise<string[]> => {
  const s3Client = new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      sessionToken: config.sessionToken,
    },
  });

  const objects: string[] = [];
  let continuationToken: string | undefined;

  try {
    do {
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      });

      const response = await s3Client.send(command);
      const contents = response.Contents || [];

      objects.push(...contents.map((item) => item.Key || ""));
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return objects;
  } catch (error) {
    console.error("Error listing bucket contents:", error);
    throw error;
  }
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return apiRouter.routeRequest(event);
};