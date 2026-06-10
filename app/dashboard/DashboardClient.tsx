"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ProfileOverview from "@/components/dashboard/ProfileOverview";
import BookingsList from "@/components/dashboard/BookingsList";
import FavoriteRooms from "@/components/dashboard/FavoriteRooms";
import SettingsPanel from "@/components/dashboard/SettingsPanel";
import { getFeaturedRooms } from "@/services/rooms";
import { cancelBooking } from "@/services/bookings";
import type { Room } from "@/types/room";
import type { Booking } from "@/types/booking";
import { FiUser, FiCalendar, FiHeart, FiSettings } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardClient() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Client-side authentication guard redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  // Load resources & seed if empty
  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    getFeaturedRooms()
      .then((data) => {
        setRooms(data);

        // 1. Stays / bookings loading and seeding
        const storedBookings = localStorage.getItem("luxe-reservations");
        if (!storedBookings && data.length > 0) {
          const today = new Date();
          
          const checkInUpcoming = new Date();
          checkInUpcoming.setDate(today.getDate() + 5);
          const checkOutUpcoming = new Date();
          checkOutUpcoming.setDate(today.getDate() + 8);
          
          const checkInPast1 = new Date();
          checkInPast1.setDate(today.getDate() - 15);
          const checkOutPast1 = new Date();
          checkOutPast1.setDate(today.getDate() - 12);
          
          const checkInPast2 = new Date();
          checkInPast2.setDate(today.getDate() - 45);
          const checkOutPast2 = new Date();
          checkOutPast2.setDate(today.getDate() - 41);

          const formatDate = (date: Date) => date.toISOString().split("T")[0];

          const seedBookings: Booking[] = [
            {
              id: "HL-729482",
              confirmationNumber: "HL-729482",
              destination: "Miami Beach, FL",
              checkIn: formatDate(checkInUpcoming),
              checkOut: formatDate(checkOutUpcoming),
              guests: 2,
              roomType: data[0].name,
              roomId: data[0].id,
              fullName: user?.name || "Alex Vance",
              email: user?.email || "guest@hotelluxe.com",
              phone: "+1 (555) 019-2834",
              totalPrice: data[0].pricePerNight * 3 + 120,
              nights: 3,
              status: "upcoming",
              createdAt: new Date().toISOString(),
            },
            {
              id: "HL-482019",
              confirmationNumber: "HL-482019",
              destination: "Miami Beach, FL",
              checkIn: formatDate(checkInPast1),
              checkOut: formatDate(checkOutPast1),
              guests: 2,
              roomType: data[1] ? data[1].name : data[0].name,
              roomId: data[1] ? data[1].id : data[0].id,
              fullName: user?.name || "Alex Vance",
              email: user?.email || "guest@hotelluxe.com",
              phone: "+1 (555) 019-2834",
              totalPrice: (data[1] ? data[1].pricePerNight : data[0].pricePerNight) * 3 + 120,
              nights: 3,
              status: "completed",
              createdAt: new Date().toISOString(),
            },
            {
              id: "HL-193829",
              confirmationNumber: "HL-193829",
              destination: "Miami Beach, FL",
              checkIn: formatDate(checkInPast2),
              checkOut: formatDate(checkOutPast2),
              guests: 1,
              roomType: data[2] ? data[2].name : data[0].name,
              roomId: data[2] ? data[2].id : data[0].id,
              fullName: user?.name || "Alex Vance",
              email: user?.email || "guest@hotelluxe.com",
              phone: "+1 (555) 019-2834",
              totalPrice: (data[2] ? data[2].pricePerNight : data[0].pricePerNight) * 4 + 150,
              nights: 4,
              status: "completed",
              createdAt: new Date().toISOString(),
            },
          ];
          
          localStorage.setItem("luxe-reservations", JSON.stringify(seedBookings));
          setBookings(seedBookings);
        } else if (storedBookings) {
          setBookings(JSON.parse(storedBookings));
        }

        // 2. Favorites loading and seeding
        const storedFavorites = localStorage.getItem("luxe-favorites");
        if (!storedFavorites && data.length > 0) {
          const seedFavs = [data[0].id];
          if (data[1]) seedFavs.push(data[1].id);
          localStorage.setItem("luxe-favorites", JSON.stringify(seedFavs));
          setFavorites(seedFavs);
        } else if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }

        setIsLoadingData(false);
      })
      .catch((err) => {
        console.error("Dashboard page data load error:", err);
        setIsLoadingData(false);
      });
  }, [isAuthenticated, authLoading, user]);

  // Handle stay cancellation
  const handleCancelBooking = async (confCode: string) => {
    const success = await cancelBooking(confCode);
    if (success) {
      const stored = localStorage.getItem("luxe-reservations");
      if (stored) {
        setBookings(JSON.parse(stored));
      }
    }
  };

  // Toggle Favorite Room bookmark
  const handleToggleFavorite = (roomId: string) => {
    let updated: string[];
    if (favorites.includes(roomId)) {
      updated = favorites.filter((id) => id !== roomId);
    } else {
      updated = [...favorites, roomId];
    }
    localStorage.setItem("luxe-favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  // Mobile navigation tabs data
  const mobileMenuItems = [
    { id: "overview", label: "Overview", icon: FiUser },
    { id: "bookings", label: "Bookings", icon: FiCalendar },
    { id: "favorites", label: "Favorites", icon: FiHeart },
    { id: "settings", label: "Settings", icon: FiSettings },
  ];

  if (authLoading || isLoadingData || !isAuthenticated) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
        <p className="mt-4 text-sm text-slate-400 font-medium tracking-wide">
          Accessing luxury dashboard workspace...
        </p>
      </div>
    );
  }

  // Active Panel Swapper
  const renderActivePanel = () => {
    switch (activeTab) {
      case "overview":
        return (
          <ProfileOverview
            bookings={bookings}
            favoritesCount={favorites.length}
            rooms={rooms}
            setActiveTab={setActiveTab}
          />
        );
      case "bookings":
        return (
          <BookingsList
            bookings={bookings}
            rooms={rooms}
            onCancelBooking={handleCancelBooking}
          />
        );
      case "favorites":
        return (
          <FavoriteRooms
            rooms={rooms}
            favoriteIds={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case "settings":
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 md:py-12 md:px-8">
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sidebar on Desktop */}
        <div className="md:col-span-4 lg:col-span-3 md:sticky md:top-28">
          <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Right Column: Active view & Content container */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col h-full">
          {/* Mobile Tabbed Switcher Navigation */}
          <div className="flex md:hidden overflow-x-auto gap-2 pb-3 border-b border-white/10 mb-6 scrollbar-none">
            {mobileMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-full border transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-amber-400 border-amber-400 text-slate-950 shadow-md shadow-amber-500/10"
                      : "bg-slate-900/40 border-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Animation transition container for swapping tabs */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {renderActivePanel()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
