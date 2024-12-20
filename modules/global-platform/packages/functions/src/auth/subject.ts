import { createSubjects } from "@openauthjs/openauth";
import { z } from "zod";

export const subjects = createSubjects({
  user: z.object({
    email: z.string(),
    organizationName: z.string().optional(),
    organizationId: z.string(),
    userId: z.string(),
  }),
});
