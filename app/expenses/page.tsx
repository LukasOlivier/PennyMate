import { Table } from "@/components/ui/table";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Expense } from "@/types/expense";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function getData(): Promise<Expense[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      title: "Office Supplies",
      description: "Purchased office supplies",
      amount: 150.75,
      paidOnBehalf: true,
      paidBackOn: new Date("2024-05-15"),
    },
    {
      id: "2",
      title: "Travel Expenses",
      description: "Business trip to NYC",
      amount: 1200.0,
      paidOnBehalf: false,
      paidBackOn: null,
    },
    // ...
  ];
}

export default async function ExpensesPage() {
  const data = await getData(); // TODO: replace with real data fetching with 'fetch'

  return (
    <main>
      <h1 className="text-2xl font-bold">Expenses</h1>
      <hr className="mb-4" />

      <DataTable columns={columns} data={data} />
    </main>
  );
}
