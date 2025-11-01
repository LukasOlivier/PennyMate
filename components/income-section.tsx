"use client";

import { getColumns } from "./ui/columns";
import { DataTable } from "./ui/data-table";
import { deleteIncomeIds, getIncome } from "@/actions/actions";
import { useState } from "react";
import FormComponent from "./form-component";
import { SerializedIncome } from "@/types/income";
import { ExpenseFilters, IncomeFilters } from "@/types/filters";
import FilterComponent from "./filter-component";

interface IncomeSectionProps {
  initialIncome?: SerializedIncome[];
}

const IncomeSection = ({ initialIncome = [] }: IncomeSectionProps) => {
  const [editingExpense, setEditingExpense] = useState<SerializedIncome | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [income, setIncome] = useState<SerializedIncome[]>(initialIncome);
  const [currentFilters, setCurrentFilters] = useState<
    ExpenseFilters | IncomeFilters
  >({
    startDate: null,
    endDate: null,
    isPaidOnBehalf: null,
  });

  const onDeleteRows = async (index: number[]) => {
    const ids = index
      .map((i) => income[i]?.id)
      .filter((id): id is string => !!id);
    if (ids.length > 0) {
      deleteIncomeIds(ids);
      const data = await getIncome(currentFilters as IncomeFilters);
      setIncome(data);
    }
  };

  const onAddRow = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleEditRow = (index: number) => {
    const item = income[index];
    if (item) {
      setEditingExpense(item);
      setIsFormOpen(true);
    }
  };

  const handleFormClose = async () => {
    setIsFormOpen(false);
    const data = await getIncome(currentFilters as IncomeFilters);
    setIncome(data);
  };

  async function fetchFilteredIncome(filters: ExpenseFilters | IncomeFilters) {
    setCurrentFilters(filters);
    const expenseFilters = filters as ExpenseFilters;
    const data = await getIncome(expenseFilters);
    setIncome(data);
  }

  const defaultFilters: IncomeFilters = {
    startDate: null,
    endDate: null,
  };

  return (
    <>
      <FilterComponent
        defaultFilters={defaultFilters}
        onFilterChanged={fetchFilteredIncome}
      ></FilterComponent>
      <DataTable
        columns={getColumns("income")}
        data={income}
        onAddRow={onAddRow}
        onDeleteRows={onDeleteRows}
        onEditRow={handleEditRow}
      />
      {isFormOpen && (
        <FormComponent data={editingExpense} onClose={handleFormClose} />
      )}
    </>
  );
};

export default IncomeSection;
