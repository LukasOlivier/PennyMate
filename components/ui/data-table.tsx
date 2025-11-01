"use client";

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

import { useState, useEffect } from "react";
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
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onAddRow: () => void;
  onDeleteRows: (rowIndices: number[]) => void;
  onEditRow: (rowIndex: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onAddRow,
  onDeleteRows,
  onEditRow,
}: DataTableProps<TData, TValue>) {
  const [pageSize, setPageSize] = useState(10);
  const [isMounted, setIsMounted] = useState(false);

  // DISCLAIMER: AI GENERATED CODE
  useEffect(() => {
    setIsMounted(true);

    const calculatePageSize = () => {
      // Get viewport height
      const viewportHeight = window.innerHeight;
      // Get table container element
      const tableContainer = document.querySelector(
        ".overflow-hidden.rounded-md.border"
      );
      if (!tableContainer) return 10;

      // Get the height of a single row (including padding)
      const sampleRow = tableContainer.querySelector("tr");
      if (!sampleRow) return 10;
      const rowHeight = sampleRow.offsetHeight;

      // Get heights of other UI elements
      const headerHeight =
        tableContainer.querySelector("thead")?.offsetHeight || 0;
      const searchBarHeight = 450; // Approximate height of search bar area
      const paginationHeight = 64; // Approximate height of pagination controls

      // Calculate available space for table body
      const availableHeight =
        viewportHeight - headerHeight - searchBarHeight - paginationHeight;

      // Calculate how many rows can fit
      const maxRows = Math.floor(availableHeight / rowHeight);

      // Ensure we have at least 5 rows and at most 15 rows
      return Math.max(5, Math.min(15, maxRows));
    };

    const handleResize = () => {
      // Use requestAnimationFrame to avoid excessive calculations during resize
      requestAnimationFrame(() => {
        setPageSize(calculatePageSize());
      });
    };

    // Initial calculation
    setPageSize(calculatePageSize());

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // TABLE STATE
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [rowSelection, setRowSelection] = useState({});
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
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
    },
  });

  // Update table page size after mount
  useEffect(() => {
    if (isMounted) {
      table.setPageSize(pageSize);
    }
  }, [pageSize, table, isMounted]);

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
          <div className="flex gap-2">
            <Button
              className="bg-blue-500 cursor-pointer hover:bg-blue-600 "
              disabled={Object.keys(rowSelection).length !== 1}
              onClick={() => {
                onEditRow(Number(Object.keys(rowSelection)[0]));
                table.resetRowSelection();
              }}
            >
              <Pencil></Pencil>
            </Button>

            <Button
              className="bg-red-500 cursor-pointer hover:bg-red-600 "
              disabled={Object.keys(rowSelection).length === 0}
              onClick={() => {
                onDeleteRows(
                  Object.keys(rowSelection).map((key) => Number(key))
                );
                table.resetRowSelection();
              }}
            >
              <Trash></Trash>
            </Button>

            <Button
              className={"bg-blue-500 cursor-pointer hover:bg-blue-600 grow"}
              disabled={Object.keys(rowSelection).length > 0}
              onClick={() => onAddRow()}
            >
              New
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
    </>
  );
}
