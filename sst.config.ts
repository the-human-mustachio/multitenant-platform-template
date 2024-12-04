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
