"use server";

import ExpensesTable from "@/components/expenses-table";

const ExpensesPage = () => {
  return (
    <main>
      <h1 className="text-3xl mb-2 font-bold">Expenses</h1>
      <hr className="mb-4" />

      <ExpensesTable />
    </main>
  );
};
export default ExpensesPage;
