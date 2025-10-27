"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnDef,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/TablePagination";
import { useState } from "react";
import { Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDeletePayment } from "@/hooks/usePayments";
import { toast } from "sonner";

// Props interface
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function DataTable<T>({ columns, data }: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  
  const deletePayment = useDeletePayment();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    state: { sorting, rowSelection, columnFilters },
  });

  const handleDeleteSelected = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => (row.original as any).id);

    if (selectedIds.length === 0) {
      toast.error("No payments selected");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} payment(s)?`
    );

    if (!confirmed) return;

    try {
      // Delete each selected payment
      for (const id of selectedIds) {
        await deletePayment.mutateAsync(id);
      }
      
      toast.success(`Successfully deleted ${selectedIds.length} payment(s)`);
      setRowSelection({});
    } catch (error) {
      toast.error("Failed to delete payments");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by transaction ID or email..."
            value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("id")?.setFilterValue(event.target.value)
            }
            className="pl-9 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>

        {/* Delete Button - Only show when rows are selected */}
        {Object.keys(rowSelection).length > 0 && (
          <button
            onClick={handleDeleteSelected}
            disabled={deletePayment.isPending}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 text-sm rounded-md cursor-pointer transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete ({Object.keys(rowSelection).length})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border border-gray-700 bg-white dark:bg-gray-900">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-gray-700 hover:bg-gray-800">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-gray-300">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow 
                  key={row.id} 
                  data-state={row.getIsSelected() && "selected"}
                  className="border-gray-700 hover:bg-gray-800 data-[state=selected]:bg-gray-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-gray-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-gray-700 hover:bg-gray-800">
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination table={table} />
      </div>
    </div>
  );
}