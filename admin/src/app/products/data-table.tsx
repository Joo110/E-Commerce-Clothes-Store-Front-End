"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
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
import { Trash2 } from "lucide-react";
import { useDeleteProduct } from "@/hooks/useProducts";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const deleteProduct = useDeleteProduct();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
    enableRowSelection: true, // مهم لتفعيل اختيار الصفوف
  });

  const handleDelete = () => {
    const selectedIds = Object.keys(rowSelection).filter((key) => rowSelection[key]);

    if (selectedIds.length === 0) return;

    if (!confirm("Are you sure you want to delete the selected product(s)?")) return;

    console.log("Deleting ids:", selectedIds);

    selectedIds.forEach((id) => {
      deleteProduct.mutate(id, {
        onSuccess: () => {
          console.log(`Deleted product ${id} successfully`);
        },
        onError: (error) => {
          console.error(`Failed to delete product ${id}`, error);
        },
      });
    });

    // بعد الحذف إعادة تعيين الاختيارات
    setRowSelection({});
  };

  return (
    <div className="rounded-md border">
      {Object.values(rowSelection).some((v) => v) && (
        <div className="flex justify-end">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-500 text-white px-2 py-1 text-sm rounded-md m-4 cursor-pointer hover:bg-red-600 transition"
          >
            <Trash2 className="w-4 h-4" />
            Delete Product(s)
          </button>
        </div>
      )}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={rowSelection[row.original.id] ? "selected" : undefined}
                className="cursor-pointer hover:bg-gray-50 transition"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    onClick={() => {
                      setRowSelection((prev) => ({
                        ...prev,
                        [row.original.id]: !prev[row.original.id],
                      }));
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination table={table} />
    </div>
  );
}