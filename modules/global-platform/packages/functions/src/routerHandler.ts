import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { APIRouter } from "./router";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { Resource } from "sst";
import { AggregateUseCases } from "@platform-organizations/core/useCases/aggregateUseCases";
import { UserUseCases } from "@platform-organizations/core/useCases/userUseCases";
import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import { render } from "jsx-email";
import { Template } from "./templates/email";

// Lambda router handler
const apiRouter = new APIRouter();

// Define routes
// =========== Route 1
apiRouter.addRoute("GET", "/user/test", async ({ pathParams, queryParams }) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Success`,
      queryParams,
    }),
  };
});
// =========== End Route 1

// =========== Route 2
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
    const result = await AggregateUseCases.createNewUserAndOrganization({
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
// =========== End Route 2

// =========== Route 3
apiRouter.addRoute("GET", "/user/email", async () => {
  const client = new SESv2Client();
  const command = new SendEmailCommand({
    FromEmailAddress: Resource.GlobalPlatformEmail.sender,
    FromEmailAddressIdentityArn: `arn:aws:ses:us-west-2:471112703072:identity/${Resource.GlobalPlatformEmail.sender}`,
    Destination: {
      ToAddresses: [Resource.GlobalPlatformEmail.sender],
    },
    Content: {
      Simple: {
        Subject: {
          Data: "Hello World!",
        },
        Body: {
          Html: {
            Data: await render(
              Template({
                email: "matt+platform-template-mattpuccio@sparkcx.co",
                name: "Spongebob Squarepants",
              })
            ),
          },
        },
      },
    },
  });
  await client.send(command);

  return {
    statusCode: 200,
    body: "Sent!",
  };
});
// =========== End Route 2

// =========== Route 4
apiRouter.addRoute(
  "GET",
  "/user/users",
  async ({ pathParams, queryParams, body }) => {
    // create new user with default workspace using the users email as their workspace name
    const result = await UserUseCases.listAllUsersUseCase();
    return {
      statusCode: 200,
      body: JSON.stringify({
        result,
      }),
    };
  }
);
// =========== End Route 4

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
