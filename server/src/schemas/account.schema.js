import z from "zod";

export const accountSchema = z.object({
    accountNumber: z.number().min(10, "Account number must be at least 10 digits"),
    ifsc: z.string(),
    bankName: z.string(),
})