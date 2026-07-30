import type { ReactNode } from "react";
import { DashboardNav } from "./_components/dashboard-nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <DashboardNav />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
