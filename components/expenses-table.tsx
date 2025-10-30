"use server";

import { columns } from "./ui/columns";
import { DataTable } from "./ui/data-table";
import { SerializedExpense } from "@/types/expense";
import prisma from "@/lib/prisma";

const ExpensesTable = async () => {
  const expenses = await prisma.expense.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Serialize dates for client
  const serializedExpenses = expenses.map((expense) => ({
    ...expense,
    createdAt: expense.createdAt.toISOString(),
    updatedAt: expense.updatedAt?.toISOString(),
  })) as SerializedExpense[];

  return <DataTable columns={columns} data={serializedExpenses} />;
};

export default ExpensesTable;
