// packages/functions/src/auth.ts
import { Resource } from "sst";
import { auth } from "sst/aws/auth";
import { GoogleAdapter } from "sst/auth/adapter";
import { session } from "./session";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Handler,
} from "aws-lambda";
import { AggregateUseCases } from "@platform-organizations/core/useCases/aggregateUseCases";

type Provider = "google";

export const handler = auth.authorizer({
  session,
  providers: {
    google: GoogleAdapter({
      clientID: Resource.GoogleClientID.value,
      mode: "oidc",
    }),
  },
  callbacks: {
    auth: {
      async allowClient(clientID: string, redirect: string, req: Request) {
        return true;
      },
      async success(ctx, input) {
        if (input.provider === "google") {
          const email = input.tokenset.claims().email;
          const name = input.tokenset.claims().name;
          const firstName = input.tokenset.claims().given_name ?? "Unknown";
          const lastName = input.tokenset.claims().family_name ?? "Unknown";
          if (!email) throw new Error("Email not found in claims");

          // here is where you could find/create user in the database by email
          const existingUser =
            await AggregateUseCases.createNewUserAndOrganization({
              firstName: firstName,
              lastName: lastName,
              userEmail: email,
            });

          return ctx.session({
            type: "user",
            properties: {
              email: existingUser.email,
              firstName: existingUser.firstName,
              lastName: existingUser.lastName,
            },
          });
        }

        throw new Error(`Unknown provider '${input.provider}'`);
      },
    },
  },
});

/**
 * A wrapper proxy for third-party authentication initiated from our frontend
 *
 * Because the new SST v3 Auth does not yet have the concept of "attaching" to an API path like v2 did,
 * we must create our own custom "wrapper" which provides an authorization code flow to our frontend.
 *
 * The authorizer defined above handles the OIDC server flow between our authenticator lambda and Google,
 * and this wrapper uses the ID token from that to create a custom session that our frontend can use.
 *
 * This essentially means that the Google OIDC flow only happens upon logging in, and then we can use
 * our custom JWT token to perform stateless authentication in our API endpoints.
 */
export const wrapper: Handler<
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2
> = async (event) => {
  const path = event.pathParameters?.proxy;
  if (path === undefined || path.length === 0) throw new Error("Missing path");
  const [provider, step] = path.split("/", 2);

  const CLIENT_IDS: Record<Provider, string> = {
    google: Resource.GoogleClientID.value,
  };

  const auth_url = new URL(Resource.AuthAuthenticator.url).origin;
  const api_url = new URL(Resource.GlobalPlatformApi.url).origin;
  const client_id = Resource.GoogleClientID.value; // TODO: dynamically get this per provider
  const redirect_uri = `${api_url}/auth/${provider}/callback`;

  //===========================================================================
  // Step 1. Initiate authorization
  //---------------------------------------------------------------------------
  if (step === "authorize" || step === undefined) {
    const frontend_redirect_uri = event.queryStringParameters?.redirect_uri;
    if (!frontend_redirect_uri) throw new Error("Missing redirect_uri");

    const url = new URL(`${auth_url}/${provider}/authorize`);
    url.searchParams.set("client_id", client_id);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("redirect_uri", redirect_uri);
    url.searchParams.set("state", frontend_redirect_uri);
    console.log(url.href);
    return { statusCode: 302, headers: { location: url.href } };
  }

  //===========================================================================
  // Step 2. Handle success callback from our authenticator
  //         (not to be confused with the callback from the provider)
  //---------------------------------------------------------------------------
  if (step === "callback") {
    // The code here was generated by SST's success handler,
    // not to be confused with the code from the provider's OAuth/OIDC flow
    const { code, state: frontend_redirect_uri } =
      event.queryStringParameters ?? {};
    if (code === undefined || code.length === 0)
      throw new Error("Missing code");
    if (!frontend_redirect_uri)
      throw new Error("Missing frontend redirect_uri");

    // use the code to get a JWT for our custom session definition
    const body = new FormData();
    body.append("grant_type", "authorization_code");
    body.append("client_id", client_id);
    body.append("code", code);
    body.append("redirect_uri", redirect_uri);
    const response = await fetch(`${auth_url}/token`, { method: "POST", body });

    if (response.ok) {
      const { access_token: token } = (await response.json()) as {
        access_token: string;
      };
      const url = new URL(frontend_redirect_uri);
      url.searchParams.set("token", token);
      return { statusCode: 302, headers: { location: url.href } };
    }
  }

  throw new Error(`Unsupported step: ${step}`);
};