"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const serializeAmount = (obj) => ({
  ...obj,
  amount: obj.amount.toNumber(),
});
export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    console.log("User ID:", userId);
    if (!userId) throw new Error("Unauthorized");

    const req = await request();
    const dec = await aj.protect(req, {
      userId,
      requested: 1,
    });

    if (dec.isDenied()) {
      console.error("Request blocked:", dec.reason);
      if (dec.reason.isRateLimit()) {
        const { remaining, reset } = dec.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });

        throw new Error("Too many req");
      }
      throw new Error("Req blocked");
    }
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
    const newBalance = account.balance.toNumber() + balanceChange;

    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          type: data.type,
          amount: data.amount,
          description: data.description,
          date: data.date,
          accountId: data.accountId,
          category: data.category,
          status: data.status || "COMPLETED",
          isRecurring: data.isRecurring,
          recurringInterval: data.isRecurring ? data.recurringInterval : null,
          nextRecurringDate: data.isRecurring
            ? calculateNextRecurring(data.date, data.recurringInterval)
            : null,
          userId: user.id,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },

        data: { balance: newBalance },
      });

      return newTransaction;
    });
    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

function calculateNextRecurring(startDate, interval) {
  const date = new Date(startDate);
  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date;
}

export async function scanReceipt(file) {
  try {
    const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const prompt = `
    Analyze the following receipt image and extract the following information. 
    If a specific piece of information is not clearly present, indicate it as null or omit the field.

    Specifically, extract:

    1.  **amount:** The total transaction amount as displayed on the receipt (numerical value, e.g., 12.50).
    2.  **date:** The date of the transaction (YYYY-MM-DD, e.g., 2025-03-30).
    3.  **merchant:** The name of the store or business.
    4.  **category:** Assign a category to the transaction based on its nature. 
                      Match with the following predefined categories:
                      Income Categories: Salary, Freelance, Investments, Business, Rental Income, Other Income.
                      Expense Categories: Housing, Transportation, Groceries, Utilities, Entertainment, Food & Dining, Shopping, Healthcare, Education, Personal Care, Travel, Insurance, Gifts & Donations, Bills & Fees, Subscriptions, Loans, Pets, Family & Kids, Investment Expenses, Other Expenses.
                      If an exact match isn't found, check if it belongs to a subcategory (e.g., "Netflix" → "Subscriptions").
                      If no match is found, assign "Other Expenses"
    5.  **items:** An array of objects, where each object represents a purchased item and includes:
        -   **name:** The name of the item.
        -   **price:** The price of the item (numerical value).
    6.  **taxes:** The total amount of taxes paid, if listed separately (numerical value, or null if not applicable).
    7.  **paymentMethod:** The method of payment used (e.g., "Visa", "Mastercard", "Cash", "Debit Card", or null if not clearly detectable).

    The receipt image data is provided below:

    <image data="${base64}" mimeType="${file.type}" />

    Present the extracted information in a JSON format like this:

    \`\`\`json
    {
      "amount": null,
      "date": null,
      "merchant": null,
      "category": null,
      "items": [],
      "taxes": null,
      "paymentMethod": null
    }
    \`\`\`
    `;
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();

    const cleanText = text.replace(/```(?:json)?\n?/g, "").trim();
    try {
      const data = JSON.parse(cleanText);
      return {
        amount: data.amount ? parseFloat(data.amount) : null,
        date: data.date ? new Date(data.date) : null,
        description:
          data.items?.map((item) => item.name).join(", ") || "No description",
        category: data.category || "Uncategorized",
        merchant: data.merchant || "Unknown",
        receiptUrl: null,
        isRecurring: false,
        taxes: data.taxes ? parseFloat(data.taxes) : null,
        paymentMethod: data.paymentMethod || null,
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Transaction creation error:", error);
    throw new Error(error.message);
  }
}
