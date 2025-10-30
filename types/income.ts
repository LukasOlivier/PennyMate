export type SerializedIncome = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  paidOnBehalf: boolean;
  paidBackOn: string | null;
  createdAt: string;
  updatedAt: string;
};
