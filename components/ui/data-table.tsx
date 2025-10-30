"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Trash } from "lucide-react";
import { SerializedExpense } from "@/types/expense";
import { Prisma } from "@prisma/client";
import ExpensesForm from "../expenses-form";
import { addExpense, deleteExpenseIds } from "@/actions/actions";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [editingExpense, setEditingExpense] =
    useState<SerializedExpense | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const onDeleteRows = (index: number[]) => {
    const ids = index.map((i) => (data as SerializedExpense[])[i].id);
    deleteExpenseIds(ids as string[]);
    table.resetRowSelection();
  };

  const onAddRow = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
    table.resetRowSelection();
  };

  const handleEditRow = (index: number) => {
    const expense = (data as SerializedExpense[]).find(
      (exp) => exp.id === (data as SerializedExpense[])[index].id
    ) as SerializedExpense;
    if (expense) {
      setEditingExpense(expense);
      setIsFormOpen(true);
    }
    table.resetRowSelection();
  };

  // TABLE STATE
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnIds, filterValue: string) => {
      if (!filterValue) return true;
      const search = String(filterValue).toLowerCase();
      const title = String(row.getValue("title") ?? "").toLowerCase();
      const description = String(
        row.getValue("description") ?? ""
      ).toLowerCase();
      return title.includes(search) || description.includes(search);
    },
    onGlobalFilterChange: setGlobalFilter,
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
    },
  });

  return (
    <>
      <div>
        <div className="flex py-4 w-full items-end gap-5 flex-col-reverse md:flex-row ">
          <div className="flex gap-2 w-full">
            <DataTableViewOptions table={table} />

            <Input
              placeholder="Search expenses..."
              value={globalFilter}
              onChange={(event) => {
                const value = event.target.value;
                setGlobalFilter(value);
              }}
              className="md:max-w-sm grow"
            />
          </div>
          <div className="flex gap-2  ">
            <Button
              className="bg-blue-500 cursor-pointer hover:bg-blue-600 "
              variant="destructive"
              disabled={Object.keys(rowSelection).length !== 1}
              onClick={() =>
                handleEditRow(Number(Object.keys(rowSelection)[0]))
              }
            >
              <Pencil></Pencil>
            </Button>

            <Button
              className="bg-red-500 cursor-pointer hover:bg-red-600 "
              variant="destructive"
              disabled={Object.keys(rowSelection).length === 0}
              onClick={() => {
                onDeleteRows(Object.keys(rowSelection).map(Number));
                table.resetRowSelection();
              }}
            >
              <Trash></Trash>
            </Button>

            <Button
              className={"bg-blue-500 cursor-pointer hover:bg-blue-600 grow"}
              variant="destructive"
              disabled={Object.keys(rowSelection).length > 0}
              onClick={() => onAddRow()}
            >
              <Plus></Plus>
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="bg-surface-light">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="p-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              className="cursor-pointer"
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              className="cursor-pointer"
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      {isFormOpen && (
        <ExpensesForm
          expense={editingExpense}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
}
