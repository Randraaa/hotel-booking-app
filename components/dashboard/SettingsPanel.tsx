"use client";

import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiBell, FiCheck, FiInfo } from "react-icons/fi";

interface SettingsFormInputs {
  name: string;
  email: string;
  phone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
}

export default function SettingsPanel() {
  const { user, updateUser } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize Form with context values
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SettingsFormInputs>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
    },
  });

  // Re-sync values if user object changes
  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("phone", user.phone || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data: SettingsFormInputs) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API saving latency
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      updateUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile settings:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl text-left">
      <div>
        <h3 className="text-lg font-bold text-white tracking-wide">Account Settings</h3>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal details, contact coordinates, and email notifications
        </p>
      </div>

      {showSuccess && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-400 flex items-center gap-2.5 animate-fadeIn">
          <FiCheck className="h-4 w-4 shrink-0" />
          <span>Profile changes saved successfully! Navbar and session are synchronized.</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Core Profile Credentials */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/10 p-6 md:p-8 backdrop-blur-md shadow-xl space-y-5">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-white/5 pb-3">
            Profile Details
          </h4>

          {/* Name Field */}
          <label className="flex flex-col">
            <span className="mb-2 flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wide">
              <FiUser className="h-3.5 w-3.5 text-amber-300" />
              Full Name
            </span>
            <input
              type="text"
              {...register("name", {
                required: "Full name is required",
                minLength: { value: 3, message: "Name must be at least 3 characters" },
              })}
              className={`rounded-xl border bg-slate-950/50 p-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-amber-400 focus:bg-slate-950 h-12 ${
                errors.name ? "border-rose-500" : "border-white/10"
              }`}
            />
            {errors.name && (
              <span className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                <FiInfo className="h-3 w-3 shrink-0" />
                {errors.name.message}
              </span>
            )}
          </label>

          {/* Email Field */}
          <label className="flex flex-col">
            <span className="mb-2 flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wide">
              <FiMail className="h-3.5 w-3.5 text-amber-300" />
              Email Address
            </span>
            <input
              type="email"
              {...register("email", {
                required: "Email address is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email format",
                },
              })}
              className={`rounded-xl border bg-slate-950/50 p-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-amber-400 focus:bg-slate-950 h-12 ${
                errors.email ? "border-rose-500" : "border-white/10"
              }`}
            />
            {errors.email && (
              <span className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                <FiInfo className="h-3 w-3 shrink-0" />
                {errors.email.message}
              </span>
            )}
          </label>

          {/* Phone Field */}
          <label className="flex flex-col">
            <span className="mb-2 flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wide">
              <FiPhone className="h-3.5 w-3.5 text-amber-300" />
              Phone Number
            </span>
            <input
              type="tel"
              placeholder="+1 (555) 123-4567"
              {...register("phone", {
                minLength: { value: 7, message: "Phone number too short" },
              })}
              className={`rounded-xl border bg-slate-950/50 p-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-amber-400 focus:bg-slate-950 h-12 ${
                errors.phone ? "border-rose-500" : "border-white/10"
              }`}
            />
            {errors.phone && (
              <span className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                <FiInfo className="h-3 w-3 shrink-0" />
                {errors.phone.message}
              </span>
            )}
          </label>
        </div>

        {/* Notifications Preferences */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/10 p-6 md:p-8 backdrop-blur-md shadow-xl space-y-4">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2">
            <FiBell className="h-4 w-4 text-amber-300" />
            Communication Settings
          </h4>

          {/* Email notifications checkbox */}
          <label className="flex items-center gap-3 py-1 cursor-pointer">
            <input
              type="checkbox"
              {...register("emailNotifications")}
              className="h-4 w-4 rounded border-white/10 bg-slate-950 text-amber-400 focus:ring-amber-400 focus:ring-opacity-25"
            />
            <div className="text-xs">
              <span className="block text-white font-medium">Booking Confirmations & Receipts</span>
              <span className="text-slate-400">Receive transactional vouchers and check-in updates</span>
            </div>
          </label>

          {/* SMS notifications checkbox */}
          <label className="flex items-center gap-3 py-1 cursor-pointer">
            <input
              type="checkbox"
              {...register("smsNotifications")}
              className="h-4 w-4 rounded border-white/10 bg-slate-950 text-amber-400 focus:ring-amber-400 focus:ring-opacity-25"
            />
            <div className="text-xs">
              <span className="block text-white font-medium">SMS Reservation Reminders</span>
              <span className="text-slate-400">Get check-in alerts and front-desk notifications via mobile text</span>
            </div>
          </label>

          {/* Marketing emails checkbox */}
          <label className="flex items-center gap-3 py-1 cursor-pointer">
            <input
              type="checkbox"
              {...register("marketingEmails")}
              className="h-4 w-4 rounded border-white/10 bg-slate-950 text-amber-400 focus:ring-amber-400 focus:ring-opacity-25"
            />
            <div className="text-xs">
              <span className="block text-white font-medium">Special Offers & Seasonal Promos</span>
              <span className="text-slate-400">Receive boutique resort packages and member discount newsletter</span>
            </div>
          </label>
        </div>

        {/* Submit settings changes button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-amber-400 px-8 py-3.5 text-xs font-semibold text-slate-950 transition hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer h-12"
        >
          {isSubmitting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}
