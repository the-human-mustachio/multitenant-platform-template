// packages/functions/src/session.ts
import { createSessionBuilder } from "sst/auth";

export interface UserSession {
  email: string;
  firstName: string;
  lastName: string;
}

export const session = createSessionBuilder<{ user: UserSession }>();
