"use server";

import { db } from "@/lib/prisma";
import { subDays } from "date-fns";

const USER_ID = "33c6da31-f50a-49be-ac2c-94d8a390dca0";
const ACCOUNT_ID = "25529c13-6b22-4d56-b4e8-86e126a2e1df";

const CATEGORIES = {
  INCOME: [
    { name: "salary", range: [5000, 10000] },
    { name: "freelance", range: [2000, 5000] },
    { name: "investments", range: [1000, 5000] },
    { name: "business", range: [1500, 6000] },
    { name: "rental", range: [2000, 7000] },
    { name: "other-income", range: [500, 3000] },
  ],
  EXPENSE: [
    { name: "housing", range: [3000, 8000] },
    { name: "transportation", range: [500, 2000] },
    { name: "groceries", range: [400, 1500] },
    { name: "utilities", range: [200, 1000] },
    { name: "entertainment", range: [100, 700] },
    { name: "food", range: [150, 800] },
    { name: "shopping", range: [300, 2000] },
    { name: "healthcare", range: [500, 3000] },
    { name: "education", range: [1000, 5000] },
    { name: "travel", range: [1000, 5000] },
    { name: "personal", range: [300, 1500] },
    { name: "insurance", range: [500, 4000] },
    { name: "gifts", range: [200, 2000] },
    { name: "bills", range: [500, 2500] },
    { name: "pets", range: [300, 1500] },
    { name: "other-expense", range: [200, 2500] },
    { name: "investments-expense", range: [500, 3000] },
    { name: "family", range: [500, 2500] },
    { name: "loans", range: [1000, 5000] },
    { name: "subscriptions", range: [100, 1000] },
  ],
};
function getRandomAmount(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomCategory(type) {
  const categories = CATEGORIES[type];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const amount = getRandomAmount(category.range[0], category.range[1]);
  return { category: category.name, amount };
}

export async function seedTransactions() {
  try {
    const transactions = [];
    let totalBalance = 0;

    for (let i = 90; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const transactionsPerDay = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < transactionsPerDay; j++) {
        const type = Math.random() < 0.4 ? "INCOME" : "EXPENSE";
        const { category, amount } = getRandomCategory(type);

        const transaction = {
          id: crypto.randomUUID(),
          type,
          amount,
          description: `${
            type === "INCOME" ? "Received" : "Paid for"
          } ${category}`,
          date,
          category,
          status: "COMPLETED",
          userId: USER_ID,
          accountId: ACCOUNT_ID,
          createdAt: date,
          updatedAt: date,
        };

        totalBalance += type === "INCOME" ? amount : -amount;
        transactions.push(transaction);
      }
    }
    await db.$transaction(async (tx) => {
      await tx.transaction.deleteMany({
        where: { accountId: ACCOUNT_ID },
      });
      await tx.transaction.createMany({
        data: transactions,
      });
      await tx.account.update({
        where: { id: ACCOUNT_ID },
        data: { balance: totalBalance },
      });
    });

    return {
      success: true,
      message: `Created ${transactions.length} transactions`,
    };
  } catch (error) {
    console.error("Error seeding transactions:", error);
    return { success: false, error: error.message };
  }
}
