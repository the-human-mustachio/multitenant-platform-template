import { Logger } from "@aws-lambda-powertools/logger";
import {
  APIGatewayRequestAuthorizerEventV2,
  APIGatewaySimpleAuthorizerWithContextResult,
} from "aws-lambda";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { Resource } from "sst/resource";
import { APIGatewayUserContextAuth } from "./types";

const logger = new Logger({ serviceName: "gatewayAuthorizor" });

const jwksUri = `${Resource.LambdaAuth.url}/.well-known/jwks.json`;
const audience = "123";
const issuer = `${Resource.LambdaAuth.url}`;

// JWK Set for token verification
const jwks = createRemoteJWKSet(new URL(jwksUri));

export const handler = async (
  event: APIGatewayRequestAuthorizerEventV2
): Promise<
  APIGatewaySimpleAuthorizerWithContextResult<APIGatewayUserContextAuth>
> => {
  try {
    logger.debug("Received event:", JSON.stringify(event, null, 2));

    const token = event.identitySource?.[0]?.split("Bearer ")[1];
    if (!token) {
      logger.error("Missing or invalid Authorization token");
      throw new Error("Unauthorized");
    }

    // Verify the token using jose
    const { payload } = await jwtVerify(token, jwks, {
      audience,
      issuer,
    });

    logger.debug("Decoded token:", payload);

    // Return an authorized response with custom context
    return {
      isAuthorized: true,
      context: {
        type: "user",
        organziationId: payload.properties.organizationId,
        userId: payload.properties.userId,
        userEmail: payload.properties.userEmail,
        sub: payload.sub || null,
        // username: (payload as any).username || "unknown",
        // roles: (payload as any).roles?.join(",") || "",
        // scope: payload.scope || "",
      },
    };
  } catch (error: unknown) {
    // Narrow the error to provide detailed logging and better type safety
    if (error instanceof Error) {
      logger.error("Authorization failed:", error.message);
    } else {
      logger.error("Unknown error occurred during authorization", error);
    }

    // Return unauthorized response
    return {
      isAuthorized: false,
      context: null,
    };
  }
};
