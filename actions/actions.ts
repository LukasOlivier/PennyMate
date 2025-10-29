"use server";

import prisma from "@/lib/prisma";
import { Expense, NewExpense } from "@/types/expense";
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

export async function addExpense(expense: NewExpense) {
  await prisma.expense.create({
    data: {
      ...expense,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/expenses");
}

export async function updateExpense(expense: NewExpense, id: string) {
  if (!id) {
    throw new Error("Expense ID is required");
  }

  await prisma.expense.update({
    where: { id },
    data: expense,
  });

  revalidatePath("/expenses");
}
