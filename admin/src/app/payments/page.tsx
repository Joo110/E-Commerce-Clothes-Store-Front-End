"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useAllPayments } from "@/hooks/usePayments";
import { Loader2 } from "lucide-react";

const PaymentsPage = () => {
  const { data: payments, isLoading, error } = useAllPayments();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-2">Failed to load payments</p>
          <p className="text-gray-600 text-sm">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Payments</h1>
        <p className="text-sm text-gray-600 mt-1">
          Total: {payments?.length || 0} payments
        </p>
      </div>
      <DataTable columns={columns} data={payments || []} />
    </div>
  );
};

export default PaymentsPage;