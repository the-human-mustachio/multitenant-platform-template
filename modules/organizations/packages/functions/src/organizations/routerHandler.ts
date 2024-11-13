import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createNewUserAndOrganization } from "../../../core/src/organizations/useCases/CreateNewUserAndOrganizationUseCase";
import { z } from "zod";
import { APIRouter } from "../router";

// Lambda router handler
const apiRouter = new APIRouter();

// Define routes
apiRouter.addRoute(
  "GET",
  "/organization/:userId",
  async ({ pathParams, queryParams }) => {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Fetched user with ID: ${pathParams.userId}`,
        queryParams,
      }),
    };
  }
);

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
  "/organization/newUser",
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

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return apiRouter.routeRequest(event);
};
