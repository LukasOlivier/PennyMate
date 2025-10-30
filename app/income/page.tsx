import IncomeSection from "@/components/income-section";
import { SerializedIncome } from "@/types/income";
import prisma from "@/lib/prisma";

const IncomesPage = async () => {
  const incomes = await prisma.income.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Serialize dates for client
  const serializedIncomes = incomes.map((income) => ({
    ...income,
    createdAt: income.createdAt.toISOString(),
    updatedAt: income.updatedAt?.toISOString(),
  })) as SerializedIncome[];

  return (
    <main>
      <h1 className="text-3xl mb-2 font-bold">Income</h1>
      <hr className="mb-4" />

      <div>
        Your total income is: $
        {serializedIncomes
          .reduce((total, income) => total + income.amount, 0)
          .toFixed(2)}
      </div>
      <IncomeSection income={serializedIncomes} />
    </main>
  );
};
export default IncomesPage;
