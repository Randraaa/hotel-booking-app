"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaUserFriends, FaChevronRight } from "react-icons/fa";
import { getFeaturedRooms } from "@/services/rooms";
import type { Room } from "@/types/room";

export default function FeaturedRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedRooms().then((data) => {
      setRooms(data);
      setLoading(false);
    });
  }, []);

  const handleBookNow = (roomName: string) => {
    // Dispatch custom event to select this room type in the form
    window.dispatchEvent(
      new CustomEvent("select-room-type", { detail: { roomType: roomName } })
    );
    // Smoothly scroll to the booking section
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  } as const;

  if (loading) {
    return (
      <section id="rooms" className="px-6 py-24 md:px-8 bg-slate-950">
        <div className="mx-auto max-w-7xl text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
          <p className="mt-4 text-slate-400">Loading signature escapes...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="rooms" className="relative px-6 py-24 md:px-8 bg-slate-950 overflow-hidden">
      {/* Decorative backdrop glow */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute left-0 bottom-0 h-96 w-96 rounded-full bg-rose-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
              Our Signature Escapes
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Explore Our Featured Rooms
            </h2>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400 md:mt-0">
            Immerse yourself in unrivaled luxury. Every suite is meticulously designed to offer a serene sanctuary with state-of-the-art details.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {rooms.map((room) => (
            <motion.div
              key={room.id}
              variants={cardVariants}
              className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/30 backdrop-blur-md transition-all duration-500 hover:border-amber-400/20 hover:bg-slate-900/60 shadow-lg"
            >
              {/* Image Container with Zoom */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={room.imageUrl}
                  alt={room.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                {/* Float Badge */}
                {room.tag && (
                  <span className="absolute left-4 top-4 rounded-full bg-amber-400/90 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md">
                    {room.tag}
                  </span>
                )}
              </div>

              {/* Room Info Content */}
              <div className="flex flex-1 flex-col p-6">
                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center text-amber-400">
                    <FaStar className="h-3.5 w-3.5 fill-current" />
                    <span className="ml-1 text-sm font-semibold text-slate-200">
                      {room.rating.toFixed(1)}
                    </span>
                  </div>
                  {room.reviewsCount && (
                    <span className="text-xs text-slate-500">
                      ({room.reviewsCount} reviews)
                    </span>
                  )}
                </div>

                {/* Name & Description */}
                <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-amber-300">
                  {room.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-2">
                  {room.description}
                </p>

                {/* Capacity & Amenities Preview */}
                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium text-slate-300">
                    <FaUserFriends className="h-4 w-4 text-amber-300" />
                    Up to {room.capacity} guests
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {room.amenities.slice(0, 2).map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 border border-white/5"
                    >
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 2 && (
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-400">
                      +{room.amenities.length - 2} more
                    </span>
                  )}
                </div>

                {/* Price and CTA */}
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                  <div>
                    <span className="text-slate-400 text-xs block">Rates from</span>
                    <span className="text-2xl font-bold text-white">
                      ${room.pricePerNight}
                    </span>
                    <span className="text-slate-500 text-xs">/night</span>
                  </div>
                  <button
                    onClick={() => handleBookNow(room.name)}
                    className="inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-amber-400 p-3 text-white hover:text-slate-950 transition-all duration-300 group/btn border border-white/5 hover:border-amber-400"
                    aria-label={`Book ${room.name}`}
                  >
                    <span className="sr-only">Book Now</span>
                    <FaChevronRight className="h-4 w-4 transform transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
