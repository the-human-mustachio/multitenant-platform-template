// infra/auth.ts
import { secrets } from "./secrets";
import { globalPlatformTable } from "./storage";

export const auth = new sst.aws.Auth("Auth", {
  authenticator: {
    link: [secrets.GoogleClientID, globalPlatformTable],
    handler: "modules/global-platform/packages/functions/src/auth.handler",
  },
});
