"use server";

import prisma from "@/lib/prisma";
import { SerializedExpense } from "@/types/expense";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { SerializedIncome } from "@/types/income";
import { ExpenseFilters, IncomeFilters } from "@/types/filters";

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

export async function getExpenses(
  filters: ExpenseFilters = {
    startDate: null,
    endDate: null,
    isPaidOnBehalf: null,
  }
): Promise<SerializedExpense[]> {
  const { startDate, endDate, isPaidOnBehalf } = filters;

  const where: Prisma.ExpenseWhereInput = {};

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) (where.createdAt as any).gte = startDate;
    if (endDate) (where.createdAt as any).lte = endDate;
  }

  if (isPaidOnBehalf !== null && isPaidOnBehalf !== undefined) {
    where.paidOnBehalf = isPaidOnBehalf;
  }

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  return expenses.map((expense) => ({
    ...expense,
    createdAt: expense.createdAt.toISOString(),
    updatedAt: expense.updatedAt?.toISOString(),
  })) as SerializedExpense[];
}

export async function getIncome(
  filters: IncomeFilters = {
    startDate: null,
    endDate: null,
  }
): Promise<SerializedIncome[]> {
  const { startDate, endDate } = filters;
  console.log("filters", filters);
  const where: Prisma.IncomeWhereInput = {};

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) (where.createdAt as any).gte = startDate;
    if (endDate) (where.createdAt as any).lte = endDate;
  }

  const income = await prisma.income.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  return income.map((income) => ({
    ...income,
    createdAt: income.createdAt.toISOString(),
    updatedAt: income.updatedAt?.toISOString(),
  })) as SerializedExpense[];
}
