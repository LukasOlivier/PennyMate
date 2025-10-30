"use client";

import { columns } from "./ui/columns";
import { DataTable } from "./ui/data-table";
import { SerializedExpense } from "@/types/expense";
import ExpensesForm from "./expenses-form";
import { deleteExpenseIds } from "@/actions/actions";
import { useState } from "react";

interface ExpensesSectionProps {
  expenses: SerializedExpense[];
}

const ExpensesSection = ({ expenses }: ExpensesSectionProps) => {
  const [editingExpense, setEditingExpense] =
    useState<SerializedExpense | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const onDeleteRows = (index: number[]) => {
    const ids = index.map((i) => (expenses as SerializedExpense[])[i].id);
    deleteExpenseIds(ids as string[]);
  };

  const onAddRow = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleEditRow = (index: number) => {
    const expense = (expenses as SerializedExpense[]).find(
      (exp) => exp.id === (expenses as SerializedExpense[])[index].id
    ) as SerializedExpense;
    if (expense) {
      setEditingExpense(expense);
      setIsFormOpen(true);
    }
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={expenses}
        onAddRow={onAddRow}
        onDeleteRows={onDeleteRows}
        onEditRow={handleEditRow}
      />
      {isFormOpen && (
        <ExpensesForm
          expense={editingExpense}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
};

export default ExpensesSection;
