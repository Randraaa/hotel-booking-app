"use client";

import { FaSearch, FaDollarSign, FaUserFriends, FaSlidersH, FaUndo } from "react-icons/fa";
import { roomTypeOptions } from "@/data/roomTypes";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roomType: string;
  setRoomType: (type: string) => void;
  capacityRange: string;
  setCapacityRange: (range: string) => void;
  minPrice: number | "";
  setMinPrice: (price: number | "") => void;
  maxPrice: number | "";
  setMaxPrice: (price: number | "") => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

export default function RoomFilterBar({
  searchQuery,
  setSearchQuery,
  roomType,
  setRoomType,
  capacityRange,
  setCapacityRange,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  onReset,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  const isFilterActive =
    searchQuery !== "" ||
    roomType !== "" ||
    capacityRange !== "" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    sortBy !== "";

  return (
    <div className="border border-white/10 bg-slate-900/10 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 mb-12 shadow-xl shadow-slate-950/20">
      {/* Search and Matches Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-6 mb-6">
        <div className="relative flex-1 max-w-xl">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
            <FaSearch className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search suites by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-white/10 bg-slate-950/50 pl-11 pr-5 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400 focus:bg-slate-950"
          />
        </div>
        <div className="text-sm text-slate-400">
          Showing <span className="font-semibold text-white">{filteredCount}</span> of{" "}
          <span className="font-semibold text-white">{totalCount}</span> luxury suites
        </div>
      </div>

      {/* Grid of Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 items-end">
        {/* Room Type */}
        <label className="flex flex-col">
          <span className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400 font-medium">
            Room Type
          </span>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm text-white outline-none transition focus:border-amber-400 focus:bg-slate-950 h-11"
          >
            <option value="" className="bg-slate-950 text-white">All Room Types</option>
            {roomTypeOptions.map((option) => (
              <option key={option} value={option} className="bg-slate-950 text-white">
                {option}
              </option>
            ))}
          </select>
        </label>

        {/* Capacity */}
        <label className="flex flex-col">
          <span className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400 font-medium">
            <FaUserFriends className="h-3 w-3 text-amber-300" />
            Capacity
          </span>
          <select
            value={capacityRange}
            onChange={(e) => setCapacityRange(e.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm text-white outline-none transition focus:border-amber-400 focus:bg-slate-950 h-11"
          >
            <option value="" className="bg-slate-950 text-white">Any Capacity</option>
            <option value="1-2" className="bg-slate-950 text-white">1 - 2 Guests</option>
            <option value="3-4" className="bg-slate-950 text-white">3 - 4 Guests</option>
            <option value="5+" className="bg-slate-950 text-white">5+ Guests</option>
          </select>
        </label>

        {/* Price Range */}
        <div className="flex flex-col sm:col-span-2 lg:col-span-1">
          <span className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400 font-medium">
            <FaDollarSign className="h-3 w-3 text-amber-300" />
            Price Range
          </span>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              min={0}
              onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-1/2 rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-amber-400 focus:bg-slate-950 h-11"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              min={0}
              onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-1/2 rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-amber-400 focus:bg-slate-950 h-11"
            />
          </div>
        </div>

        {/* Sort By */}
        <label className="flex flex-col">
          <span className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400 font-medium">
            <FaSlidersH className="h-3 w-3 text-amber-300" />
            Sort By
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm text-white outline-none transition focus:border-amber-400 focus:bg-slate-950 h-11"
          >
            <option value="" className="bg-slate-950 text-white">Default / Featured</option>
            <option value="price-asc" className="bg-slate-950 text-white">Price: Low to High</option>
            <option value="price-desc" className="bg-slate-950 text-white">Price: High to Low</option>
            <option value="rating-desc" className="bg-slate-950 text-white">Rating: Highest First</option>
          </select>
        </label>

        {/* Reset Buttons */}
        <button
          onClick={onReset}
          disabled={!isFilterActive}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/30 py-3 text-sm font-semibold text-slate-300 hover:text-rose-400 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-white/10 disabled:hover:text-slate-300 h-11 cursor-pointer"
        >
          <FaUndo className="h-3.5 w-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
}
