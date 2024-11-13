import { Entity } from "dynamodb-onetable";
export const OrganizationSchema = {
  format: "onetable:1.1.0",
  version: "0.0.1",
  indexes: {
    primary: { hash: "pk", sort: "sk" },
  },
  models: {
    Organization: {
      pk: { type: String, value: "${id}" },
      sk: { type: String, value: "organization#" },
      id: {
        type: String,
        generate: "ulid",
        validate: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i,
      },
      name: { type: String, required: true },
      status: { type: String, default: "active", enum: ["active", "inactive"] },
    },
    User: {
      pk: { type: String, value: "${email}" },
      sk: { type: String, value: "user#" },
      id: {
        type: String,
        generate: "ulid",
        validate: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i,
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
    },
    Membership: {
      pk: { type: String, value: "${email}" },
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
    },
    // User: {
    //     pk:          { type: String, value: 'account#${accountName}' },
    //     sk:          { type: String, value: 'user#${email}',
    //                    validate: EmailRegExp },
    //     id:          { type: String, required: true },
    //     accountName: { type: String, required: true, encode: 'pk' },
    //     email:       { type: String, required: true, encode: 'sk' },
    //     firstName:   { type: String, required: true },
    //     lastName:    { type: String, required: true },
    //     username:    { type: String, required: true },
    //     role:        { type: String, enum: ['user', 'admin'], required: true,
    //                    default: 'user' },
    //     balance:     { type: Number, default: 0 },

    //     gs1pk:       { type: String, value: 'user-email#${email}' },
    //     gs1sk:       { type: String, value: 'user#' },
    // }
  },
  params: {
    isoDates: true,
    separator: "#",
    timestamps: true,
  },
};

export type OrganizationType = Entity<
  typeof OrganizationSchema.models.Organization
>;
export type UserType = Entity<typeof OrganizationSchema.models.User>;
export type MembershipType = Entity<
  typeof OrganizationSchema.models.Membership
>;
