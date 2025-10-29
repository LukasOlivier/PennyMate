import { Expense } from "@/types/expense";

export type ExpensesStore = {
  expenses: Expense[];
  currentExpense: Expense | null;
  deleteRows: (rowIndexes: number[]) => Promise<void>;
  addRow: () => void;
  editRow: (rowIndex: number) => void;
};
