/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "platform-template",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          defaultTags: {},
        },
      },
    };
  },
  async run() {
    $transform(sst.aws.Function, (args, opts) => {
      // Set the default if it's not set by the component
      args.runtime ??= "nodejs22.x";
      args.logging ??= { retention: "1 week" };
      args.memory ??= "512 MB";
      args.timeout ??= "30 seconds";
    });
    const {
      globalPlatformApi,
      globalPlatformBucket,
      globalPlatformTable,
      userOrgScoppedAssumeRole,
      auth,
    } = await import("./modules/global-platform/infra/index");
    // const storage = await import("./modules/global-platform/infra/storage");
    // const api = await import("./modules/global-platform/infra/api");

    return {
      platformBucketArn: globalPlatformBucket.arn,
      url: auth.url,
    };
  },
});
