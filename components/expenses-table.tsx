import { columns } from "./ui/columns";
import { DataTable } from "./ui/data-table";
import { Expense } from "@/types/expense";
import prisma from "@/lib/prisma";

export default async function ExpensesTable() {
  const data = (await prisma.expense.findMany()) as Expense[];

  return (
    <section>
      <DataTable columns={columns} data={data} />
    </section>
  );
}
