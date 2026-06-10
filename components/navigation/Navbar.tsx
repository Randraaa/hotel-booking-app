"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";
import { getLocalWeather } from "@/services/weather";
import type { Weather } from "@/types/weather";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "Rooms", href: "/#rooms" },
  { label: "Facilities", href: "/#facilities" },
  { label: "Offers", href: "/#offers" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    getLocalWeather("Miami, FL")
      .then((data) => setWeather(data))
      .catch((err) => console.error("Navbar weather error:", err));
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        <div className="flex items-center gap-5">
          <Link href="/#home" className="flex items-center gap-3 text-white">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-orange-300 to-rose-500 text-lg font-semibold text-slate-950 shadow-lg shadow-orange-500/20">
              H
            </span>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
                Hotel Luxe
              </p>
              <p className="text-base font-semibold text-white">
                Premium stays
              </p>
            </div>
          </Link>

          {weather && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 shadow-inner">
              <span className="text-sm animate-pulse">{weather.icon}</span>
              <span className="font-medium">Miami: {weather.temperature}°F</span>
            </div>
          )}
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/rooms"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white transition hover:border-white/20 hover:bg-white/10"
          >
            Explore rooms
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-3 border-l border-white/15 pl-4">
              <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full border border-amber-400 object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-xs font-bold text-slate-950 shadow-md">
                    {user?.name.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
                <span className="text-xs font-semibold text-slate-300 max-w-[90px] truncate">
                  {user?.name}
                </span>
              </Link>
              <button
                onClick={logout}
                className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:border-rose-500/20 hover:bg-rose-500/5 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              Sign In
            </Link>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-white/20 hover:bg-white/10 md:hidden"
          aria-label="Open navigation menu"
        >
          <FiMenu className="h-5 w-5" />
        </button>
      </div>
    </motion.header>
  );
}
