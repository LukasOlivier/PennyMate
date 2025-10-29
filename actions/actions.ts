"use server";

import prisma from "@/lib/prisma";
import { Expense } from "@/types/expense";
import { revalidatePath } from "next/cache";

export async function deleteExpenseIds(expenseIds: string[]) {
  await prisma.expense.deleteMany({
    where: {
      id: {
        in: expenseIds,
      },
    },
  });

  revalidatePath("/expenses");
}

export async function addExpense(expense: Expense) {
  await prisma.expense.create({
    data: expense,
  });

  revalidatePath("/expenses");
}

export async function updateExpense(expense: Expense) {
  if (!expense.id) {
    throw new Error("Expense ID is required");
  }

  await prisma.expense.update({
    where: { id: expense.id },
    data: expense,
  });

  revalidatePath("/expenses");
}
