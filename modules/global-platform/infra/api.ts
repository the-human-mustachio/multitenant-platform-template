import { auth } from "./auth";
import { globalEmail } from "./email";
import { userOrgScoppedAssumeRole } from "./roles";
import { globalPlatformBucket, globalPlatformTable } from "./storage";

export const globalPlatformApi = new sst.aws.ApiGatewayV2("GlobalPlatformApi", {
  transform: {
    route: {
      handler: (args, opts) => {
        (args.memory ??= "512 MB"),
          ((args.logging = { retention: "1 week" }),
          (args.timeout = "30 seconds"));
      },
    },
  },
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
        "modules/global-platform/packages/functions/src/gatewayAuthorizor.handler",
      link: [auth],
    },
  },
});

globalPlatformApi.route(
  "ANY /user/{proxy+}",
  "modules/global-platform/packages/functions/src/routerHandler.handler",
  { auth: { lambda: authorizer.id } }
);

// globalPlatformApi.route("ANY /auth/{proxy+}", {
//   link: [
//     globalPlatformApi,
//     auth.authenticator,
//     secrets.GoogleClientID,
//     globalPlatformTable,
//   ],
//   handler: "modules/global-platform/packages/functions/src/auth.wrapper",
// });
