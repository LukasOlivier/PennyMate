"use client";

import { columns } from "./ui/columns";
import { DataTable } from "./ui/data-table";
import { SerializedExpense } from "@/types/expense";
import { deleteIncomeIds } from "@/actions/actions";
import { useState } from "react";
import FormComponent from "./form-component";

interface IncomeSectionProps {
  income: SerializedExpense[];
}

const IncomeSection = ({ income }: IncomeSectionProps) => {
  const [editingExpense, setEditingExpense] =
    useState<SerializedExpense | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const onDeleteRows = (index: number[]) => {
    const ids = index.map((i) => (income as SerializedExpense[])[i].id);
    deleteIncomeIds(ids as string[]);
  };

  const onAddRow = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleEditRow = (index: number) => {
    const expense = (income as SerializedExpense[]).find(
      (exp) => exp.id === (income as SerializedExpense[])[index].id
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
        data={income}
        onAddRow={onAddRow}
        onDeleteRows={onDeleteRows}
        onEditRow={handleEditRow}
      />
      {isFormOpen && (
        <FormComponent
          data={editingExpense}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
};

export default IncomeSection;
