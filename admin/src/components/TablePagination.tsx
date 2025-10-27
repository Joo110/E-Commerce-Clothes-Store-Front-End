"use client";

import {
  Table as ReactTable,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TablePaginationProps<TData> {
  table: ReactTable<TData>;
}

export default function TablePagination<TData>({
  table,
}: TablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      {/* left side: page info */}
      <div className="text-sm text-muted-foreground">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </div>

      {/* right side: pagination buttons */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => table.previousPage()}
              aria-disabled={!table.getCanPreviousPage()}
              className={
                !table.getCanPreviousPage()
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>

          <PaginationItem>
            <span className="px-4 py-2 text-sm text-muted-foreground">
              {table.getState().pagination.pageIndex + 1}
            </span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => table.nextPage()}
              aria-disabled={!table.getCanNextPage()}
              className={
                !table.getCanNextPage() ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
