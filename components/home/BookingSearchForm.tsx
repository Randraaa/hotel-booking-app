"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaUserFriends, FaMapMarkerAlt } from "react-icons/fa";
import { roomTypeOptions } from "@/data/roomTypes";
import type { SearchFormValues } from "@/types/booking";

const initialValues: SearchFormValues = {
  destination: "Miami, FL",
  checkIn: "",
  checkOut: "",
  guests: 2,
  roomType: "Oceanfront Deluxe Suite",
};

export default function BookingSearchForm() {
  const router = useRouter();
  const [values, setValues] = useState<SearchFormValues>(initialValues);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleSelectRoom = (event: Event) => {
      const customEvent = event as CustomEvent<{ roomType: string }>;
      if (customEvent.detail && customEvent.detail.roomType) {
        setValues((current) => ({
          ...current,
          roomType: customEvent.detail.roomType,
        }));
        setIsSubmitted(false);
      }
    };

    window.addEventListener("select-room-type", handleSelectRoom);
    return () => {
      window.removeEventListener("select-room-type", handleSelectRoom);
    };
  }, []);

  const buttonLabel = useMemo(
    () => (isSubmitted ? "Search again" : "Find availability"),
    [isSubmitted],
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: name === "guests" ? Number(value) : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);

    const params = new URLSearchParams();
    if (values.destination) params.set("destination", values.destination);
    if (values.checkIn) params.set("checkIn", values.checkIn);
    if (values.checkOut) params.set("checkOut", values.checkOut);
    if (values.guests) params.set("guests", values.guests.toString());
    if (values.roomType) params.set("roomType", values.roomType);

    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <section id="booking" className="px-6 pb-24 pt-10 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/30 ring-1 ring-white/5 md:p-10"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
              Ready to reserve
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Find the perfect stay for your next luxury getaway.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-400">
            Search rooms by destination, dates, guests, and room type with easy access to tailored availability.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 xl:gap-5">
            <label className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-4 transition hover:border-white/20">
              <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                <FaMapMarkerAlt className="h-3.5 w-3.5 text-amber-300" />
                Destination
              </span>
              <input
                type="text"
                name="destination"
                value={values.destination}
                onChange={handleChange}
                className="mt-2 w-full border-0 bg-transparent text-white outline-none placeholder:text-slate-500"
                placeholder="City, resort, or hotel"
              />
            </label>

            <label className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-4 transition hover:border-white/20">
              <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                <FaCalendarAlt className="h-3.5 w-3.5 text-amber-300" />
                Check-in
              </span>
              <input
                type="date"
                name="checkIn"
                value={values.checkIn}
                onChange={handleChange}
                className="mt-2 w-full border-0 bg-transparent text-white outline-none"
              />
            </label>

            <label className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-4 transition hover:border-white/20">
              <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                <FaCalendarAlt className="h-3.5 w-3.5 text-amber-300" />
                Check-out
              </span>
              <input
                type="date"
                name="checkOut"
                value={values.checkOut}
                onChange={handleChange}
                className="mt-2 w-full border-0 bg-transparent text-white outline-none"
              />
            </label>

            <label className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-4 transition hover:border-white/20">
              <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                <FaUserFriends className="h-3.5 w-3.5 text-amber-300" />
                Guests
              </span>
              <input
                type="number"
                name="guests"
                min={1}
                max={6}
                value={values.guests}
                onChange={handleChange}
                className="mt-2 w-full border-0 bg-transparent text-white outline-none"
              />
            </label>

            <label className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-4 transition hover:border-white/20">
              <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                Room type
              </span>
              <select
                name="roomType"
                value={values.roomType}
                onChange={handleChange}
                className="mt-2 w-full border-0 bg-transparent text-white outline-none"
              >
                {roomTypeOptions.map((option) => (
                  <option key={option} value={option} className="bg-slate-950 text-white">
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 px-5 py-4 text-sm text-slate-400">
              <p className="font-medium text-slate-200">Flexible booking</p>
              <p className="mt-1">Free cancellation and luxury support included.</p>
            </div>
            <button
              type="submit"
              className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              {buttonLabel}
            </button>
          </div>

          {isSubmitted ? (
            <div className="rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-5 text-sm text-amber-100">
              <p className="font-semibold text-white">Search submitted</p>
              <p className="mt-2 text-slate-300">
                We&apos;re loading tailored availability for {values.destination} with {values.guests} guest(s).
              </p>
            </div>
          ) : null}
        </form>
      </motion.div>
    </section>
  );
}
