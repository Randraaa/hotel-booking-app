"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import BookingForm from "@/components/rooms/BookingForm";
import type { Room } from "@/types/room";
import type { BookingRequest } from "@/types/booking";

interface BookingCardProps {
  room: Room;
}

export default function RoomDetailsBookingCard({ room }: BookingCardProps) {
  const [confirmationNumber, setConfirmationNumber] = useState<string | null>(null);
  const [savedRequest, setSavedRequest] = useState<BookingRequest | null>(null);

  return (
    <div className="sticky top-28 rounded-[2rem] border border-white/10 bg-slate-900/20 p-6 md:p-8 backdrop-blur-md shadow-xl shadow-slate-950/20">
      <AnimatePresence mode="wait">
        {confirmationNumber ? (
          /* Receipt Success State */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="text-center py-4"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-5">
              <FaCheckCircle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Booking Confirmed!</h3>
            <p className="text-slate-400 text-xs mb-6 leading-5">
              A receipt has been dispatched to {savedRequest?.email}. Present the confirmation code below at reception.
            </p>
            
            <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-5 mb-6">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-1">Confirmation Number</span>
              <span className="text-2xl font-mono font-bold text-amber-300 tracking-wider">
                {confirmationNumber}
              </span>
            </div>

            <div className="text-left text-xs space-y-2.5 text-slate-400 border-t border-white/5 pt-5">
              <div className="flex justify-between">
                <span>Nights Reserved:</span>
                <span className="text-white font-medium">{savedRequest?.nights} Night(s)</span>
              </div>
              <div className="flex justify-between">
                <span>Check-in Date:</span>
                <span className="text-white font-medium">{savedRequest?.checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out Date:</span>
                <span className="text-white font-medium">{savedRequest?.checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Paid:</span>
                <span className="text-white font-medium">${savedRequest?.totalPrice}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setConfirmationNumber(null);
                setSavedRequest(null);
              }}
              className="w-full mt-6 rounded-full border border-white/15 bg-white/5 text-white py-3 text-xs font-semibold hover:bg-white/10 transition cursor-pointer"
            >
              Reserve Again
            </button>
          </motion.div>
        ) : (
          /* booking Form Card */
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header pricing information */}
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <span className="text-2xl font-bold text-white">${room.pricePerNight}</span>
                <span className="text-slate-400 text-sm"> / night</span>
              </div>
              
              {/* Availability information */}
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Available Today
              </span>
            </div>

            <BookingForm
              room={room}
              onSuccess={(code, req) => {
                setConfirmationNumber(code);
                setSavedRequest(req);
              }}
            />
            
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 pt-4">
              <FaShieldAlt className="h-3 w-3" />
              <span>SSL Encrypted Reservation Process</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
