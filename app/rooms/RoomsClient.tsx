"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import RoomCard from "@/components/rooms/RoomCard";
import RoomFilterBar from "@/components/rooms/RoomFilterBar";
import RoomDetailModal from "@/components/rooms/RoomDetailModal";
import { getFeaturedRooms } from "@/services/rooms";
import type { Room } from "@/types/room";

const ITEMS_PER_PAGE = 6;

export default function RoomsClient() {
  const searchParams = useSearchParams();
  const destQuery = searchParams.get("destination") || "";
  const guestsQuery = searchParams.get("guests") || "";
  const typeQuery = searchParams.get("roomType") || "";

  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Initialize filters using URL search parameters
  const [searchQuery, setSearchQuery] = useState(destQuery);
  const [roomType, setRoomType] = useState(typeQuery);
  const [capacityRange, setCapacityRange] = useState(() => {
    if (!guestsQuery) return "";
    const g = Number(guestsQuery);
    if (g <= 2) return "1-2";
    if (g <= 4) return "3-4";
    return "5+";
  });
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Sync state if URL params change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (destQuery) setSearchQuery(destQuery);
      if (typeQuery) setRoomType(typeQuery);
      if (guestsQuery) {
        const g = Number(guestsQuery);
        if (g <= 2) setCapacityRange("1-2");
        else if (g <= 4) setCapacityRange("3-4");
        else setCapacityRange("5+");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [destQuery, typeQuery, guestsQuery]);

  // Fetch Rooms
  useEffect(() => {
    getFeaturedRooms().then((data) => {
      setRooms(data);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    });
  }, []);

  // Reset Filters handler
  const handleResetFilters = () => {
    setSearchQuery("");
    setRoomType("");
    setCapacityRange("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    setCurrentPage(1);
  };

  // Reset page when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 0);
    return () => clearTimeout(timer);
  }, [searchQuery, roomType, capacityRange, minPrice, maxPrice, sortBy]);

  // Client-side Filtering & Sorting Logic
  const filteredAndSortedRooms = useMemo(() => {
    let result = [...rooms];

    // Search query matching (name and description)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (room) =>
          room.name.toLowerCase().includes(q) ||
          room.description.toLowerCase().includes(q)
      );
    }

    // Room Type matching
    if (roomType !== "") {
      result = result.filter((room) => {
        if (roomType === "Oceanfront Deluxe Suite") {
          return room.name.includes("Deluxe Suite");
        }
        if (roomType === "Lagoon Presidential Villa") {
          return room.name.includes("Presidential Villa");
        }
        if (roomType === "Executive Club Room") {
          return room.name.includes("Executive Club Room") || room.name.includes("Club Room");
        }
        if (roomType === "Sunset Junior Suite") {
          return room.name.includes("Junior Suite");
        }
        if (roomType === "Panoramic Penthouse") {
          return room.name.includes("Penthouse");
        }
        return room.name === roomType;
      });
    }

    // Capacity range matching
    if (capacityRange !== "") {
      result = result.filter((room) => {
        if (capacityRange === "1-2") return room.capacity <= 2;
        if (capacityRange === "3-4") return room.capacity >= 3 && room.capacity <= 4;
        if (capacityRange === "5+") return room.capacity >= 5;
        return true;
      });
    }

    // Price limits matching
    if (minPrice !== "") {
      result = result.filter((room) => room.pricePerNight >= minPrice);
    }
    if (maxPrice !== "") {
      result = result.filter((room) => room.pricePerNight <= maxPrice);
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === "rating-desc") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [rooms, searchQuery, roomType, capacityRange, minPrice, maxPrice, sortBy]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredAndSortedRooms.length / ITEMS_PER_PAGE);
  const paginatedRooms = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedRooms.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedRooms, currentPage]);

  return (
    <>
      {/* Filter Controls */}
      <RoomFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roomType={roomType}
        setRoomType={setRoomType}
        capacityRange={capacityRange}
        setCapacityRange={setCapacityRange}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReset={handleResetFilters}
        totalCount={rooms.length}
        filteredCount={filteredAndSortedRooms.length}
      />

      {/* Dynamic States Container */}
      {isLoading ? (
        /* Shimmer Loading State Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/10 p-6 space-y-4 animate-pulse"
            >
              <div className="aspect-[4/3] w-full rounded-2xl bg-white/5" />
              <div className="h-6 w-2/3 rounded-lg bg-white/5" />
              <div className="h-4 w-full rounded-lg bg-white/5" />
              <div className="h-4 w-5/6 rounded-lg bg-white/5" />
              <div className="pt-4 flex justify-between items-center border-t border-white/5">
                <div className="h-8 w-1/3 rounded-lg bg-white/5" />
                <div className="h-10 w-1/4 rounded-full bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredAndSortedRooms.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 rounded-[2.5rem] border border-white/5 bg-slate-900/10 backdrop-blur-md p-10 max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-semibold text-white mb-2">No Suites Available</h3>
          <p className="text-slate-400 text-sm mb-8 leading-6">
            We couldn&apos;t find any luxury suites matching your selected query and filter options. Try expanding your search criteria or resetting filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="rounded-full bg-amber-400 text-slate-950 font-semibold px-6 py-3 transition hover:bg-amber-300 cursor-pointer shadow-lg shadow-amber-500/10"
          >
            Reset All Filters
          </button>
        </motion.div>
      ) : (
        /* Room Grid & Pagination */
        <>
          <motion.div
            layout
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {paginatedRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onViewDetails={setSelectedRoom}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-white/10 bg-white/5 hover:border-amber-400 hover:bg-amber-400 hover:text-slate-950 px-4 py-2.5 text-sm font-semibold transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:hover:text-white cursor-pointer"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`h-10 w-10 rounded-full text-sm font-semibold transition cursor-pointer flex items-center justify-center border ${
                    currentPage === idx + 1
                      ? "bg-amber-400 text-slate-950 border-amber-400"
                      : "border-white/10 hover:border-amber-400 hover:text-amber-300"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full border border-white/10 bg-white/5 hover:border-amber-400 hover:bg-amber-400 hover:text-slate-950 px-4 py-2.5 text-sm font-semibold transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:hover:text-white cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Details Dialog overlay */}
      <RoomDetailModal
        key={selectedRoom?.id || "empty"}
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />
    </>
  );
}
