import { auth } from "./auth";
import { globalEmail } from "./email";
import { userOrgScoppedAssumeRole } from "./roles";
import { secrets } from "./secrets";
import { globalPlatformBucket, globalPlatformTable } from "./storage";

export const globalPlatformApi = new sst.aws.ApiGatewayV2("GlobalPlatformApi", {
  link: [
    globalPlatformBucket,
    userOrgScoppedAssumeRole,
    globalPlatformTable,
    globalEmail,
  ],
});
globalPlatformApi.route(
  "ANY /user/{proxy+}",
  "modules/global-platform/packages/functions/src/routerHandler.handler"
);

globalPlatformApi.route("ANY /auth/{proxy+}", {
  link: [
    globalPlatformApi,
    auth.authenticator,
    secrets.GoogleClientID,
    globalPlatformTable,
  ],
  handler: "modules/global-platform/packages/functions/src/auth.wrapper",
});
