"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryProps {
  images: string[];
}

export default function RoomDetailsGallery({ images }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={images[activeIndex]}
            alt={`Room showcase ${activeIndex + 1}`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails Row */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-slate-900 transition-all duration-300 cursor-pointer ${
              activeIndex === idx
                ? "border-amber-400 ring-2 ring-amber-400/20"
                : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/20"
            }`}
          >
            <img
              src={img}
              alt={`Room preview ${idx + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
