import { SerializedExpense } from "@/types/expense";

export type ExpensesStore = {
  expenses: SerializedExpense[];
  currentExpense: SerializedExpense | null;
  deleteRows: (rowIndexes: number[]) => Promise<void>;
  addRow: () => void;
  editRow: (rowIndex: number) => void;
};
