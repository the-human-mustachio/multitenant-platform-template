// organizationSchema.ts
import { z } from "zod";
import { OrganizationStatus } from "./organizationTypes";

export const OrganizationSchema = z.object({
  id: z.string().ulid(),
  name: z.string().min(1, { message: "Name cannot be empty" }),
  status: z.nativeEnum(OrganizationStatus),
  created: z.date(),
  updated: z.date(),
});

export const OrganizationInputSchema = OrganizationSchema.omit({
  id: true,
  created: true,
  updated: true,
});
