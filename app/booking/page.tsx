import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import BookingClient from "./BookingClient";

export const metadata: Metadata = {
  title: "Secure Check-out & Booking — Hotel Luxe",
  description:
    "Complete your reservation details at Hotel Luxe resort and beachside sanctuaries in Miami Beach.",
};

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex flex-col justify-center items-center py-24 bg-slate-950">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
            <p className="mt-4 text-sm text-slate-400 font-medium">Loading Reservation Engine...</p>
          </div>
        }
      >
        <BookingClient />
      </Suspense>
      <Footer />
    </main>
  );
}
