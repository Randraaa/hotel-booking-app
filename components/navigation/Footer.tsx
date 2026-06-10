"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Rooms", href: "#rooms" },
  { label: "Facilities", href: "#facilities" },
  { label: "Offers", href: "#offers" },
];

const socialLinks = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setEmail("");
    }
  };

  return (
    <footer
      id="contact"
      className="relative border-t border-white/10 bg-slate-950 px-6 pt-20 pb-12 md:px-8 overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="pointer-events-none absolute left-0 bottom-0 h-80 w-80 rounded-full bg-rose-500/5 blur-[100px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-amber-500/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 pb-16">
          {/* Brand Col */}
          <div className="space-y-6">
            <Link href="#home" className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-orange-300 to-rose-500 text-base font-semibold text-slate-950 shadow-lg shadow-orange-500/20">
                H
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
                  Hotel Luxe
                </p>
                <p className="text-sm font-semibold text-white">Premium stays</p>
              </div>
            </Link>
            <p className="text-sm leading-6 text-slate-400">
              Crafting bespoke luxury escapes for the modern traveler. Experience unparalleled comfort, Michelin dining, and premium wellness at our beachside sanctuaries.
            </p>
            {/* Social icons */}
            <div className="flex gap-3.5">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 hover:scale-110 hover:border-amber-400 hover:text-amber-300 hover:shadow-lg hover:shadow-amber-500/10"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold text-white mb-6 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3.5 text-sm text-slate-400">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="transition hover:text-amber-300 hover:translate-x-1 inline-block duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/rooms"
                  className="transition hover:text-amber-300 hover:translate-x-1 inline-block duration-300"
                >
                  Explore Rooms
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-base font-semibold text-white mb-6 uppercase tracking-wider">
              Contact Information
            </h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex gap-3.5 items-start">
                <FaMapMarkerAlt className="h-4 w-4 text-amber-300 shrink-0 mt-1" />
                <span className="leading-6">
                  100 Ocean Drive, Miami Beach, FL 33139, USA
                </span>
              </li>
              <li className="flex gap-3.5 items-center">
                <FaPhoneAlt className="h-4 w-4 text-amber-300 shrink-0" />
                <span>+1 (800) 555-LUXE</span>
              </li>
              <li className="flex gap-3.5 items-center">
                <FaEnvelope className="h-4 w-4 text-amber-300 shrink-0" />
                <a
                  href="mailto:reservations@hotelluxe.com"
                  className="transition hover:text-amber-300"
                >
                  reservations@hotelluxe.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-base font-semibold text-white mb-6 uppercase tracking-wider">
              Newsletter
            </h3>
            <p className="text-sm leading-6 text-slate-400 mb-6">
              Subscribe to receive updates about seasonal promotions, culinary events, and wellness retreats.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full border border-white/10 bg-slate-900/60 px-5 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400 focus:bg-slate-900"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-amber-400 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 cursor-pointer"
              >
                Subscribe
              </button>
            </form>

            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3.5 rounded-2xl border border-amber-300/10 bg-amber-300/5 p-4 text-xs leading-5 text-amber-200"
                >
                  Thank you! You have successfully subscribed to our newsletter.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="flex flex-col gap-6 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row sm:justify-between sm:items-center">
          <p>© {new Date().getFullYear()} Hotel Luxe. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition duration-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-300 transition duration-300">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
