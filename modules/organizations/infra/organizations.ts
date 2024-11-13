export const table = new sst.aws.Dynamo("MyTable", {
  fields: {
    pk: "string",
    sk: "string",
  },
  primaryIndex: { hashKey: "pk", rangeKey: "sk" },
});

const api = new sst.aws.ApiGatewayV2("OrganizationsApi", { link: [table] });
api.route(
  "ANY /organization/{proxy+}",
  "modules/organizations/packages/functions/src/organizations/routerHandler.handler"
);
