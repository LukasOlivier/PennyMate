"use server";

import { columns } from "./ui/columns";
import { DataTable } from "./ui/data-table";
import { Expense } from "@/types/expense";
import prisma from "@/lib/prisma";

const ExpensesTable = async () => {
  const expenses = (await prisma.expense.findMany({
    orderBy: { createdAt: "desc" },
  })) as Expense[];

  return <DataTable columns={columns} data={expenses} />;
};

export default ExpensesTable;
