"use client";

import { Expense } from "@/types/expense";

interface ExpensesFormProps {
  expense: Expense | null;
}
export default function ExpensesForm({ expense }: ExpensesFormProps) {
  console.log("Expense to edit:", expense);
  return <div>Expenses Form</div>;
}
