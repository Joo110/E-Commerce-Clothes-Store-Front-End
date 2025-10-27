// admin/src/components/ui/pagination.tsx
import * as React from "react";

export function Pagination({ children }: { children: React.ReactNode }) {
  return <nav className="flex justify-center">{children}</nav>;
}

export function PaginationContent({ children }: { children: React.ReactNode }) {
  return <ul className="flex items-center space-x-2">{children}</ul>;
}

export function PaginationItem({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}

export function PaginationPrevious({ ...props }) {
  return (
    <button {...props} className="px-2 py-1 border rounded">
      Prev
    </button>
  );
}

export function PaginationNext({ ...props }) {
  return (
    <button {...props} className="px-2 py-1 border rounded">
      Next
    </button>
  );
}