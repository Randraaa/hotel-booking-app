"use client";

import { Booking } from "@/types/booking";
import { Room } from "@/types/room";
import { useState, useMemo } from "react";
import {
  FiCalendar,
  FiPrinter,
  FiXCircle,
  FiMinusCircle,
  FiInfo,
  FiArrowRight,
} from "react-icons/fi";
import Link from "next/link";

interface BookingsListProps {
  bookings: Booking[];
  rooms: Room[];
  onCancelBooking: (confCode: string) => Promise<void>;
}

export default function BookingsList({
  bookings,
  rooms,
  onCancelBooking,
}: BookingsListProps) {
  const [activeSubTab, setActiveSubTab] = useState<"upcoming" | "history">("upcoming");
  const [cancellingCode, setCancellingCode] = useState<string | null>(null);
  const [isProcessingCancel, setIsProcessingCancel] = useState(false);

  // Filter bookings
  const upcomingBookings = useMemo(() => {
    return bookings
      .filter((b) => b.status === "upcoming")
      .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
  }, [bookings]);

  const historyBookings = useMemo(() => {
    return bookings
      .filter((b) => b.status === "completed" || b.status === "cancelled")
      .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
  }, [bookings]);

  // Find Room for a Booking
  const getRoomForBooking = (roomId?: string) => {
    return rooms.find((r) => r.id === roomId) || null;
  };

  const handleCancelClick = (confCode: string) => {
    setCancellingCode(confCode);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingCode) return;
    setIsProcessingCancel(true);
    try {
      await onCancelBooking(cancellingCode);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingCancel(false);
      setCancellingCode(null);
    }
  };

  const handlePrint = (booking: Booking) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Hotel Luxe Reservation Voucher - ${booking.confirmationNumber}</title>
          <style>
            body { font-family: sans-serif; color: #333; padding: 40px; }
            .voucher { border: 2px solid #ddd; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; }
            h1 { color: #d97706; margin-top: 0; }
            .row { display: flex; justify-content: space-between; margin: 15px 0; border-bottom: 1px dashed #eee; padding-bottom: 10px; }
            .label { font-weight: bold; }
            .value { font-family: monospace; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="voucher">
            <h1>Hotel Luxe - Booking Confirmation</h1>
            <p>Thank you for choosing Hotel Luxe. Please present this voucher upon check-in.</p>
            <div class="row"><span class="label">Voucher Number</span><span class="value">${booking.confirmationNumber}</span></div>
            <div class="row"><span class="label">Guest Name</span><span>${booking.fullName}</span></div>
            <div class="row"><span class="label">Room Category</span><span>${booking.roomType}</span></div>
            <div class="row"><span class="label">Occupancy</span><span>${booking.guests} Guest(s)</span></div>
            <div class="row"><span class="label">Check-in</span><span>${booking.checkIn}</span></div>
            <div class="row"><span class="label">Check-out</span><span>${booking.checkOut}</span></div>
            <div class="row"><span class="label">Total Price</span><span>$${booking.totalPrice || "Flexible Rate"}</span></div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <div className="flex border-b border-white/10 pb-1 gap-6">
        <button
          onClick={() => setActiveSubTab("upcoming")}
          className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition cursor-pointer ${
            activeSubTab === "upcoming"
              ? "border-amber-400 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Upcoming stays ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setActiveSubTab("history")}
          className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition cursor-pointer ${
            activeSubTab === "history"
              ? "border-amber-400 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          History logs ({historyBookings.length})
        </button>
      </div>

      {/* Bookings View */}
      {activeSubTab === "upcoming" ? (
        upcomingBookings.length > 0 ? (
          <div className="space-y-6">
            {upcomingBookings.map((booking) => {
              const room = getRoomForBooking(booking.roomId);
              return (
                <div
                  key={booking.confirmationNumber}
                  className="rounded-[2rem] border border-white/10 bg-slate-900/10 p-5 md:p-6 backdrop-blur-md shadow-xl flex flex-col lg:flex-row gap-6 items-center"
                >
                  {/* Left Side: Room Photo */}
                  <div className="h-44 lg:h-36 w-full lg:w-48 overflow-hidden rounded-2xl border border-white/10 shrink-0">
                    <img
                      src={room?.imageUrl || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80"}
                      alt={booking.roomType}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Middle: Core Information */}
                  <div className="text-left w-full flex-1">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <span className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        Confirmed Stay
                      </span>
                      <p className="text-xs text-slate-400">
                        Voucher: <span className="font-mono text-amber-400 font-bold">{booking.confirmationNumber}</span>
                      </p>
                    </div>

                    <h4 className="text-lg font-bold text-white mt-2">{booking.roomType}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-5">
                      Destination: Miami Beach, FL • Guests: {booking.guests}
                    </p>

                    <div className="flex gap-4 text-xs text-slate-400 mt-4 border-t border-white/5 pt-3 flex-wrap">
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase">Check-in</span>
                        <span className="text-white font-medium">{booking.checkIn}</span>
                      </div>
                      <div className="border-r border-white/10 pr-4" />
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase">Check-out</span>
                        <span className="text-white font-medium">{booking.checkOut}</span>
                      </div>
                      <div className="border-r border-white/10 pr-4" />
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase">Grand Total</span>
                        <span className="text-amber-300 font-bold">${booking.totalPrice || 350 * (booking.nights || 1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Actions Panel */}
                  <div className="flex lg:flex-col gap-3 w-full lg:w-44 shrink-0 justify-end border-t border-white/5 pt-4 lg:border-t-0 lg:pt-0 lg:border-l lg:border-white/10 lg:pl-6">
                    <button
                      onClick={() => handlePrint(booking)}
                      className="w-full flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 py-3 text-xs font-semibold transition cursor-pointer"
                    >
                      <FiPrinter className="h-3.5 w-3.5" />
                      <span>Print Voucher</span>
                    </button>
                    <button
                      onClick={() => handleCancelClick(booking.confirmationNumber)}
                      className="w-full flex items-center justify-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 py-3 text-xs font-semibold transition cursor-pointer"
                    >
                      <FiXCircle className="h-3.5 w-3.5" />
                      <span>Cancel Stay</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/10 p-12 text-center backdrop-blur-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/40 text-slate-400 border border-white/5 mb-4">
              <FiCalendar className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-300">No upcoming stays scheduled</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-2 leading-relaxed">
              Plan your next beach escape! Explore our elegant hotel suite categories.
            </p>
            <Link
              href="/rooms"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-6 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-amber-300 shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              <span>Explore Rooms</span>
              <FiArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )
      ) : historyBookings.length > 0 ? (
        <div className="space-y-6">
          {historyBookings.map((booking) => {
            const room = getRoomForBooking(booking.roomId);
            const isCancelled = booking.status === "cancelled";
            return (
              <div
                key={booking.confirmationNumber}
                className={`rounded-[2rem] border p-5 md:p-6 backdrop-blur-md shadow-xl flex flex-col lg:flex-row gap-6 items-center transition ${
                  isCancelled
                    ? "border-white/5 bg-slate-950/20 opacity-60"
                    : "border-white/10 bg-slate-900/10"
                }`}
              >
                {/* Left Side: Room Photo */}
                <div className="h-44 lg:h-36 w-full lg:w-48 overflow-hidden rounded-2xl border border-white/10 shrink-0">
                  <img
                    src={room?.imageUrl || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80"}
                    alt={booking.roomType}
                    className="h-full w-full object-cover grayscale-25"
                  />
                </div>

                {/* Middle: Core Information */}
                <div className="text-left w-full flex-1">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    {isCancelled ? (
                      <span className="inline-block rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                        Cancelled Stay
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Past Stay Log
                      </span>
                    )}
                    <p className="text-xs text-slate-500">
                      Voucher: <span className="font-mono">{booking.confirmationNumber}</span>
                    </p>
                  </div>

                  <h4 className="text-lg font-bold text-white mt-2">{booking.roomType}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-5">
                    Dates: {booking.checkIn} to {booking.checkOut} • Nights: {booking.nights || 1} • Guests: {booking.guests}
                  </p>
                </div>

                {/* Right Side: Actions Panel */}
                <div className="flex lg:flex-col gap-3 w-full lg:w-44 shrink-0 justify-end border-t border-white/5 pt-4 lg:border-t-0 lg:pt-0 lg:border-l lg:border-white/10 lg:pl-6">
                  {room && (
                    <Link
                      href={`/rooms/${room.id}`}
                      className="w-full flex items-center justify-center gap-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 py-3 text-xs font-semibold transition cursor-pointer"
                    >
                      <span>Book Again</span>
                      <FiArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/10 p-12 text-center backdrop-blur-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/40 text-slate-400 border border-white/5 mb-4">
            <FiMinusCircle className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-300">No historical stays found</h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-2 leading-relaxed">
            You do not have any past stay logs in this account yet.
          </p>
        </div>
      )}

      {/* Cancellation Confirmation Modal overlay */}
      {cancellingCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setCancellingCode(null)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-6 md:p-8 shadow-2xl z-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-5">
              <FiInfo className="h-5 w-5" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Cancel Reservation?</h3>
            <p className="text-slate-400 text-xs leading-5 mb-6">
              Are you sure you want to cancel booking <span className="font-bold text-white font-mono">{cancellingCode}</span>? This will free your room category and is irreversible.
            </p>

            <div className="grid grid-cols-2 gap-3.5">
              <button
                onClick={() => setCancellingCode(null)}
                className="rounded-full border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 py-3 text-xs font-semibold transition cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isProcessingCancel}
                className="rounded-full bg-rose-500 hover:bg-rose-400 text-white py-3 text-xs font-semibold transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isProcessingCancel ? (
                  <span className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Confirm Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
