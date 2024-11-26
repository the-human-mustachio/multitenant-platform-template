import { z } from "zod";
import { MembershipRole, MembershipStatus } from "./membershipTypes";

export const MembershipSchema = z.object({
  email: z.string().email(),
  organizationId: z.string(),
  status: z.nativeEnum(MembershipStatus),
  role: z.nativeEnum(MembershipRole),
  created: z.date(),
  updated: z.date(),
});

export const MembershipInputSchema = MembershipSchema.omit({
  created: true,
  updated: true,
});
