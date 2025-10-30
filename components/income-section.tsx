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

  const onDeleteRows = (index: number[]) => {
    const ids = index
      .map((i) => income[i]?.id)
      .filter((id): id is string => !!id);
    if (ids.length > 0) {
      deleteIncomeIds(ids);
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

  async function fetchFilteredExpenses(
    filters: ExpenseFilters | IncomeFilters
  ) {
    const incomeFilters = filters as IncomeFilters;
    const data = await getIncome(incomeFilters);
    setIncome(data ?? []);
  }

  const defaultFilters: IncomeFilters = {
    startDate: null,
    endDate: null,
  };

  return (
    <>
      <FilterComponent
        defaultFilters={defaultFilters}
        onFilterChanged={fetchFilteredExpenses}
      ></FilterComponent>
      <DataTable
        columns={getColumns("income")}
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
