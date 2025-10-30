"use server";

import prisma from "@/lib/prisma";
import { SerializedExpense } from "@/types/expense";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

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

export async function addExpense(expense: Prisma.ExpenseCreateInput) {
  await prisma.expense.create({
    data: {
      ...expense,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/expenses");
}

export async function updateExpense(
  expense: Prisma.ExpenseCreateInput,
  id: string
) {
  if (!id) {
    throw new Error("Expense ID is required");
  }

  await prisma.expense.update({
    where: { id },
    data: expense,
  });

  revalidatePath("/expenses");
}
