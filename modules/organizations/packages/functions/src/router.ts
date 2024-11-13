import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

type Handler = (params: {
  pathParams: Record<string, string>;
  queryParams: Record<string, string | undefined>;
  body: Record<string, string | undefined>;
}) => Promise<APIGatewayProxyResult>;

interface Route {
  method: string;
  pathTemplate: string;
  handler: Handler;
}

export class APIRouter {
  private routes: Route[] = [];

  addRoute(method: string, pathTemplate: string, handler: Handler): void {
    this.routes.push({ method, pathTemplate, handler });
  }

  async routeRequest(
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> {
    // Obtain method and path from requestContext.http if present (for HTTP API), otherwise from event (for REST API)
    const method = event.httpMethod || event.requestContext?.http?.method || "";
    const path = event.path || event.requestContext?.http?.path || "";
    const queryStringParameters = event.queryStringParameters || {};
    const pathSegments = path.split("/").filter(Boolean);
    const body = event.body ? JSON.parse(event.body) : null;

    for (const route of this.routes) {
      if (route.method !== method) continue;

      const routeSegments = route.pathTemplate.split("/").filter(Boolean);
      if (routeSegments.length !== pathSegments.length) continue;

      const pathParams: Record<string, string> = {};
      let isMatch = true;

      for (let i = 0; i < routeSegments.length; i++) {
        const routeSegment = routeSegments[i];
        const pathSegment = pathSegments[i];

        if (routeSegment.startsWith(":")) {
          pathParams[routeSegment.slice(1)] = pathSegment;
        } else if (routeSegment !== pathSegment) {
          isMatch = false;
          break;
        }
      }

      if (isMatch) {
        return route.handler({
          pathParams,
          queryParams: queryStringParameters,
          body,
        });
      }
    }

    // No route matched
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: `No route matched for ${method} ${path}`,
      }),
    };
  }
}

// // Lambda handler
// const apiRouter = new APIRouter();

// // Define routes
// apiRouter.addRoute(
//   "GET",
//   "/users/:userId",
//   async ({ pathParams, queryParams }) => {
//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: `Fetched user with ID: ${pathParams.userId}`,
//         queryParams,
//       }),
//     };
//   }
// );

// apiRouter.addRoute("POST", "/users", async ({ pathParams, queryParams }) => {
//   return {
//     statusCode: 201,
//     body: JSON.stringify({
//       message: `User created`,
//       queryParams,
//     }),
//   };
// });

// export const handler = async (
//   event: APIGatewayProxyEvent
// ): Promise<APIGatewayProxyResult> => {
//   return apiRouter.routeRequest(event);
// };
