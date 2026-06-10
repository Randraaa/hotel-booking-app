"use client";

import { motion } from "framer-motion";
import { FaStar, FaUserFriends } from "react-icons/fa";
import type { Room } from "@/types/room";
import Link from "next/link";

interface RoomCardProps {
  room: Room;
  onViewDetails?: (room: Room) => void;
}

export default function RoomCard({ room, onViewDetails }: RoomCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  } as const;

  return (
    <motion.div
      variants={cardVariants}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/20 backdrop-blur-md transition-all duration-500 hover:border-amber-400/20 hover:bg-slate-900/50 shadow-lg"
    >
      {/* Image Container with Zoom */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={room.imageUrl}
          alt={room.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        
        {/* Floating Badges */}
        {room.tag && (
          <span className="absolute left-4 top-4 rounded-full bg-amber-400/90 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md">
            {room.tag}
          </span>
        )}

        <div className="absolute right-4 top-4 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 px-3 py-1 flex items-center gap-1.5 text-xs font-semibold text-amber-300">
          <FaStar className="h-3 w-3 fill-current" />
          <span>{room.rating.toFixed(2)}</span>
        </div>
      </div>

      {/* Card Body Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-amber-300">
          {room.name}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-2">
          {room.description}
        </p>

        {/* Capacity Detail */}
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <FaUserFriends className="h-4 w-4 text-amber-300" />
            Up to {room.capacity} guests
          </span>
        </div>

        {/* Amenities Preview */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {room.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 border border-white/5"
            >
              {amenity}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-400">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Pricing & CTA Row */}
        <div className="mt-auto pt-6 flex items-end justify-between border-t border-white/5">
          <div>
            <span className="text-slate-500 text-[10px] uppercase tracking-wider block">Rates from</span>
            <span className="text-2xl font-bold text-white">
              ${room.pricePerNight}
            </span>
            <span className="text-slate-500 text-xs font-medium"> / night</span>
          </div>
          
          {onViewDetails ? (
            <button
              onClick={() => onViewDetails(room)}
              className="rounded-full bg-white/10 hover:bg-amber-400 px-5 py-2.5 text-xs font-semibold text-white hover:text-slate-950 transition-all duration-300 border border-white/5 hover:border-amber-400 shadow-md cursor-pointer"
            >
              View Details
            </button>
          ) : (
            <Link
              href={`/rooms/${room.id}`}
              className="rounded-full bg-white/10 hover:bg-amber-400 px-5 py-2.5 text-xs font-semibold text-white hover:text-slate-950 transition-all duration-300 border border-white/5 hover:border-amber-400 shadow-md cursor-pointer"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
