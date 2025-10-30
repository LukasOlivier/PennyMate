"use server";

import prisma from "@/lib/prisma";
import { SerializedExpense } from "@/types/expense";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { SerializedIncome } from "@/types/income";

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

export async function addIncome(income: Prisma.IncomeCreateInput) {
  await prisma.income.create({
    data: {
      ...income,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/incomes");
}

export async function updateIncome(
  income: Prisma.IncomeCreateInput,
  id: string
) {
  if (!id) {
    throw new Error("Income ID is required");
  }

  await prisma.income.update({
    where: { id },
    data: income,
  });

  revalidatePath("/incomes");
}

export async function deleteIncomeIds(incomeIds: string[]) {
  await prisma.income.deleteMany({
    where: {
      id: {
        in: incomeIds,
      },
    },
  });

  revalidatePath("/incomes");
}
