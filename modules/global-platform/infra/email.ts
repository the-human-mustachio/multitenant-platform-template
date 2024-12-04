export const globalEmail = new sst.aws.Email("GlobalPlatformEmail", {
  sender: `matt+${$app.name}-${$app.stage}@sparkcx.co`,
});
