"use client";

import { ReactNode } from "react";
import ReactQueryProvider from "@/lib/react-query-provider";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}