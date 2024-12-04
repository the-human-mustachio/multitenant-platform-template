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
globalPlatformApi.route(
  "ANY /user/{proxy+}",
  "modules/global-platform/packages/functions/src/routerHandler.handler"
);
