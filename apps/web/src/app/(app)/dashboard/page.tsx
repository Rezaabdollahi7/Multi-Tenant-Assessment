import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <h1 className="text-xl font-semibold">Dashboard</h1>;
}
