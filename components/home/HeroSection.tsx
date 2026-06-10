"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden px-6 pb-24 pt-14 md:px-8">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(248,205,126,0.25),transparent_48%),linear-gradient(180deg,rgba(15,23,42,0.92),rgba(15,23,42,0.6))]" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-amber-300">
            Luxury escapes, elevated stays
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Discover premium hotel stays crafted for modern travelers.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Book elegant rooms, access bespoke amenities, and plan every stay with confidence using our curated hotel experience.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/rooms"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-md shadow-slate-950/10 transition hover:bg-slate-100"
            >
              View rooms
            </Link>
            <a
              href="#booking"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
            >
              Start reservation
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
          className="relative mx-auto max-w-3xl lg:mx-0 lg:max-w-xl"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30 ring-1 ring-white/5 lg:p-8">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-amber-300/20 to-transparent" />
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-[1.75rem] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 text-white shadow-lg shadow-slate-950/40">
                <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
                  Signature Suite
                </p>
                <h2 className="mt-4 text-xl font-semibold">
                  Ocean view master suite
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  A serene space with private balcony, premium bedding, and curated hospitality.
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm text-slate-300">
                  <span className="rounded-full bg-white/5 px-3 py-1">King bed</span>
                  <span className="rounded-full bg-white/5 px-3 py-1">Spa access</span>
                </div>
              </div>
              <div className="rounded-[1.75rem] bg-slate-900 p-6 text-white shadow-lg shadow-slate-950/30">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
                  Highlights
                </p>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                  <li>Exclusive rooftop lounge</li>
                  <li>Daily gourmet breakfast</li>
                  <li>Concierge service</li>
                </ul>
                <div className="mt-8 rounded-3xl bg-slate-950/70 px-4 py-4 text-sm">
                  <p className="text-slate-300">From</p>
                  <p className="mt-1 text-3xl font-semibold text-white">$299</p>
                  <p className="text-slate-500">/ night</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
