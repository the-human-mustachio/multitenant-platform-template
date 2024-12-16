import { auth } from "./auth";
import { globalEmail } from "./email";
import { userOrgScoppedAssumeRole } from "./roles";
import { globalPlatformBucket, globalPlatformTable } from "./storage";

export const globalPlatformApi = new sst.aws.ApiGatewayV2("GlobalPlatformApi", {
  link: [
    globalPlatformBucket,
    userOrgScoppedAssumeRole,
    globalPlatformTable,
    globalEmail,
  ],
});

const authorizer = globalPlatformApi.addAuthorizer({
  name: "platformJWTAuthorizor",
  lambda: {
    function: {
      handler:
        "modules/global-platform/packages/functions/src/auth/gatewayAuthorizor.handler",
      link: [auth],
    },
  },
});

globalPlatformApi.route(
  "ANY /user/{proxy+}",
  "modules/global-platform/packages/functions/src/routerHandler.handler",
  { auth: { lambda: authorizer.id } }
);
