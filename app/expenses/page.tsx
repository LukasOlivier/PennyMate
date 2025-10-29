import ExpensesTable from "@/components/ExpensesTable";

export default async function ExpensesPage() {
  return (
    <main>
      <h1 className="text-3xl mb-2 font-bold">Expenses</h1>
      <hr className="mb-4" />

      <ExpensesTable />
    </main>
  );
}
