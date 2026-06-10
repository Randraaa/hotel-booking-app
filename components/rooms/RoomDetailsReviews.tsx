"use client";

import { motion } from "framer-motion";
import { FaStar, FaUser } from "react-icons/fa";
import type { Review } from "@/types/room";

interface ReviewsProps {
  reviews: Review[];
  rating: number;
  reviewsCount?: number;
}

export default function RoomDetailsReviews({ reviews, rating, reviewsCount }: ReviewsProps) {
  // Hardcoded luxury distribution representation to mimic complex reviews systems
  const distribution = [
    { stars: 5, percentage: 92 },
    { stars: 4, percentage: 6 },
    { stars: 3, percentage: 2 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const reviewVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  } as const;

  return (
    <div className="space-y-10 border-t border-white/5 pt-10">
      <div>
        <h3 className="text-xl font-semibold text-white uppercase tracking-wider mb-2">Guest Feedback</h3>
        <p className="text-slate-400 text-sm">Hear what verified travelers say about their luxury stay experience.</p>
      </div>

      {/* Ratings Summary Header Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 rounded-3xl border border-white/5 bg-slate-900/10 p-6 md:p-8 items-center">
        {/* Overall Score */}
        <div className="text-center md:border-r border-white/5 py-4">
          <span className="text-5xl md:text-6xl font-bold text-white tracking-tight">{rating.toFixed(1)}</span>
          <span className="text-slate-500 text-sm block mt-2">out of 5.0 stars</span>
          <div className="flex items-center justify-center gap-1 mt-3 text-amber-400">
            {Array.from({ length: 5 }).map((_, idx) => (
              <FaStar key={idx} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <span className="text-slate-400 text-xs mt-3 block font-semibold uppercase tracking-wider">
            {reviewsCount || reviews.length} Total Reviews
          </span>
        </div>

        {/* Rating Distribution Progress Bars */}
        <div className="md:col-span-2 space-y-2.5">
          {distribution.map((dist) => (
            <div key={dist.stars} className="flex items-center gap-4 text-xs font-semibold text-slate-400">
              <span className="w-12 flex items-center gap-1">
                {dist.stars} <FaStar className="h-3 w-3 text-amber-400 fill-current" />
              </span>
              
              {/* Outer bar */}
              <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                {/* Inner progress */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${dist.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  className="h-full rounded-full bg-amber-400/90"
                />
              </div>

              <span className="w-8 text-right text-slate-500">{dist.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Reviews List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="space-y-6"
      >
        {reviews.map((rev, idx) => (
          <motion.div
            key={idx}
            variants={reviewVariants}
            className="rounded-3xl border border-white/5 bg-slate-900/10 p-6 hover:bg-slate-900/20 transition-all duration-300"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                {rev.avatar ? (
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-white/10">
                    <img src={rev.avatar} alt={rev.author} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-400 border border-white/10">
                    <FaUser className="h-4 w-4" />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-white">{rev.author}</h4>
                  <span className="text-[10px] text-slate-500 block">{rev.date}</span>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: rev.rating }).map((_, starIdx) => (
                  <FaStar key={starIdx} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
            </div>

            {/* Comment */}
            <p className="text-sm leading-6 text-slate-400 italic">
              &quot;{rev.comment}&quot;
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
