"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState, useMemo } from "react";
import {
  FaCalendarAlt,
  FaUserFriends,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaInfoCircle,
} from "react-icons/fa";
import { createBooking } from "@/services/bookings";
import type { Room } from "@/types/room";
import type { BookingRequest } from "@/types/booking";

interface BookingFormInputs {
  checkIn: string;
  checkOut: string;
  guests: number;
  fullName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

interface BookingFormProps {
  room: Room;
  defaultCheckIn?: string;
  defaultCheckOut?: string;
  defaultGuests?: number;
  showSpecialRequests?: boolean;
  onSuccess: (confirmationNumber: string, request: BookingRequest) => void;
}

export default function BookingForm({
  room,
  defaultCheckIn = "",
  defaultCheckOut = "",
  defaultGuests = 2,
  showSpecialRequests = false,
  onSuccess,
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormInputs>({
    defaultValues: {
      checkIn: defaultCheckIn,
      checkOut: defaultCheckOut,
      guests: Math.min(defaultGuests, room.capacity),
      fullName: "",
      email: "",
      phone: "",
      specialRequests: "",
    },
  });

  // Keep guests within capacity limits when room capacity changes
  useEffect(() => {
    setValue("guests", Math.min(defaultGuests, room.capacity));
  }, [room, defaultGuests, setValue]);

  // Watch dates to drive price recalculations
  const watchedCheckIn = watch("checkIn");
  const watchedCheckOut = watch("checkOut");

  // Calculate nights count
  const nights = useMemo(() => {
    if (!watchedCheckIn || !watchedCheckOut) return 1;
    const start = new Date(watchedCheckIn);
    const end = new Date(watchedCheckOut);
    const diff = end.getTime() - start.getTime();
    if (diff <= 0) return 1;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [watchedCheckIn, watchedCheckOut]);

  // Pricing tallies
  const subtotal = room.pricePerNight * nights;
  const tax = Math.round(subtotal * 0.1);
  const resortFee = 50 * nights;
  const total = subtotal + tax + resortFee;

  // Submit Handler
  const onSubmit = async (data: BookingFormInputs) => {
    setIsSubmitting(true);

    const request: BookingRequest = {
      destination: "Miami Beach, FL",
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: Number(data.guests),
      roomType: room.name,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      roomId: room.id,
      specialRequests: data.specialRequests || undefined,
      totalPrice: total,
      nights: nights,
    };

    try {
      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const res = await createBooking(request);
      if (res.success) {
        onSuccess(res.confirmationNumber, request);
      }
    } catch (err) {
      console.error("Booking form error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      {/* Dates Fields */}
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col">
          <span className="mb-2 flex items-center gap-1.5 text-[10px] uppercase font-semibold tracking-wider text-slate-400">
            <FaCalendarAlt className="h-3 w-3 text-amber-300" />
            Check-in
          </span>
          <input
            type="date"
            {...register("checkIn", {
              required: "Check-in date is required",
              validate: (val) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const selected = new Date(val);
                return selected >= today || "Date cannot be in the past";
              },
            })}
            className={`rounded-xl border bg-slate-950/50 p-3 text-xs text-white outline-none transition focus:border-amber-400 focus:bg-slate-950 h-11 ${
              errors.checkIn ? "border-rose-500" : "border-white/10"
            }`}
          />
          {errors.checkIn && (
            <span className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
              <FaInfoCircle className="h-2.5 w-2.5" />
              {errors.checkIn.message}
            </span>
          )}
        </label>

        <label className="flex flex-col">
          <span className="mb-2 flex items-center gap-1.5 text-[10px] uppercase font-semibold tracking-wider text-slate-400">
            <FaCalendarAlt className="h-3 w-3 text-amber-300" />
            Check-out
          </span>
          <input
            type="date"
            {...register("checkOut", {
              required: "Check-out date is required",
              validate: (val, formValues) => {
                if (!formValues.checkIn) return true;
                const start = new Date(formValues.checkIn);
                const end = new Date(val);
                return end > start || "Date must be after check-in";
              },
            })}
            className={`rounded-xl border bg-slate-950/50 p-3 text-xs text-white outline-none transition focus:border-amber-400 focus:bg-slate-950 h-11 ${
              errors.checkOut ? "border-rose-500" : "border-white/10"
            }`}
          />
          {errors.checkOut && (
            <span className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
              <FaInfoCircle className="h-2.5 w-2.5" />
              {errors.checkOut.message}
            </span>
          )}
        </label>
      </div>

      {/* Guests Selector */}
      <label className="flex flex-col">
        <span className="mb-2 flex items-center gap-1.5 text-[10px] uppercase font-semibold tracking-wider text-slate-400">
          <FaUserFriends className="h-3.5 w-3.5 text-amber-300" />
          Guests Count
        </span>
        <select
          {...register("guests", {
            required: "Guests count is required",
            validate: (val) => Number(val) <= room.capacity || `Limit: ${room.capacity} guests`,
          })}
          className="rounded-xl border border-white/10 bg-slate-950/50 p-3 text-xs text-white outline-none transition focus:border-amber-400 focus:bg-slate-950 h-11"
        >
          {Array.from({ length: room.capacity }).map((_, valIdx) => (
            <option key={valIdx + 1} value={valIdx + 1} className="bg-slate-950 text-white">
              {valIdx + 1} Guest{valIdx + 1 > 1 ? "s" : ""}
            </option>
          ))}
        </select>
        {errors.guests && (
          <span className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
            <FaInfoCircle className="h-2.5 w-2.5" />
            {errors.guests.message}
          </span>
        )}
      </label>

      {/* Contact Name */}
      <label className="flex flex-col">
        <span className="mb-2 flex items-center gap-1.5 text-[10px] uppercase font-semibold tracking-wider text-slate-400">
          <FaUser className="h-3 w-3 text-amber-300" />
          Full Name
        </span>
        <input
          type="text"
          placeholder="John Doe"
          {...register("fullName", {
            required: "Full name is required",
            minLength: { value: 3, message: "Min 3 characters required" },
          })}
          className={`rounded-xl border bg-slate-950/50 p-3 text-xs text-white placeholder-slate-600 outline-none transition focus:border-amber-400 focus:bg-slate-950 h-11 ${
            errors.fullName ? "border-rose-500" : "border-white/10"
          }`}
        />
        {errors.fullName && (
          <span className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
            <FaInfoCircle className="h-2.5 w-2.5" />
            {errors.fullName.message}
          </span>
        )}
      </label>

      {/* Contact Email */}
      <label className="flex flex-col">
        <span className="mb-2 flex items-center gap-1.5 text-[10px] uppercase font-semibold tracking-wider text-slate-400">
          <FaEnvelope className="h-3 w-3 text-amber-300" />
          Email Address
        </span>
        <input
          type="email"
          placeholder="john@example.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email format",
            },
          })}
          className={`rounded-xl border bg-slate-950/50 p-3 text-xs text-white placeholder-slate-600 outline-none transition focus:border-amber-400 focus:bg-slate-950 h-11 ${
            errors.email ? "border-rose-500" : "border-white/10"
          }`}
        />
        {errors.email && (
          <span className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
            <FaInfoCircle className="h-2.5 w-2.5" />
            {errors.email.message}
          </span>
        )}
      </label>

      {/* Contact Phone */}
      <label className="flex flex-col">
        <span className="mb-2 flex items-center gap-1.5 text-[10px] uppercase font-semibold tracking-wider text-slate-400">
          <FaPhone className="h-3 w-3 text-amber-300" />
          Phone Number
        </span>
        <input
          type="tel"
          placeholder="+1 (555) 019-2834"
          {...register("phone", {
            required: "Phone number is required",
            minLength: { value: 7, message: "Invalid phone (min 7 digits)" },
          })}
          className={`rounded-xl border bg-slate-950/50 p-3 text-xs text-white placeholder-slate-600 outline-none transition focus:border-amber-400 focus:bg-slate-950 h-11 ${
            errors.phone ? "border-rose-500" : "border-white/10"
          }`}
        />
        {errors.phone && (
          <span className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
            <FaInfoCircle className="h-2.5 w-2.5" />
            {errors.phone.message}
          </span>
        )}
      </label>

      {/* Special Requests (Optional, e.g. for modal / sidebars conditionally) */}
      {showSpecialRequests && (
        <label className="flex flex-col">
          <span className="mb-2 text-[10px] uppercase font-semibold tracking-wider text-slate-400">
            Special Requests (Optional)
          </span>
          <textarea
            rows={2}
            placeholder="E.g., early check-in, spa booking coordinates..."
            {...register("specialRequests")}
            className="rounded-xl border border-white/10 bg-slate-950/50 p-3 text-xs text-white placeholder-slate-600 outline-none transition focus:border-amber-400 focus:bg-slate-950 resize-none"
          />
        </label>
      )}

      {/* Estimations pricing details */}
      <div className="border-t border-white/5 pt-4 mt-6 space-y-2 text-xs text-slate-400">
        <div className="flex justify-between">
          <span>
            ${room.pricePerNight} x {nights} night{nights > 1 ? "s" : ""}
          </span>
          <span className="text-white">${subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Resort Fees & Tax</span>
          <span className="text-white">${tax + resortFee}</span>
        </div>
        <div className="flex justify-between border-t border-white/5 pt-3 text-sm font-semibold text-white">
          <span>Grand Total</span>
          <span className="text-amber-300 font-bold">${total}</span>
        </div>
      </div>

      {/* CTA Reservation Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-6 rounded-full bg-amber-400 hover:bg-amber-300 py-3.5 text-xs font-semibold text-slate-950 transition shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-12"
      >
        {isSubmitting ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
        ) : (
          "Confirm Booking"
        )}
      </button>
    </form>
  );
}
