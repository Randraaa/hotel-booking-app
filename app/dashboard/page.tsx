import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "User Profile Dashboard — Hotel Luxe",
  description:
    "Manage your hotel reservations, review loyalty point balances, inspect saved suites, and update account settings at Hotel Luxe.",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex flex-col justify-center items-center py-32">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
            <p className="mt-4 text-sm text-slate-400 font-medium tracking-wide">
              Loading user workspace...
            </p>
          </div>
        }
      >
        <DashboardClient />
      </Suspense>
      <Footer />
    </main>
  );
}
