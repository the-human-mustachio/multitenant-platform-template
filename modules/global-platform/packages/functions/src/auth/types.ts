// Custom type for API Gateway HTTP API v2 authorizer response
export type APIGatewayUserContextAuth = {
  // context?: Record<string, string | number | boolean>;
  userId: string;
  userEmail: string;
  organziationId: string;
};
