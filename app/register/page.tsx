"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaUserPlus, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";

interface RegisterInputs {
  name: string;
  email: string;
  password:  string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerSession, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: RegisterInputs) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const success = await registerSession(data.name, data.email, data.password);
      if (success) {
        router.push("/");
      } else {
        setErrorMsg("Failed to create account. Please check your information.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred during registration.";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center py-20 px-6 relative overflow-hidden">
        {/* Decorative backdrop gradients */}
        <div className="pointer-events-none absolute left-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-amber-500/5 blur-[100px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-rose-500/5 blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md rounded-[2.5rem] border border-white/10 bg-slate-900/10 p-8 md:p-10 backdrop-blur-md shadow-2xl relative"
        >
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Sanctuary Club</p>
            <h1 className="mt-3 text-3xl font-bold text-white tracking-tight">Create Account</h1>
            <p className="mt-2 text-slate-400 text-sm">Join to unlock member privileges and rates.</p>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs text-rose-300 mb-6 flex items-start gap-2.5">
              <FaInfoCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <label className="flex flex-col">
              <span className="mb-2 flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wide">
                <FaUser className="h-3 w-3 text-amber-300" />
                Full Name
              </span>
              <input
                type="text"
                placeholder="John Doe"
                {...register("name", {
                  required: "Full name is required",
                  minLength: { value: 3, message: "Name must be at least 3 characters" },
                })}
                className={`rounded-xl border bg-slate-950/60 p-3.5 text-sm text-white placeholder-slate-700 outline-none transition focus:border-amber-400 focus:bg-slate-950 h-12 ${
                  errors.name ? "border-rose-500" : "border-white/10"
                }`}
              />
              {errors.name && (
                <span className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                  <FaInfoCircle className="h-3 w-3" />
                  {errors.name.message}
                </span>
              )}
            </label>

            {/* Email */}
            <label className="flex flex-col">
              <span className="mb-2 flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wide">
                <FaEnvelope className="h-3 w-3 text-amber-300" />
                Email Address
              </span>
              <input
                type="email"
                placeholder="name@example.com"
                {...register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address format",
                  },
                })}
                className={`rounded-xl border bg-slate-950/60 p-3.5 text-sm text-white placeholder-slate-700 outline-none transition focus:border-amber-400 focus:bg-slate-950 h-12 ${
                  errors.email ? "border-rose-500" : "border-white/10"
                }`}
              />
              {errors.email && (
                <span className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                  <FaInfoCircle className="h-3 w-3" />
                  {errors.email.message}
                </span>
              )}
            </label>

            {/* Password */}
            <label className="flex flex-col">
              <span className="mb-2 flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wide">
                <FaLock className="h-3 w-3 text-amber-300" />
                Password
              </span>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                className={`rounded-xl border bg-slate-950/60 p-3.5 text-sm text-white placeholder-slate-700 outline-none transition focus:border-amber-400 focus:bg-slate-950 h-12 ${
                  errors.password ? "border-rose-500" : "border-white/10"
                }`}
              />
              {errors.password && (
                <span className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                  <FaInfoCircle className="h-3 w-3" />
                  {errors.password.message}
                </span>
              )}
            </label>

            {/* Confirm Password */}
            <label className="flex flex-col">
              <span className="mb-2 flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wide">
                <FaLock className="h-3 w-3 text-amber-300" />
                Confirm Password
              </span>
              <input
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (val, formValues) =>
                    val === formValues.password || "Passwords do not match",
                })}
                className={`rounded-xl border bg-slate-950/60 p-3.5 text-sm text-white placeholder-slate-700 outline-none transition focus:border-amber-400 focus:bg-slate-950 h-12 ${
                  errors.confirmPassword ? "border-rose-500" : "border-white/10"
                }`}
              />
              {errors.confirmPassword && (
                <span className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                  <FaInfoCircle className="h-3 w-3" />
                  {errors.confirmPassword.message}
                </span>
              )}
            </label>

            {/* Agree to terms */}
            <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-slate-400 leading-5">
              <input
                type="checkbox"
                {...register("agreeTerms", { required: "You must agree to the Terms & Conditions" })}
                className="rounded border-white/10 bg-slate-950/60 text-amber-400 focus:ring-0 focus:ring-offset-0 h-4 w-4 mt-0.5"
              />
              <div>
                <span>I agree to the </span>
                <a href="#" className="text-amber-300 hover:underline">Terms of Service</a>
                <span> and </span>
                <a href="#" className="text-amber-300 hover:underline">Privacy Policy</a>
                {errors.agreeTerms && (
                  <span className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <FaInfoCircle className="h-3 w-3" />
                    {errors.agreeTerms.message}
                  </span>
                )}
              </div>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 rounded-full bg-amber-400 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-12 shadow-lg"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              ) : (
                <span className="flex items-center gap-2">
                  Create Account <FaUserPlus className="h-4.5 w-4.5" />
                </span>
              )}
            </button>
          </form>

          {/* Redirect to login */}
          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-300 hover:text-white transition duration-300 font-semibold inline-flex items-center gap-1">
              Sign in <FaArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
