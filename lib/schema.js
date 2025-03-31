// schema.js
import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["CURRENT", "SAVINGS"]),
  balance: z.string().min(1, "Initial balance is required"),
  isDefault: z.boolean().default(false),
});

export const transactionSchema = z
  .object({
    type: z.enum(["INCOME", "EXPENSE"], {
      required_error: "Transaction type is required",
    }),
    amount: z
      .string()
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be a positive number",
      }),
    description: z.string().min(1, "Description is required"),
    date: z.date({ required_error: "Date is required" }),
    accountId: z.string().min(1, "Account is required"),
    category: z.string().min(1, "Category is required"),
    status: z
      .enum(["PENDING", "COMPLETED", "FAILED", "FLAGGED"])
      .default("COMPLETED"),
    isRecurring: z.boolean().default(false),
    nextRecurringDate: z.date().nullable().optional(),
    recurringInterval: z
      .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isRecurring) {
      if (!data.recurringInterval) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Recurring interval is required for recurring transactions",
          path: ["recurringInterval"],
        });
      }
      if (!data.nextRecurringDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Next recurring date is required for recurring transactions",
          path: ["nextRecurringDate"],
        });
      }
    }
  });
