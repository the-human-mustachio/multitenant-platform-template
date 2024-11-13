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
    await import("./infra/storage");
    const organizations = await import(
      "./modules/organizations/infra/organizations"
    );

    return {
      // api: api.api.url,
    };
  },
});
