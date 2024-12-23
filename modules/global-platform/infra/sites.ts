import {auth} from "./auth";

export const adminSite = new sst.aws.StaticSite("AdminWebsite", {
  path: "modules/global-platform/web/admin",
  environment:{VITE_AUTH_ENDPOINT:auth.url}
  // build: {
  //   command: "pnpm run build",
  //   output: "dist",
  // },
});
