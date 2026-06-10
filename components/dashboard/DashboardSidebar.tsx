"use client";

import { useAuth } from "@/context/AuthContext";
import {
  FiUser,
  FiCalendar,
  FiHeart,
  FiSettings,
  FiLogOut,
  FiAward,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useState } from "react";
import { motion } from "framer-motion";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function DashboardSidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "overview", label: "Overview", icon: FiUser },
    { id: "bookings", label: "My Bookings", icon: FiCalendar },
    { id: "favorites", label: "Favorite Rooms", icon: FiHeart },
    { id: "settings", label: "Settings", icon: FiSettings },
  ];

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div
      className={`relative flex flex-col h-full bg-slate-900/40 border border-white/10 backdrop-blur-xl transition-all duration-300 rounded-[2rem] overflow-hidden ${
        isCollapsed ? "w-20" : "w-64"
      } hidden md:flex`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-6 -right-0.5 z-20 flex h-8 w-8 items-center justify-center rounded-l-full border border-white/10 bg-slate-950 text-slate-400 hover:text-white transition cursor-pointer"
      >
        {isCollapsed ? <FiChevronRight className="h-4 w-4" /> : <FiChevronLeft className="h-4 w-4" />}
      </button>

      {/* Profile Header */}
      <div className={`p-6 border-b border-white/10 flex flex-col items-center ${isCollapsed ? "pb-6" : "pb-8"}`}>
        <div className="relative">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className={`rounded-full border-2 border-amber-400 object-cover transition-all ${
                isCollapsed ? "h-10 w-10" : "h-16 w-16"
              }`}
            />
          ) : (
            <span
              className={`flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 font-bold text-slate-950 shadow-lg shadow-orange-500/20 transition-all ${
                isCollapsed ? "h-10 w-10 text-sm" : "h-16 w-16 text-xl"
              }`}
            >
              {getInitials(user?.name || "")}
            </span>
          )}
          
          {/* Active status dot */}
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
        </div>

        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 text-center w-full"
          >
            <h4 className="text-sm font-bold text-white truncate px-2">{user?.name}</h4>
            <p className="text-xs text-slate-400 truncate px-2 mt-0.5">{user?.email}</p>
            
            {/* Loyalty Gold Tier Badge */}
            <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold text-amber-300">
              <FiAward className="h-3 w-3" />
              <span>Gold Tier Member</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl transition cursor-pointer group ${
                isActive
                  ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-slate-950" : "text-slate-400 group-hover:text-white"}`} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition cursor-pointer`}
        >
          <FiLogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              Sign Out
            </motion.span>
          )}
        </button>
      </div>
    </div>
  );
}
