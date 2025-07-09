import z from "zod";

export const transactionSchema = z.object({
  toAccountNumber: z.string().min(10, "Account must be 10 digits"),
  ifsc: z.string().min(10, "IFSC must be 10 characters"),
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name required"),
  amount: z.number().positive(),
  description: z.string().optional(),
});
