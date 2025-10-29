export type Expense = {
  id: string;
  title: string;
  description?: string;
  amount: number;
  paidOnBehalf?: boolean; // TODO: find a better name for 'voorgeschoten'
  paidBackOn?: Date | null;
};
