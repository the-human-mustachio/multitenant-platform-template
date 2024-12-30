export const globalPlatformBucket = new sst.aws.Bucket("GlobalPlatformBucket");

export const globalPlatformTable = new sst.aws.Dynamo("GlobalPlatformTable", {
  fields: {
    pk: "string",
    sk: "string",
    gs1pk: "string",
    gs1sk: "string",
    adminGSI1pk: "string",
    adminGSI1sk: "string",
  },
  primaryIndex: { hashKey: "pk", rangeKey: "sk" },
  globalIndexes: {
    gsi1: { hashKey: "gs1pk", rangeKey: "gs1sk" },
    adminGSI1: { hashKey: "adminGSI1pk", rangeKey: "adminGSI1sk" },
  },
});
