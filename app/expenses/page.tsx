"use server";

import ExpensesSection from "@/components/expenses-section";
import { SerializedExpense } from "@/types/expense";
import prisma from "@/lib/prisma";

const ExpensesPage = async () => {
  const expenses = await prisma.expense.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Serialize dates for client
  const serializedExpenses = expenses.map((expense) => ({
    ...expense,
    createdAt: expense.createdAt.toISOString(),
    updatedAt: expense.updatedAt?.toISOString(),
  })) as SerializedExpense[];

  return (
    <main>
      <h1 className="text-3xl mb-2 font-bold">Expenses</h1>
      <hr className="mb-4" />

      <ExpensesSection initialExpenses={serializedExpenses} />
    </main>
  );
};
export default ExpensesPage;
