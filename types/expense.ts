export type Expense = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  paidOnBehalf: boolean;
  paidBackOn: Date | null; // Date becomes string after serialization
  createdAt: Date; // Date becomes string after serialization
  updatedAt: Date; // Date becomes string after serialization
};

export type NewExpense = Omit<Expense, "id" | "createdAt" | "updatedAt">;
