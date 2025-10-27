"use client";

import { usePathname } from "next/navigation";
import Landing from "@/components/Landing";

export default function ConditionalLanding() {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <div className="mb-20">
      <Landing />
    </div>
  );
}