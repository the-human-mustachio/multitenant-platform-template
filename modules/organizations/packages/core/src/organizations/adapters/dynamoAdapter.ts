import { Table } from "dynamodb-onetable";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import {
  OrganizationSchema,
  UserType,
  MembershipType,
  OrganizationType,
} from "./dynamoSchema";
import { OrganizationDTO } from "../entities/organization";
import { UserDTO } from "../entities/user";

import { Resource } from "sst";
import { MembershipDTO } from "../entities/membership";

// Initialize DynamoDB client and document client
const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);

// Initialize the organization table
const OrganizationTable = new Table({
  client: docClient,
  name: process.env.TABLE_NAME ?? Resource.MyTable.name,
  schema: OrganizationSchema,
});

// Models for each entity
const organizationModel =
  OrganizationTable.getModel<OrganizationType>("Organization");
const userModel = OrganizationTable.getModel<UserType>("User");
const membershipModel =
  OrganizationTable.getModel<MembershipType>("Membership");

// CRUD Functions

export const upsertOrganization = async (
  organization: OrganizationDTO
): Promise<OrganizationDTO> => {
  console.log("Upsert Organization");
  return (await organizationModel.upsert(organization, {
    return: "get",
  })) as OrganizationDTO;
};

export const getOrganization = async (
  organizationId: string
): Promise<OrganizationDTO> => {
  console.log("Get Organization");
  return (await organizationModel.get({
    id: organizationId,
  })) as OrganizationDTO;
};

export const removeOrganization = async (
  organizationId: string
): Promise<OrganizationDTO> => {
  console.log("Remove Organization");
  return (await organizationModel.remove({
    id: organizationId,
  })) as OrganizationDTO;
};

export const upsertUser = async (user: UserDTO): Promise<UserDTO> => {
  console.log("Upsert User");
  return (await userModel.upsert(user, { return: "get" })) as UserDTO;
};

export const getUser = async (email: string): Promise<UserDTO> => {
  console.log("Get User");
  return (await userModel.get({ email })) as UserDTO;
};

export const removeUser = async (userId: string): Promise<UserDTO> => {
  console.log("Remove User");
  return (await userModel.remove({ id: userId })) as UserDTO;
};

export const upsertMembership = async (
  membership: MembershipDTO
): Promise<MembershipDTO> => {
  console.log("Upsert Membership");
  return (await membershipModel.upsert(membership, {
    return: "get",
  })) as MembershipDTO;
};

export const getMembership = async (
  email: string,
  organizationId: string
): Promise<MembershipDTO> => {
  console.log("Get Membership");
  return (await membershipModel.get({
    email,
    organizationId,
  })) as MembershipDTO;
};

export const removeMembership = async (
  userEmail: string,
  organizationId: string
): Promise<MembershipDTO> => {
  console.log("Remove Membership");
  return (await membershipModel.remove({
    email: userEmail,
    organizationId,
  })) as MembershipDTO;
};

// Transaction Function to Create User with Default Organization

export const createUserWithDefaultOrganization = async (props: {
  organization: OrganizationDTO;
  user: UserDTO;
  membership: MembershipDTO;
}) => {
  console.log("Create User with Default Organization");

  const transaction = {};

  const organization = (await organizationModel.upsert(props.organization, {
    return: "get",
    transaction,
  })) as OrganizationDTO;

  const user = (await userModel.upsert(props.user, {
    return: "get",
    transaction,
  })) as UserDTO;

  const membership = (await membershipModel.upsert(
    { ...props.membership, organizationId: organization.id as string },
    { return: "get", transaction }
  )) as MembershipDTO;

  // Execute transaction and return results
  const items = await OrganizationTable.transact("write", transaction, {
    return: "get",
    parse: true,
  });

  return { organization, user, membership };
};
