"use client";

import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    rating: 5,
    text: "An absolutely stunning experience. The Lagoon Presidential Villa was pure bliss. The service was impeccable; the butler staff anticipated our every need. We will definitely return next season!",
    name: "Evelyn Kensington",
    designation: "Luxury Travel Journalist",
    avatar: "/images/avatar_evelyn.png",
  },
  {
    rating: 5,
    text: "The attention to detail is what sets Hotel Luxe apart. From the Michelin-starred dining experience to the soothing spa treatments, every moment felt completely curated for our comfort and relaxation.",
    name: "Alexander Vance",
    designation: "Tech Entrepreneur & Investor",
    avatar: "/images/avatar_alexander.png",
  },
  {
    rating: 5,
    text: "Breathtaking sunset views, high-tech suites with ultra-fast WiFi, and the friendliest concierge I have ever encountered. This resort truly sets a new standard for luxury hospitality worldwide.",
    name: "Sophia Martinez",
    designation: "Fine Arts Creative Director",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
  },
];

export default function Testimonials() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  } as const;

  return (
    <section className="relative px-6 py-24 md:px-8 bg-slate-950 overflow-hidden border-t border-white/5">
      {/* Decorative backdrop glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-rose-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
            Guest Experience
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            What Our Guests Say
          </h2>
          <div className="mt-4 h-0.5 w-16 bg-rose-500/50 mx-auto rounded-full" />
          <p className="mt-6 text-sm leading-6 text-slate-400">
            Hear from distinguished guests about their unforgettable memories and bespoke experiences at Hotel Luxe.
          </p>
        </div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((test, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/10 p-8 md:p-10 transition-all duration-500 hover:border-amber-400/20 hover:bg-slate-900/40"
            >
              {/* Huge subtle quote mark */}
              <span className="absolute right-6 top-4 text-white/5 text-8xl font-serif select-none pointer-events-none transition-transform duration-500 group-hover:scale-110">
                ”
              </span>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-6 text-amber-400">
                {Array.from({ length: test.rating }).map((_, starIdx) => (
                  <FaStar key={starIdx} className="h-4 w-4 fill-current" />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="relative text-base leading-7 text-slate-300 italic mb-8 z-10">
                <FaQuoteLeft className="inline h-3 w-3 text-amber-300/60 align-top mr-2 -mt-1" />
                {test.text}
              </blockquote>

              {/* User profile */}
              <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-amber-400/30">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors duration-300">
                    {test.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{test.designation}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
