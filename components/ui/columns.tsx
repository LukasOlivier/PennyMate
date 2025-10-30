"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SerializedExpense } from "@/types/expense";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<SerializedExpense>[] = [
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
