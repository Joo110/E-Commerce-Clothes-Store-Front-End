"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export type Payment = {
  id: string;
  amount: number;
  fullName: string;
  userId: string;
  email: string;
  status: "pending" | "processing" | "success" | "failed";
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        className="border-gray-500 data-[state=checked]:bg-blue-600"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
        className="border-gray-500 data-[state=checked]:bg-blue-600"
      />
    ),
  },

  {
    accessorKey: "id",
    header: () => <div className="text-gray-300">Transaction ID</div>,
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return <span className="font-mono text-xs text-gray-400">{id}</span>;
    },
  },

  {
    accessorKey: "fullName",
    header: () => <div className="text-gray-300">User</div>,
    cell: ({ row }) => {
      const name = row.getValue("fullName") as string;
      return (
        <span className="font-medium text-gray-200">
          {name === "N/A" ? (
            <span className="text-gray-500 italic">Not Available</span>
          ) : (
            name
          )}
        </span>
      );
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-gray-300 hover:bg-gray-800 hover:text-white"
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <span className="text-gray-300">
          {email === "N/A" ? (
            <span className="text-gray-500 italic">Not Available</span>
          ) : (
            email
          )}
        </span>
      );
    },
  },

  {
    accessorKey: "status",
    header: () => <div className="text-gray-300">Status</div>,
    cell: ({ row }) => {
      const status = (row.getValue("status") as string) || "pending";
      const statusStyles: Record<string, string> = {
        pending: "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50",
        processing: "bg-blue-500/30 text-blue-300 border border-blue-500/50",
        success: "bg-green-500/30 text-green-300 border border-green-500/50",
        failed: "bg-red-500/30 text-red-300 border border-red-500/50",
      };

      return (
        <div
          className={cn(
            "px-2 py-1 rounded-md w-max text-xs capitalize font-medium",
            statusStyles[status] || "bg-gray-600 text-gray-300"
          )}
        >
          {status}
        </div>
      );
    },
  },

  {
    accessorKey: "amount",
    header: () => <div className="text-right text-gray-300">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount") as string);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium text-gray-200">{formatted}</div>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-800">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-gray-200">
            <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
              className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
            >
              Copy transaction ID
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 p-0">
              <Link href={`/orders/${payment.userId}`} className="w-full px-2 py-1.5 block">
                View order
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 p-0">
              <Link href={`/payments/${payment.id}`} className="w-full px-2 py-1.5 block">
                View payment details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];