// infra/auth.ts
import { secrets } from "./secrets";
import { globalPlatformTable } from "./storage";

// const table = new sst.aws.Dynamo("AuthTable", {
//   fields: {
//     pk: "string",
//     sk: "string",
//   },
//   ttl: "expiry",
//   primaryIndex: {
//     hashKey: "pk",
//     rangeKey: "sk",
//   },
// });

export const auth = new sst.aws.Auth("LambdaAuth", {
  authorizer: {
    timeout: "30 seconds",
    handler: "modules/global-platform/packages/functions/src/auth2.handler",
    link: [globalPlatformTable, secrets.GoogleClientID],
  },
});

// new sst.aws.Auth("Auth", {
//   authenticator: {
//     link: [secrets.GoogleClientID, globalPlatformTable],
//     handler: "modules/global-platform/packages/functions/src/auth.handler",
//   },
// });
