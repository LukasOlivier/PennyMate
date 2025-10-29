import { columns } from "./ui/columns";
import { DataTable } from "./ui/data-table";
import { Expense } from "@/types/expense";
import prisma from "@/lib/prisma";

export default async function ExpensesTable() {
  const expenses = (await prisma.expense.findMany({
    orderBy: { createdAt: "desc" },
  })) as Expense[];

  return <section>{<DataTable columns={columns} data={expenses} />}</section>;
}
