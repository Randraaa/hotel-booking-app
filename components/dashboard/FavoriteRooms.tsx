"use client";

import { Room } from "@/types/room";
import { FiHeart, FiStar, FiUser, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";

interface FavoriteRoomsProps {
  rooms: Room[];
  favoriteIds: string[];
  onToggleFavorite: (roomId: string) => void;
}

export default function FavoriteRooms({
  rooms,
  favoriteIds,
  onToggleFavorite,
}: FavoriteRoomsProps) {
  // Filter rooms that are favorited
  const favoriteRooms = rooms.filter((room) => favoriteIds.includes(room.id));

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.05, duration: 0.4, ease: "easeOut" as const },
    }),
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white tracking-wide">Favorite Rooms</h3>
        <p className="text-xs text-slate-400 mt-1">
          Your bookmarked beachside sanctuaries and presidential villas
        </p>
      </div>

      {favoriteRooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRooms.map((room, index) => (
            <motion.div
              key={room.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/20 backdrop-blur-md transition-all duration-300 hover:border-amber-400/20 hover:bg-slate-900/50 shadow-lg"
            >
              {/* Image with zoom and gradients */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={room.imageUrl}
                  alt={room.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Rating badge */}
                <div className="absolute left-4 top-4 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 px-3 py-1 flex items-center gap-1 text-[11px] font-semibold text-amber-300">
                  <FiStar className="h-3.5 w-3.5 fill-current text-amber-400" />
                  <span>{room.rating.toFixed(2)}</span>
                </div>

                {/* Favorite Heart Trigger (solid red on favorites view) */}
                <button
                  onClick={() => onToggleFavorite(room.id)}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 hover:bg-slate-950 text-rose-500 transition cursor-pointer"
                  aria-label="Remove from favorites"
                >
                  <FiHeart className="h-4.5 w-4.5 fill-current" />
                </button>
              </div>

              {/* Card content */}
              <div className="flex flex-1 flex-col p-5">
                <h4 className="text-base font-bold text-white transition-colors duration-300 group-hover:text-amber-300">
                  {room.name}
                </h4>
                <p className="mt-2 text-xs leading-5 text-slate-400 line-clamp-2">
                  {room.description}
                </p>

                {/* Occupancy and key specs */}
                <div className="mt-3 flex items-center gap-3 border-t border-white/5 pt-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-300">
                    <FiUser className="h-3.5 w-3.5 text-amber-300" />
                    Up to {room.capacity} guests
                  </span>
                  <span>•</span>
                  <span>{room.specifications.view}</span>
                </div>

                {/* pricing and link to detail page */}
                <div className="mt-auto pt-4 flex items-end justify-between border-t border-white/5">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Per Night</span>
                    <span className="text-xl font-bold text-white">${room.pricePerNight}</span>
                  </div>

                  <Link
                    href={`/rooms/${room.id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-white/10 hover:bg-amber-400 px-4 py-2 text-xs font-semibold text-white hover:text-slate-950 transition-all duration-300 border border-white/5 hover:border-amber-400 shadow-md cursor-pointer"
                  >
                    <span>View Suite</span>
                    <FiArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/10 p-12 text-center backdrop-blur-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/40 text-slate-400 border border-white/5 mb-4">
            <FiHeart className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-300">No bookmarked suites yet</h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-2 leading-relaxed">
            As you explore our seaside properties, tap the heart bookmark icons to save suites that catch your eye.
          </p>
          <Link
            href="/rooms"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-6 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-amber-300 shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <span>Browse Suites</span>
            <FiArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
