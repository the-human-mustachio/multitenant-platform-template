import { createSubjects } from "@openauthjs/openauth";
import { z } from "zod";

export const subjects = createSubjects({
  user: z.object({
    email: z.string(),
    organizationId: z.string(),
    userId: z.string(),
  }),
});
