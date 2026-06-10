"use client";

import { useAuth } from "@/context/AuthContext";
import { Booking } from "@/types/booking";
import { Room } from "@/types/room";
import {
  FiCalendar,
  FiMoon,
  FiAward,
  FiHeart,
  FiArrowRight,
  FiCompass,
} from "react-icons/fi";
import { useMemo } from "react";
import Link from "next/link";

interface OverviewProps {
  bookings: Booking[];
  favoritesCount: number;
  rooms: Room[];
  setActiveTab: (tab: string) => void;
}

export default function ProfileOverview({
  bookings,
  favoritesCount,
  rooms,
  setActiveTab,
}: OverviewProps) {
  const { user } = useAuth();

  // Filter bookings
  const upcomingBookings = useMemo(() => {
    return bookings
      .filter((b) => b.status === "upcoming")
      .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
  }, [bookings]);

  const totalNights = useMemo(() => {
    return bookings
      .filter((b) => b.status === "completed" || b.status === "upcoming")
      .reduce((sum, b) => sum + (b.nights || 1), 0);
  }, [bookings]);

  // Points: base points + nights * multiplier
  const loyaltyPoints = useMemo(() => {
    const base = 1500;
    const nightPoints = totalNights * 250;
    return base + nightPoints;
  }, [totalNights]);

  // Next upcoming stay details
  const nextStay = upcomingBookings[0] || null;
  const nextStayRoom = useMemo(() => {
    if (!nextStay) return null;
    return rooms.find((r) => r.id === nextStay.roomId) || null;
  }, [nextStay, rooms]);

  // Calculate countdown to next stay
  const countdownText = useMemo(() => {
    if (!nextStay) return "";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInDate = new Date(nextStay.checkIn);
    const diffTime = checkInDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Arriving today!";
    if (diffDays === 1) return "Arriving tomorrow!";
    if (diffDays < 0) return "Stay in progress";
    return `Arriving in ${diffDays} days`;
  }, [nextStay]);

  return (
    <div className="space-y-8">
      {/* Top Banner Greeting */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 shadow-xl">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-amber-400/5 blur-3xl" />
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            Welcome back
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white tracking-tight">
            Hello, {user?.name}!
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-xl leading-relaxed">
            Your beachside sanctuary is waiting. Review your upcoming luxury stays, check your premium member benefits, or update your preferences.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Bookings */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/20 p-5 backdrop-blur-md shadow-md flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
            <FiCalendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Bookings</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {bookings.filter((b) => b.status !== "cancelled").length}
            </h3>
          </div>
        </div>

        {/* Stat 2: Nights */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/20 p-5 backdrop-blur-md shadow-md flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <FiMoon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Nights</p>
            <h3 className="text-2xl font-bold text-white mt-1">{totalNights}</h3>
          </div>
        </div>

        {/* Stat 3: Points */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/20 p-5 backdrop-blur-md shadow-md flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <FiAward className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Loyalty Points</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {loyaltyPoints.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Stat 4: Favorites */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/20 p-5 backdrop-blur-md shadow-md flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <FiHeart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Saved Rooms</p>
            <h3 className="text-2xl font-bold text-white mt-1">{favoritesCount}</h3>
          </div>
        </div>
      </div>

      {/* Main Panel Content: Next Stay & Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Next Stay Card */}
        <div className="lg:col-span-7 rounded-[2rem] border border-white/10 bg-slate-900/10 p-6 md:p-8 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">Nearest Stay</h3>
            <p className="text-xs text-slate-400 mt-1">Your upcoming reservation details</p>
          </div>

          {nextStay ? (
            <div className="mt-6 flex flex-col gap-6">
              {/* Room Card Preview */}
              <div className="flex flex-col sm:flex-row gap-5 items-center bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                <div className="h-28 w-full sm:w-28 overflow-hidden rounded-xl border border-white/10 shrink-0">
                  <img
                    src={nextStayRoom?.imageUrl || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=300&q=80"}
                    alt={nextStay.roomType}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-left w-full">
                  <span className="inline-block rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                    {countdownText}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1.5">{nextStay.roomType}</h4>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Voucher: <span className="font-mono text-amber-400 font-bold">{nextStay.confirmationNumber}</span>
                  </p>
                  <div className="flex gap-4 text-xs text-slate-400 mt-3 border-t border-white/5 pt-2 font-medium">
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase">Check-in</span>
                      <span className="text-white">{nextStay.checkIn}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase">Check-out</span>
                      <span className="text-white">{nextStay.checkOut}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase">Guests</span>
                      <span className="text-white">{nextStay.guests} Guest{nextStay.guests > 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-2">
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition cursor-pointer"
                >
                  <span>Manage booking</span>
                  <FiArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center text-center py-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/40 text-slate-400 border border-white/5 mb-4">
                <FiCompass className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-300">No upcoming stays scheduled</h4>
              <p className="text-xs text-slate-500 max-w-xs mt-2 leading-relaxed">
                You do not have any active reservations. Browse our oceanfront suites and book your next tropical getaway.
              </p>
              <Link
                href="/rooms"
                className="mt-6 rounded-full bg-amber-400 px-6 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-amber-300 hover:scale-[1.02] shadow-lg shadow-amber-500/10"
              >
                Browse Suites
              </Link>
            </div>
          )}
        </div>

        {/* Loyalty & Tier Benefits Info */}
        <div className="lg:col-span-5 rounded-[2rem] border border-white/10 bg-slate-900/10 p-6 md:p-8 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">Loyalty Benefits</h3>
            <p className="text-xs text-slate-400 mt-1">Exclusive Gold Member Privileges</p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3 text-xs leading-relaxed text-slate-400">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-300 font-bold text-[10px]">
                ✓
              </span>
              <p>
                <strong className="text-white">Complimentary Room Upgrades:</strong> Eligible for space-available upgrades to premium oceanfront views upon check-in.
              </p>
            </div>
            
            <div className="flex items-start gap-3 text-xs leading-relaxed text-slate-400">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-300 font-bold text-[10px]">
                ✓
              </span>
              <p>
                <strong className="text-white">Late Check-out:</strong> Keep your room until 2:00 PM free of charge (subject to room availability).
              </p>
            </div>
            
            <div className="flex items-start gap-3 text-xs leading-relaxed text-slate-400">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-300 font-bold text-[10px]">
                ✓
              </span>
              <p>
                <strong className="text-white">Spa & Wellness Discount:</strong> Enjoy 15% off all spa sessions, beach cabanas, and massage treatments.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center text-xs">
            <span className="text-slate-500">Tier Progress:</span>
            <span className="text-slate-300 font-semibold">500 pts to Platinum Level</span>
          </div>
        </div>
      </div>
    </div>
  );
}
