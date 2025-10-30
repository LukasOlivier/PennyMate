"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SerializedExpense } from "@/types/expense";
import { Checkbox } from "@/components/ui/checkbox";
import { SerializedIncome } from "@/types/income";

const baseColumns: ColumnDef<SerializedExpense | SerializedIncome>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div>Date</div>,
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date | undefined;
      return (
        <span>{date ? new Date(date).toLocaleDateString("nl-BE") : "N/A"}</span>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",
    header: () => <div>Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("nl-BE", {
        style: "currency",
        currency: "EUR",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
];

const expenseColumns: ColumnDef<SerializedExpense | SerializedIncome>[] = [
  {
    accessorKey: "paidOnBehalf",
    header: "Paid On Behalf",
    cell: ({ row }) => {
      const paidOnBehalf = row.getValue("paidOnBehalf") as boolean;
      return <span>{paidOnBehalf ? "Yes" : "No"}</span>;
    },
  },
  {
    accessorKey: "paidBackOn",
    header: "Paid Back On",
    cell: ({ row }) => {
      const paidBackOn = row.getValue("paidBackOn") as Date | undefined;
      return (
        <span>
          {paidBackOn
            ? new Date(paidBackOn).toLocaleDateString("nl-BE")
            : "N/A"}
        </span>
      );
    },
  },
];

export function getColumns(
  type: "expense" | "income"
): ColumnDef<SerializedExpense | SerializedIncome>[] {
  if (type === "expense") {
    return [...baseColumns, ...expenseColumns];
  }
  return baseColumns;
}
