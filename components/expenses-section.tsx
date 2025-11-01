"use client";

import { getColumns } from "./ui/columns";
import { DataTable } from "./ui/data-table";
import { SerializedExpense } from "@/types/expense";
import ExpensesForm from "./form-component";
import { deleteExpenseIds, getExpenses } from "@/actions/actions";
import { useState } from "react";
import FilterComponent from "./filter-component";
import { ExpenseFilters, IncomeFilters } from "@/types/filters";

interface ExpensesSectionProps {
  initialExpenses: SerializedExpense[];
}

const ExpensesSection = ({ initialExpenses }: ExpensesSectionProps) => {
  const [editingExpense, setEditingExpense] =
    useState<SerializedExpense | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expenses, setExpenses] =
    useState<SerializedExpense[]>(initialExpenses);
  const [currentFilters, setCurrentFilters] = useState<
    ExpenseFilters | IncomeFilters
  >({
    startDate: null,
    endDate: null,
    isPaidOnBehalf: null,
  });

  const onDeleteRows = async (index: number[]) => {
    const ids = index.map((i) => (expenses as SerializedExpense[])[i].id);
    await deleteExpenseIds(ids as string[]);
    const data = await getExpenses(currentFilters as ExpenseFilters);
    setExpenses(data);
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

  const handleFormClose = async () => {
    setIsFormOpen(false);
    const data = await getExpenses(currentFilters as ExpenseFilters);
    setExpenses(data);
  };

  const fetchFilteredExpenses = async (
    filters: ExpenseFilters | IncomeFilters
  ) => {
    setCurrentFilters(filters);
    const expenseFilters = filters as ExpenseFilters;
    const data = await getExpenses(expenseFilters);
    setExpenses(data);
  };

  const defaultFilters: ExpenseFilters = {
    startDate: null,
    endDate: null,
    isPaidOnBehalf: null,
  };

  return (
    <>
      <FilterComponent
        defaultFilters={defaultFilters}
        onFilterChanged={fetchFilteredExpenses}
      ></FilterComponent>
      <DataTable
        columns={getColumns("expense")}
        data={expenses}
        onAddRow={onAddRow}
        onDeleteRows={onDeleteRows}
        onEditRow={handleEditRow}
      />
      {isFormOpen && (
        <ExpensesForm data={editingExpense} onClose={handleFormClose} />
      )}
    </>
  );
};

export default ExpensesSection;
