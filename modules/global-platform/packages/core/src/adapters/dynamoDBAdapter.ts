import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Table, Entity } from "dynamodb-onetable";
import { Resource } from "sst";
import { MembershipEntityDTO } from "../domain/membership/membershipTypes";
import { OrganizationEntityDTO } from "../domain/organization/organizationTypes";
import { UserEntityDTO } from "../domain/user/userTypes";

export const schema = {
  format: "onetable:1.1.0",
  version: "0.0.1",
  indexes: {
    primary: { hash: "pk", sort: "sk" },
    gsi1: { hash: "gsi1pk", sort: "gsi1sk", follow: true },
    adminGSI1: { hash: "adminGSI1pk", sort: "adminGSI1sk", follow: true },
  },
  models: {
    Organization: {
      pk: { type: String, value: "${id}#organization" },
      sk: { type: String, value: "organization#${id}" },
      id: {
        type: String,
        // generate: "ulid",
        validate: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i,
      },
      name: { type: String, required: true },
      status: { type: String, default: "active", enum: ["active", "inactive"] },
      adminGSI1pk: { type: String, value: "${_type}" },
      adminGSI1sk: { type: String, value: "${sk}" },
    },
    User: {
      pk: { type: String, value: "${id}#user" },
      sk: { type: String, value: "user#${id}" },
      id: {
        type: String,
        // generate: "ulid",
        validate: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
      },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: {
        type: String,
        required: true,
        unique: true,
        validate: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
      },
      status: { type: String, default: "active", enum: ["active", "inactive"] },
      defaultOrg: { type: String, required: true },
      adminGSI1pk: { type: String, value: "${_type}" },
      adminGSI1sk: { type: String, value: "${sk}" },
    },
    Membership: {
      pk: { type: String, value: "shared#${email}#membership" },
      sk: { type: String, value: "membership#${organizationId}" },
      email: { type: String, required: true },
      organizationId: { type: String, required: true },
      status: {
        type: String,
        default: "invited",
        enum: ["active", "inactive", "invited"],
        required: true,
      },
      role: { type: String, default: "user", required: true },
      adminGSI1pk: { type: String, value: "${_type}" },
      adminGSI1sk: { type: String, value: "${sk}" },
    },
  },
  params: {
    isoDates: true,
    separator: "#",
    timestamps: true,
  },
};

export type OrganizationType = Entity<typeof schema.models.Organization>;
export type UserType = Entity<typeof schema.models.User>;
export type MembershipType = Entity<typeof schema.models.Membership>;

// Initialize DynamoDB client and OneTable Table
const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);
const table = new Table({
  name: process.env.TABLE_NAME ?? Resource.GlobalPlatformTable.name,
  client: docClient,
  schema,
});

// Define the User model using OneTable
// Models for each entity
const OrganizationModel = table.getModel<OrganizationType>("Organization");
const UserModel = table.getModel<UserType>("User");
const MembershipModel = table.getModel<MembershipType>("Membership");
export namespace DynamoDBAdapter {
  // Exported function to save a user
  export const upsertUser = () => {
    return async (user: UserEntityDTO): Promise<UserEntityDTO> => {
      try {
        console.log("User upsert successfully in DynamoDB with OneTable.");
        console.log(user);
        return (await UserModel.upsert(
          {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            status: user.status,
            defaultOrg: user.defaultOrg,
          },
          { return: "get" }
        )) as UserEntityDTO;
      } catch (error) {
        console.error("Error upsert user in DynamoDB with OneTable:", error);
        console.error(JSON.stringify(error, null, 4));
        throw error;
      }
    };
  };

  export const getUserByEmail = () => {
    return async (userEmail: string): Promise<UserEntityDTO> => {
      try {
        console.log("User get successfully in DynamoDB with OneTable.");
        return (await UserModel.get({ id: userEmail })) as UserEntityDTO;
      } catch (error) {
        console.error("Error getting user in DynamoDB with OneTable:", error);
        throw error;
      }
    };
  };

  export const listUsers = () => {
    return async (): Promise<UserEntityDTO[]> => {
      try {
        console.log("User get successfully in DynamoDB with OneTable.");
        const r = await UserModel.scan({});
        return r as UserEntityDTO[];
      } catch (error) {
        console.error("Error getting user in DynamoDB with OneTable:", error);
        throw error;
      }
    };
  };

  export const upsertOrganization = () => {
    return async (
      org: OrganizationEntityDTO
    ): Promise<OrganizationEntityDTO> => {
      try {
        console.log("Org upsert successfully in DynamoDB with OneTable.");
        return (await OrganizationModel.upsert(org)) as OrganizationEntityDTO;
      } catch (error) {
        console.error("Error getting org in DynamoDB with OneTable:", error);
        throw error;
      }
    };
  };

  export const getOrganizationById = () => {
    return async (orgId: string): Promise<OrganizationEntityDTO> => {
      try {
        console.log("Org get successfully in DynamoDB with OneTable.");
        return (await OrganizationModel.get({
          id: orgId,
        })) as OrganizationEntityDTO;
      } catch (error) {
        console.error("Error getting org in DynamoDB with OneTable:", error);
        throw error;
      }
    };
  };

  export const upsertMembership = () => {
    return async (
      membership: MembershipEntityDTO
    ): Promise<MembershipEntityDTO> => {
      try {
        console.log(
          "Membership upsert successfully in DynamoDB with OneTable."
        );
        return (await MembershipModel.upsert(
          membership
        )) as MembershipEntityDTO;
      } catch (error) {
        console.error(
          "Error upsert membership in DynamoDB with OneTable:",
          error
        );
        throw error;
      }
    };
  };

  export const getMembershipByEmailAndOrgId = () => {
    return async (
      email: string,
      orgId: string
    ): Promise<MembershipEntityDTO> => {
      try {
        console.log("Membership get successfully in DynamoDB with OneTable.");
        return (await MembershipModel.get({
          email: email,
          organizationId: orgId,
        })) as MembershipEntityDTO;
      } catch (error) {
        console.error(
          "Error getting membership in DynamoDB with OneTable:",
          error
        );
        throw error;
      }
    };
  };
}

(async () => {
  try {
    const r = DynamoDBAdapter.getUserByEmail();
    console.log(await r("matt@sparkcx.co"));
    console.log("done");
  } catch (e) {
    // Deal with the fact the chain failed
  }
  // `text` is not available here
})();
