export type Expense = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  paidOnBehalf: boolean;
  paidBackOn: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type NewExpense = Omit<Expense, "id" | "createdAt" | "updatedAt">;
