"use client";
import { useState, useEffect } from "react";
import { columns } from "../app/expenses/columns";
import { DataTable } from "../app/expenses/data-table";
import { Expense } from "@/types/expense";

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
  ];
}

const ExpensesTable = () => {
  const [data, setData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const expenses = await getData();
      setData(expenses);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDeleteRows = async (rowIndexes: number[]) => {
    for (const index of rowIndexes) {
      data.splice(index, 1);
    }
    setData([...data]);

    // Call your API endpoint here to perform the deletion
  };

  const handleAddRow = async () => {
    const newRow: Expense = {
      id: Date.now().toString(),
      title: "",
      description: "",
      amount: 0,
      paidOnBehalf: false,
      paidBackOn: null,
    };
    setData((prevData) => [...prevData, newRow]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <DataTable
        columns={columns}
        data={data}
        onDeleteRows={handleDeleteRows}
        onAddRow={handleAddRow}
      />
    </section>
  );
};

export default ExpensesTable;
