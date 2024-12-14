import { authorizer } from "@openauthjs/openauth";
import { handle } from "hono/aws-lambda";
import { DynamoStorage } from "@openauthjs/openauth/storage/dynamo";
import { subjects } from "./subject";
import { Resource } from "sst";
import { PasswordAdapter } from "@openauthjs/openauth/adapter/password";
import { PasswordUI } from "@openauthjs/openauth/ui/password";
import { GoogleOidcAdapter } from "@openauthjs/openauth/adapter/google";
import { CodeAdapter } from "@openauthjs/openauth/adapter/code";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import { OidcAdapter } from "@openauthjs/openauth/adapter/oidc";
import { CognitoAdapter } from "@openauthjs/openauth/adapter/cognito";

const THEME_SPARKCX = {
  title: "SparkCX Platform Login",
  logo: {
    dark: "https://sparkcx.co/hubfs/Platform%20Primary%20SparkCX%20Logo_x100.svg",
    light:
      "https://sparkcx.co/hubfs/Platform%20Primary%20SparkCX%20Logo_x100.svg",
  },
  background: {
    dark: "#171717",
    light: "#f8f8f8",
  },
  primary: {
    dark: "#006239",
    light: "#72e3ad",
  },
  font: {
    family: "Varela Round, sans-serif",
  },
  css: `
      @import url('https://fonts.googleapis.com/css2?family=Varela Round:wght@100;200;300;400;500;600;700;800;900&display=swap');
    `,
};

const app = authorizer({
  theme: THEME_SPARKCX,
  subjects,
  providers: {
    google: GoogleOidcAdapter({
      clientID: Resource.GoogleClientID.value,
      //   clientSecret: "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",
      scopes: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
    }),
    cognito: CognitoAdapter({
      type: "PulseCX",
      domain: "us-west-27nusjrpxq",
      region: "us-west-2",
      clientID: "2aknfk4e1n75jucjga00bkt19b",
      scopes: ["email", "phone"],
      clientSecret: "",
    }),
  },
  allow: async (input) => {
    console.log(input);
    return true;
  },
  success: async (ctx, value) => {
    let email: string;
    let userId: string;
    if (value.provider === "google") {
      console.log(value);
      console.log(JSON.stringify(ctx));
      email = value.id.email as string;
      userId = value.id.email as string;
    }
    return ctx.subject("user", {
      email: value.id.email,
      userId: value.id.email,
      organizationId: "123",
    });
    throw new Error("Invalid provider");
  },
});

// @ts-ignore
export const handler = handle(app);
