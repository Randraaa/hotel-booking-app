"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserFriends,
  FaInfoCircle,
  FaTimes,
  FaPrint,
  FaCheck,
} from "react-icons/fa";
import { getFeaturedRooms } from "@/services/rooms";
import { createBooking } from "@/services/bookings";
import { useAuth } from "@/context/AuthContext";
import type { Room } from "@/types/room";
import type { BookingRequest } from "@/types/booking";

interface FormInputs {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  fullName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

export default function BookingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoomId = searchParams.get("roomId") || "";
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  // Protect route redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/booking${initialRoomId ? `&roomId=${initialRoomId}` : ""}`);
    }
  }, [isAuthenticated, authLoading, initialRoomId, router]);

  // Fetch rooms list
  useEffect(() => {
    getFeaturedRooms().then((data) => {
      setRooms(data);
      setIsLoading(false);
    });
  }, []);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      roomId: initialRoomId,
      checkIn: "",
      checkOut: "",
      guests: 2,
      fullName: "",
      email: "",
      phone: "",
      specialRequests: "",
    },
  });

  // Watch fields to drive live price summary and capacity limit validations
  const watchedRoomId = watch("roomId");
  const watchedCheckIn = watch("checkIn");
  const watchedCheckOut = watch("checkOut");

  // Automatically select the first room if roomId param is empty
  useEffect(() => {
    if (!isLoading && rooms.length > 0 && !watchedRoomId) {
      setValue("roomId", rooms[0].id);
    }
  }, [isLoading, rooms, watchedRoomId, setValue]);

  // Find currently active room object
  const activeRoom = useMemo(() => {
    return rooms.find((r) => r.id === watchedRoomId) || rooms[0] || null;
  }, [rooms, watchedRoomId]);

  // Adjust guests count default if it exceeds active room capacity
  useEffect(() => {
    if (activeRoom) {
      setValue("guests", Math.min(2, activeRoom.capacity));
    }
  }, [activeRoom, setValue]);

  // Calculate nights dynamically
  const nights = useMemo(() => {
    if (!watchedCheckIn || !watchedCheckOut) return 1;
    const start = new Date(watchedCheckIn);
    const end = new Date(watchedCheckOut);
    const diff = end.getTime() - start.getTime();
    if (diff <= 0) return 1;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [watchedCheckIn, watchedCheckOut]);

  // Calculate pricing breakdown
  const subtotal = useMemo(() => {
    if (!activeRoom) return 0;
    return activeRoom.pricePerNight * nights;
  }, [activeRoom, nights]);

  const tax = Math.round(subtotal * 0.1);
  const resortFee = 50 * nights;
  const total = subtotal + tax + resortFee;

  // Submit Handler
  const onSubmit = async (data: FormInputs) => {
    if (!activeRoom) return;
    setIsSubmitting(true);

    const request: BookingRequest = {
      destination: "Miami Beach, FL",
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: Number(data.guests),
      roomType: activeRoom.name,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      roomId: activeRoom.id,
      specialRequests: data.specialRequests,
      totalPrice: total,
      nights: nights,
    };

    try {
      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const res = await createBooking(request);
      if (res.success) {
        setConfirmationCode(res.confirmationNumber);
      }
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || authLoading || !isAuthenticated || !activeRoom) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-24 bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
        <p className="mt-4 text-sm text-slate-400 font-medium">
          {!isAuthenticated ? "Verifying authorization..." : "Preparing reservation workspace..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 pb-24 pt-10 md:px-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Reservation Inputs Form (Left) */}
        <div className="lg:col-span-7 rounded-[2rem] border border-white/10 bg-slate-900/10 p-6 md:p-10 backdrop-blur-md shadow-xl">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Resort Reservation</p>
            <h1 className="mt-3 text-2xl md:text-3xl font-semibold text-white tracking-tight">
              Complete Your Luxury Reservation
            </h1>
            <p className="mt-2 text-slate-400 text-sm leading-6">
              Enter your details, choose your dates, and secure your beachside suite. Free cancellation applies to all flexible rates.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            {/* Step 1: Select Suite */}
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block">1. Select Suite</span>
              <label className="flex flex-col">
                <span className="mb-2 text-xs text-slate-400 font-semibold uppercase tracking-wide">Sanctuary Room Category</span>
                <select
                  {...register("roomId", { required: "Please select a room category" })}
                  className="rounded-xl border border-white/10 bg-slate-950/50 p-3.5 text-sm text-white outline-none transition focus:border-amber-400 focus:bg-slate-950 h-12"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id} className="bg-slate-950 text-white">
                      {r.name} — ${r.pricePerNight} / night
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Step 2: Choose Dates */}
            <div className="space-y-4 border-t border-white/5 pt-6">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block">2. Select Travel Dates</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="mb-2 flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wide">
                    <FaCalendarAlt className="h-3.5 w-3.5 text-amber-300" />
                    Check-in Date
                  </span>
                  <input
                    type="date"
                    {...register("checkIn", {
                      required: "Check-in date is required",
                      validate: (val) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const selected = new Date(val);
                        return selected >= today || "Check-in cannot be in the past";
                      },
                    })}
                    className={`rounded-xl border bg-slate-950/50 p-3 text-xs text-white outline-none transition focus:border-amber-400 focus:bg-slate-950 h-12 ${
                      errors.checkIn ? "border-rose-500" : "border-white/10"
                    }`}
                  />
                  {errors.checkIn && (
                    <span className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                      <FaInfoCircle className="h-3 w-3 shrink-0" />
                      {errors.checkIn.message}
                    </span>
                  )}
                </label>

                <label className="flex flex-col">
                  <span className="mb-2 flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wide">
                    <FaCalendarAlt className="h-3.5 w-3.5 text-amber-300" />
                    Check-out Date
                  </span>
                  <input
                    type="date"
                    {...register("checkOut", {
                      required: "Check-out date is required",
                      validate: (val, formValues) => {
                        if (!formValues.checkIn) return true;
                        const start = new Date(formValues.checkIn);
                        const end = new Date(val);
                        return end > start || "Check-out must be after check-in date";
                      },
                    })}
                    className={`rounded-xl border bg-slate-950/50 p-3 text-xs text-white outline-none transition focus:border-amber-400 focus:bg-slate-950 h-12 ${
                      errors.checkOut ? "border-rose-500" : "border-white/10"
                    }`}
                  />
                  {errors.checkOut && (
                    <span className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                      <FaInfoCircle className="h-3 w-3 shrink-0" />
                      {errors.checkOut.message}
                    </span>
                  )}
                </label>
              </div>

              {/* Guest selection */}
              <label className="flex flex-col">
                <span className="mb-2 flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wide">
                  <FaUserFriends className="h-4 w-4 text-amber-300" />
                  Total Guests
                </span>
                <select
                  {...register("guests", {
                    required: "Guests count is required",
                    validate: (val, formValues) => {
                      const roomObj = rooms.find((r) => r.id === formValues.roomId);
                      if (!roomObj) return true;
                      return (
                        Number(val) <= roomObj.capacity ||
                        `Suite capacity limit is ${roomObj.capacity} guests.`
                      );
                    },
                  })}
                  className={`rounded-xl border bg-slate-950/50 p-3.5 text-sm text-white outline-none transition focus:border-amber-400 focus:bg-slate-950 h-12 ${
                    errors.guests ? "border-rose-500" : "border-white/10"
                  }`}
                >
                  {Array.from({ length: activeRoom.capacity }).map((_, valIdx) => (
                    <option key={valIdx + 1} value={valIdx + 1} className="bg-slate-950 text-white">
                      {valIdx + 1} Guest{valIdx + 1 > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
                {errors.guests && (
                  <span className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                    <FaInfoCircle className="h-3 w-3 shrink-0" />
                    {errors.guests.message}
                  </span>
                )}
              </label>
            </div>

            {/* Step 3: Contact Details */}
            <div className="space-y-4 border-t border-white/5 pt-6">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block">3. Contact Information</span>
              
              {/* Full Name */}
              <label className="flex flex-col">
                <span className="mb-2 flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wide">
                  <FaUser className="h-3 w-3 text-amber-300" />
                  Full Name
                </span>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register("fullName", {
                    required: "Full name is required",
                    minLength: { value: 3, message: "Name must be at least 3 characters" },
                  })}
                  className={`rounded-xl border bg-slate-950/50 p-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-amber-400 focus:bg-slate-950 ${
                    errors.fullName ? "border-rose-500" : "border-white/10"
                  }`}
                />
                {errors.fullName && (
                  <span className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                    <FaInfoCircle className="h-3 w-3 shrink-0" />
                    {errors.fullName.message}
                  </span>
                )}
              </label>

              {/* Grid Email and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="mb-2 flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wide">
                    <FaEnvelope className="h-3 w-3 text-amber-300" />
                    Email Address
                  </span>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    {...register("email", {
                      required: "Email address is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address format",
                      },
                    })}
                    className={`rounded-xl border bg-slate-950/50 p-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-amber-400 focus:bg-slate-950 h-12 ${
                      errors.email ? "border-rose-500" : "border-white/10"
                    }`}
                  />
                  {errors.email && (
                    <span className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                      <FaInfoCircle className="h-3 w-3 shrink-0" />
                      {errors.email.message}
                    </span>
                  )}
                </label>

                <label className="flex flex-col">
                  <span className="mb-2 flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wide">
                    <FaPhone className="h-3 w-3 text-amber-300" />
                    Phone Number
                  </span>
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    {...register("phone", {
                      required: "Phone number is required",
                      minLength: { value: 7, message: "Invalid phone format (min 7 chars)" },
                    })}
                    className={`rounded-xl border bg-slate-950/50 p-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-amber-400 focus:bg-slate-950 h-12 ${
                      errors.phone ? "border-rose-500" : "border-white/10"
                    }`}
                  />
                  {errors.phone && (
                    <span className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                      <FaInfoCircle className="h-3 w-3 shrink-0" />
                      {errors.phone.message}
                    </span>
                  )}
                </label>
              </div>

              {/* Special requests */}
              <label className="flex flex-col">
                <span className="mb-2 text-xs text-slate-400 font-semibold uppercase tracking-wide">Special Requests (Optional)</span>
                <textarea
                  placeholder="E.g., early check-in, dietary restrictions, airport shuttle arrangements..."
                  {...register("specialRequests")}
                  rows={3}
                  className="rounded-xl border border-white/10 bg-slate-950/50 p-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-amber-400 focus:bg-slate-950 resize-none"
                />
              </label>
            </div>

            {/* Submit Reservation */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-amber-400 py-4 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-14 shadow-lg shadow-amber-500/10"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              ) : (
                "Confirm Reservation & Book"
              )}
            </button>
          </form>
        </div>

        {/* Live Booking Summary Card (Right) */}
        <div className="lg:col-span-5 sticky top-28 space-y-6">
          <div className="rounded-[2.2rem] border border-white/10 bg-slate-900/10 p-6 md:p-8 backdrop-blur-md shadow-xl">
            <h3 className="text-lg font-semibold text-white uppercase tracking-wider mb-6">Booking Summary</h3>
            
            {/* Room Image and Spec Card */}
            <div className="flex gap-4 mb-6 pb-6 border-b border-white/5 items-center">
              <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 shrink-0">
                <img src={activeRoom.imageUrl} alt={activeRoom.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-5">{activeRoom.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 font-medium">
                  <span>Size: {activeRoom.specifications.size}</span>
                  <span>•</span>
                  <span>{activeRoom.specifications.view}</span>
                </div>
              </div>
            </div>

            {/* Calculations and Breakdown list */}
            <div className="space-y-3.5 text-xs text-slate-400 border-b border-white/5 pb-6 mb-6">
              <div className="flex justify-between">
                <span>Room rate:</span>
                <span className="text-white font-medium">${activeRoom.pricePerNight} / night</span>
              </div>
              <div className="flex justify-between">
                <span>Stay duration:</span>
                <span className="text-white font-medium">{nights} night{nights > 1 ? "s" : ""}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-white font-medium">${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Luxury tax (10%):</span>
                <span className="text-white font-medium">${tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Resort & Service fee:</span>
                <span className="text-white font-medium">${resortFee}</span>
              </div>
            </div>

            {/* Grand Total Cost */}
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-sm font-semibold text-white">Grand Total:</span>
              <div>
                <span className="text-2xl font-bold text-amber-300">${total}</span>
                <span className="text-slate-500 text-xs font-semibold"> USD</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-4 text-[10px] leading-4 text-slate-500 flex items-start gap-2">
              <FaInfoCircle className="h-4 w-4 text-amber-300/60 shrink-0 mt-0.5" />
              <p>Cancellation Policy: Rescheduling is free of charge up to 72 hours before arrival. Cancellations made within 72 hours will forfeit the first night&apos;s rate.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Success Receipt Modal Overlay */}
      <AnimatePresence>
        {confirmationCode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmationCode(null)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950 p-6 md:p-10 shadow-2xl z-10 text-center"
            >
              {/* Close Cross */}
              <button
                onClick={() => setConfirmationCode(null)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <FaTimes className="h-4.5 w-4.5" />
              </button>

              {/* checkmark circle */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6 mt-4">
                <FaCheck className="h-5 w-5" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Reservation Confirmed!</h3>
              <p className="text-slate-400 text-xs leading-5 max-w-sm mx-auto mb-6">
                Your reservation at Hotel Luxe is secure. A confirmation voucher has been dispatched to your email address.
              </p>

              {/* Voucher code */}
              <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-5 mb-6">
                <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-1">Voucher Code</span>
                <span className="text-3xl font-mono font-bold text-amber-300 tracking-wider">
                  {confirmationCode}
                </span>
              </div>

              {/* details summary table */}
              <div className="text-left text-xs space-y-2.5 text-slate-400 border-t border-white/5 pt-5 mb-8">
                <div className="flex justify-between">
                  <span>Suite category:</span>
                  <span className="text-white font-medium">{activeRoom.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Occupancy:</span>
                  <span className="text-white font-medium">{activeRoom.capacity} Guest(s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-in date:</span>
                  <span className="text-white font-medium">{watchedCheckIn}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out date:</span>
                  <span className="text-white font-medium">{watchedCheckOut}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 py-3 text-xs font-semibold transition cursor-pointer"
                >
                  <FaPrint className="h-3.5 w-3.5" />
                  <span>Print Voucher</span>
                </button>
                <button
                  onClick={() => setConfirmationCode(null)}
                  className="rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 py-3 text-xs font-semibold transition cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
