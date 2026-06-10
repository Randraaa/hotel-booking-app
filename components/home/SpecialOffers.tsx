"use client";

import { motion } from "framer-motion";
import { FaCheckCircle, FaPercentage, FaSpa } from "react-icons/fa";

const offers = [
  {
    badge: "Limited Time Offer",
    title: "Early Escape Sanctuary",
    discount: "Save 20% Off",
    description:
      "Plan ahead and reserve your luxury stay 30 days in advance to unlock exclusive rates and complimentary daily breakfast.",
    benefits: [
      "20% off standard suite rates",
      "Daily gourmet breakfast for two",
      "Complimentary late checkout (until 2 PM)",
    ],
    targetRoom: "Oceanfront Deluxe Suite",
    icon: FaPercentage,
    bgGradient: "from-amber-600/20 via-orange-600/10 to-transparent",
    borderHover: "hover:border-amber-400/30",
    badgeBg: "bg-amber-400/90 text-slate-950",
  },
  {
    badge: "Exclusive Experience",
    title: "Sensory Wellness Retreat",
    discount: "Complimentary Spa & Champagne",
    description:
      "Indulge in absolute rejuvenation. Book any villa for 3+ nights and enjoy a couples therapy session and premium champagne on arrival.",
    benefits: [
      "Free 60-minute holistic massage",
      "Welcome bottle of chilled French Champagne",
      "Access to private thermal suite & sauna",
    ],
    targetRoom: "Lagoon Presidential Villa",
    icon: FaSpa,
    bgGradient: "from-rose-600/20 via-pink-600/10 to-transparent",
    borderHover: "hover:border-rose-400/30",
    badgeBg: "bg-rose-500/90 text-white",
  },
];

export default function SpecialOffers() {
  const handleClaimOffer = (targetRoom: string) => {
    // Select the recommended room in the booking form
    window.dispatchEvent(
      new CustomEvent("select-room-type", { detail: { roomType: targetRoom } })
    );
    // Smooth scroll to booking
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  } as const;

  return (
    <section
      id="offers"
      className="relative px-6 py-24 md:px-8 bg-slate-950 overflow-hidden border-t border-white/5"
    >
      {/* Decorative backdrop glow */}
      <div className="pointer-events-none absolute left-0 bottom-0 h-96 w-96 rounded-full bg-orange-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-amber-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
              Exclusive Packages
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Special Offers & Escapes
            </h2>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400 md:mt-0">
            Take advantage of our limited-time promotional rates and curated resort experiences to craft the ultimate getaway.
          </p>
        </div>

        {/* Offers Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {offers.map((offer, idx) => {
            const Icon = offer.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className={`group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/10 p-8 md:p-12 transition-all duration-500 ${offer.borderHover} bg-gradient-to-br ${offer.bgGradient}`}
              >
                {/* Floating badge */}
                <span
                  className={`inline-block rounded-full ${offer.badgeBg} px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider mb-6`}
                >
                  {offer.badge}
                </span>

                {/* Offer details */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-amber-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors duration-300">
                      {offer.title}
                    </h3>
                    <p className="text-amber-300 font-semibold text-lg mt-1">
                      {offer.discount}
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-6 text-slate-400 mb-8 max-w-lg">
                  {offer.description}
                </p>

                {/* Benefits list */}
                <ul className="space-y-3.5 mb-10 text-sm text-slate-300">
                  {offer.benefits.map((benefit, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-3">
                      <FaCheckCircle className="h-4.5 w-4.5 text-amber-400/80 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Claim CTA */}
                <button
                  onClick={() => handleClaimOffer(offer.targetRoom)}
                  className="w-full inline-flex items-center justify-center rounded-full bg-white text-slate-950 py-3.5 px-6 text-sm font-semibold hover:bg-amber-400 transition-all duration-300 cursor-pointer shadow-lg shadow-slate-950/20"
                >
                  Claim Offer & Book
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
