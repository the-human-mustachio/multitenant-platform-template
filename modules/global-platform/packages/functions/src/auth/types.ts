// Custom type for API Gateway HTTP API v2 authorizer response
export type APIGatewayUserContextAuth = {
  // context?: Record<string, string | number | boolean>;
  type: "user";
  userId: string;
  userEmail: string;
  organziationId: string;
  sub: string | null;
};
