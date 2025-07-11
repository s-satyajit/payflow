import z from "zod";

export const accountSchema = z.object({
  accountNumber: z.number(),
  ifsc: z.string(),
  bankName: z.string(),
});
