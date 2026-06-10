"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaUserFriends, FaTimes, FaCheck } from "react-icons/fa";
import BookingForm from "@/components/rooms/BookingForm";
import type { Room } from "@/types/room";
import type { BookingRequest } from "@/types/booking";

interface RoomDetailModalProps {
  room: Room | null;
  onClose: () => void;
}

export default function RoomDetailModal({ room, onClose }: RoomDetailModalProps) {
  const [confirmationNumber, setConfirmationNumber] = useState<string | null>(null);
  const [savedRequest, setSavedRequest] = useState<BookingRequest | null>(null);

  if (!room) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4 md:p-6">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl z-10 max-h-[90vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/60 text-slate-300 backdrop-blur-md transition hover:border-amber-400 hover:text-white cursor-pointer"
            aria-label="Close details"
          >
            <FaTimes className="h-4 w-4" />
          </button>

          {/* Modal Header/Hero Image */}
          <div className="relative h-[200px] md:h-[300px] w-full shrink-0">
            <img
              src={room.imageUrl}
              alt={room.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            
            {/* Title Overlay */}
            <div className="absolute bottom-6 left-6 md:left-8 pr-16">
              {room.tag && (
                <span className="inline-block rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-950 mb-3 shadow-md">
                  {room.tag}
                </span>
              )}
              <h2 className="text-2xl md:text-3xl font-bold text-white">{room.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  <FaStar className="h-3.5 w-3.5 fill-current" />
                  <span className="ml-1 text-sm font-semibold text-slate-200">
                    {room.rating.toFixed(2)}
                  </span>
                </div>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <FaUserFriends className="h-3.5 w-3.5 text-amber-300" />
                  Up to {room.capacity} Guests
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable Content Pane */}
          <div className="overflow-y-auto p-6 md:p-8 flex-1">
            {confirmationNumber ? (
              /* Success Booking Receipt */
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-lg mx-auto py-8"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
                  <FaCheck className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Reservation Confirmed!</h3>
                <p className="text-slate-400 text-sm mb-6 leading-6">
                  Thank you for booking with Hotel Luxe. Your luxury escape is registered under the confirmation code below.
                </p>
                <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 mb-8">
                  <span className="text-slate-500 text-xs uppercase tracking-widest block mb-1">Confirmation Number</span>
                  <span className="text-3xl font-mono font-bold text-amber-300 tracking-wider">
                    {confirmationNumber}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-left text-sm border-t border-white/5 pt-6 text-slate-400">
                  <div>
                    <span className="text-xs text-slate-500 block">Suite Category</span>
                    <span className="text-white font-medium">{room.name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Guests Reserved</span>
                    <span className="text-white font-medium">{savedRequest?.guests} Guest(s)</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-slate-500 block">Check-in Date</span>
                    <span className="text-white font-medium">{savedRequest?.checkIn}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-slate-500 block">Check-out Date</span>
                    <span className="text-white font-medium">{savedRequest?.checkOut}</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="mt-8 rounded-full bg-amber-400 text-slate-950 font-semibold px-6 py-2.5 transition hover:bg-amber-300 cursor-pointer"
                >
                  Close Window
                </button>
              </motion.div>
            ) : (
              /* Detail Info and Form Grid */
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Details Column */}
                <div className="md:col-span-3 space-y-6">
                  <div>
                    <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-3">About the Suite</h4>
                    <p className="text-sm leading-7 text-slate-400">
                      {room.description} Experience ultimate luxury with custom bedding, breathtaking viewpoints, and dedicated services tailored exclusively for your complete comfort and relaxation.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-3.5">Bespoke Amenities</h4>
                    <ul className="grid grid-cols-2 gap-3 text-sm text-slate-300">
                      {room.amenities.map((amenity, idx) => (
                        <li key={idx} className="flex items-center gap-2.5">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-300 text-xs border border-amber-400/20">
                            <FaCheck className="h-2 w-2" />
                          </span>
                          <span>{amenity}</span>
                        </li>
                      ))}
                      {/* Generics to represent extensive checklists */}
                      <li className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-300 text-xs border border-amber-400/20">
                          <FaCheck className="h-2 w-2" />
                        </span>
                        <span>Soundproof suites</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-300 text-xs border border-amber-400/20">
                          <FaCheck className="h-2 w-2" />
                        </span>
                        <span>Fully stocked luxury mini-bar</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-5 text-sm text-slate-400 leading-6">
                    <p className="font-semibold text-white mb-1">Check-in / Check-out policy</p>
                    <p>Check-in is permitted starting at 3:00 PM, and checkout is required by 12:00 PM. Early arrival and late departures can be coordinated upon request.</p>
                  </div>
                </div>

                {/* Form Column */}
                <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-white/5 pt-8 md:pt-0 md:pl-8">
                  <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-5">Secure Reservation</h4>
                  
                  <BookingForm
                    room={room}
                    onSuccess={(code, req) => {
                      setConfirmationNumber(code);
                      setSavedRequest(req);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
