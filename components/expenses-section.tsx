"use client";

import { columns } from "./ui/columns";
import { DataTable } from "./ui/data-table";
import { SerializedExpense } from "@/types/expense";
import ExpensesForm from "./form-component";
import { deleteExpenseIds, getExpenses } from "@/actions/actions";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Check, Minus, X } from "lucide-react";

interface ExpensesSectionProps {
  initialExpenses: SerializedExpense[];
}

const ExpensesSection = ({ initialExpenses }: ExpensesSectionProps) => {
  const [editingExpense, setEditingExpense] =
    useState<SerializedExpense | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [isPaidOnBehalfFilter, setIsPaidOnBehalfFilter] = useState<
    boolean | null
  >(null);
  const [expenses, setExpenses] =
    useState<SerializedExpense[]>(initialExpenses);

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

  const switchPaidOnBehalfState = () => {
    if (isPaidOnBehalfFilter === null) {
      setIsPaidOnBehalfFilter(true);
    } else if (isPaidOnBehalfFilter === true) {
      setIsPaidOnBehalfFilter(false);
    } else {
      setIsPaidOnBehalfFilter(null);
    }
  };

  useEffect(() => {
    if (!filter) return;

    async function fetchFilteredExpenses(
      startDate: Date | null,
      endDate: Date | null,
      isPaidOnBehalf: boolean | null
    ) {
      const data = await getExpenses({ startDate, endDate, isPaidOnBehalf });
      setExpenses(data);
    }

    switch (filter) {
      case "month":
        fetchFilteredExpenses(
          new Date(new Date().setDate(1)),
          new Date(new Date().setMonth(new Date().getMonth() + 1)),
          isPaidOnBehalfFilter
        );
        break;
      case "year":
        fetchFilteredExpenses(
          new Date(new Date().getFullYear(), 0, 1),
          new Date(new Date().getFullYear() + 1, 0, 1),
          isPaidOnBehalfFilter
        );
        break;
      default:
        // Fetch all expenses
        fetchFilteredExpenses(null, null, isPaidOnBehalfFilter);
    }
  }, [filter, isPaidOnBehalfFilter]);

  return (
    <>
      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <ul className="flex gap-2">
          {/* Time Filter */}
          <li>
            <Button
              className={`hover:text-black ${
                filter === "all" || filter === null
                  ? "bg-zinc-100 text-black"
                  : "bg-surface"
              }`}
              onClick={() => setFilter("all")}
            >
              All Time
            </Button>
          </li>
          <li>
            <Button
              className={`hover:text-black ${
                filter === "month" ? "bg-zinc-100 text-black" : "bg-surface"
              }`}
              onClick={() => setFilter("month")}
            >
              This Month
            </Button>
          </li>
          <li>
            <Button
              className={`hover:text-black ${
                filter === "year" ? "bg-zinc-100 text-black" : "bg-surface"
              }`}
              onClick={() => setFilter("year")}
            >
              This Year
            </Button>
          </li>
        </ul>
        <div className="border  border-surface-alt"></div>
        <Button
          className={`hover:text-black ${
            isPaidOnBehalfFilter === null
              ? "bg-surface"
              : "bg-zinc-100 text-black"
          }`}
          onClick={() => switchPaidOnBehalfState()}
        >
          Is Paid On Behalf
          {isPaidOnBehalfFilter === null ? (
            <Minus className="ml-2" />
          ) : isPaidOnBehalfFilter ? (
            <Check className="ml-2" />
          ) : (
            <X className="ml-2" />
          )}
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={expenses}
        onAddRow={onAddRow}
        onDeleteRows={onDeleteRows}
        onEditRow={handleEditRow}
      />
      {isFormOpen && (
        <ExpensesForm
          data={editingExpense}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
};

export default ExpensesSection;
