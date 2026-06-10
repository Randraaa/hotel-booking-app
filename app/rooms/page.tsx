import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import RoomsClient from "./RoomsClient";

export const metadata: Metadata = {
  title: "Sanctuaries & Suites — Hotel Luxe",
  description:
    "Explore our collection of boutique resort rooms, oceanfront suites, and presidential villas in Miami Beach. Filter by dates, pricing, and guest capacity.",
};

export default function RoomsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      {/* Header Banner */}
      <section className="relative px-6 pt-24 pb-16 md:px-8 text-center overflow-hidden shrink-0">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,_rgba(248,205,126,0.15),transparent_50%)] blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
            Resort Suites
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Our Sanctuaries & Villas
          </h1>
          <p className="mt-6 text-base leading-7 text-slate-400 max-w-2xl mx-auto">
            Browse our curated selection of luxury rooms, beachfront villas, and penthouse suites. Filter down to your exact comfort and start your luxury escape.
          </p>
        </div>
      </section>

      {/* Filter and Rooms List Section */}
      <section className="flex-1 px-6 pb-24 md:px-8 max-w-7xl mx-auto w-full">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/10 p-6 space-y-4 animate-pulse"
                >
                  <div className="aspect-[4/3] w-full rounded-2xl bg-white/5" />
                  <div className="h-6 w-2/3 rounded-lg bg-white/5" />
                  <div className="h-4 w-full rounded-lg bg-white/5" />
                  <div className="h-4 w-5/6 rounded-lg bg-white/5" />
                  <div className="pt-4 flex justify-between items-center border-t border-white/5">
                    <div className="h-8 w-1/3 rounded-lg bg-white/5" />
                    <div className="h-10 w-1/4 rounded-full bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <RoomsClient />
        </Suspense>
      </section>

      <Footer />
    </main>
  );
}
