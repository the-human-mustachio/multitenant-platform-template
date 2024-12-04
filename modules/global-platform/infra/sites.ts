export const adminSite = new sst.aws.StaticSite("AdminWebsite", {
  path: "modules/global-platform/web/admin",
  // build: {
  //   command: "pnpm run build",
  //   output: "dist",
  // },
});
