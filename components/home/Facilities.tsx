"use client";

import { motion } from "framer-motion";
import {
  FaSwimmer,
  FaSpa,
  FaUtensils,
  FaDumbbell,
  FaShuttleVan,
  FaWifi,
} from "react-icons/fa";

const facilities = [
  {
    icon: FaSwimmer,
    title: "Swimming Pool",
    description:
      "Infinity edge pool overlooking the azure coastline, featuring heated waters, private luxury cabanas, and custom poolside mixology services.",
  },
  {
    icon: FaSpa,
    title: "Spa & Wellness",
    description:
      "An oasis of pure serenity offering holistic skincare therapies, deep-tissue hot stone massages, steam rooms, and restorative mindfulness retreats.",
  },
  {
    icon: FaUtensils,
    title: "Fine Dining Restaurant",
    description:
      "A culinary journey curated by Michelin-starred chefs, celebrating seasonal local organic ingredients paired with an award-winning vintage wine list.",
  },
  {
    icon: FaDumbbell,
    title: "Fitness Center",
    description:
      "Fully equipped fitness studio featuring state-of-the-art strength training, Peloton bikes, cardio equipment, and certified private trainers.",
  },
  {
    icon: FaShuttleVan,
    title: "Airport Shuttle",
    description:
      "Seamless private transport in our premium electric sedan and shuttle fleet directly to and from the terminal with dedicated luggage handling.",
  },
  {
    icon: FaWifi,
    title: "Ultra-Speed WiFi",
    description:
      "Complimentary high-speed fiber-optic network covering all private suites, shared lounges, conference areas, and beachfront properties.",
  },
];

export default function Facilities() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  } as const;

  return (
    <section
      id="facilities"
      className="relative px-6 py-24 md:px-8 bg-slate-950 overflow-hidden border-t border-white/5"
    >
      {/* Dynamic Background Accents */}
      <div className="pointer-events-none absolute left-0 top-1/4 h-80 w-80 rounded-full bg-orange-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-10 bottom-1/4 h-80 w-80 rounded-full bg-amber-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
            Unrivaled Amenities
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            World-Class Hotel Facilities
          </h2>
          <div className="mt-4 h-0.5 w-16 bg-amber-400/50 mx-auto rounded-full" />
          <p className="mt-6 text-sm leading-6 text-slate-400">
            From gourmet gastronomy to restorative wellness rituals, enjoy premium services designed to make your luxury getaway unforgettable.
          </p>
        </div>

        {/* Facilities Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/10 p-8 transition-all duration-500 hover:border-amber-400/20 hover:bg-slate-900/40 hover:shadow-2xl"
              >
                {/* Radial Glow on hover */}
                <div className="absolute -inset-px bg-gradient-to-br from-amber-400/0 via-amber-400/0 to-amber-400/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-[2rem]" />

                {/* Icon Circle */}
                <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-amber-300 transition-all duration-500 group-hover:bg-amber-400 group-hover:text-slate-950 group-hover:scale-110 shadow-inner">
                  <Icon className="h-6 w-6 transition-transform duration-500 group-hover:rotate-12" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-300 transition-colors duration-300">
                  {fac.title}
                </h3>
                <p className="text-sm leading-6 text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                  {fac.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
