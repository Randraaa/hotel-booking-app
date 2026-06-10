"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaInfoCircle, FaPaperPlane } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";

interface ForgotPasswordInputs {
  email: string;
}

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>({
    defaultValues: {
      email: "",
    },
  });

  const watchedEmail = watch("email");

  const onSubmit = async (data: ForgotPasswordInputs) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const success = await forgotPassword(data.email);
      if (success) {
        setIsSubmitted(true);
      } else {
        setErrorMsg("Failed to dispatch password recovery link.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred.";
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
            <h1 className="mt-3 text-3xl font-bold text-white tracking-tight">Recover Password</h1>
            <p className="mt-2 text-slate-400 text-sm">Retrieve access to your Hotel Luxe account.</p>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs text-rose-300 mb-6 flex items-start gap-2.5">
              <FaInfoCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSubmitted ? (
            /* Recovery Dispatch Success Banner */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-5">
                <FaCheckCircle className="h-5.5 w-5.5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Recovery Email Sent</h3>
              <p className="text-slate-400 text-xs leading-5 mb-8">
                An email containing password recovery procedures has been dispatched to{" "}
                <span className="font-semibold text-white">{watchedEmail}</span>. Check your inbox and spam folders.
              </p>
              
              <Link
                href="/login"
                className="w-full rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 py-3 text-xs font-semibold transition inline-flex justify-center items-center gap-1.5 cursor-pointer shadow"
              >
                <FaArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Login</span>
              </Link>
            </motion.div>
          ) : (
            /* Reset Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

              {/* Submit Dispatch */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-amber-400 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-12 shadow-lg"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                ) : (
                  <span className="flex items-center gap-2">
                    Send Recovery Link <FaPaperPlane className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>

              {/* Back to sign in */}
              <div className="text-center pt-2">
                <Link href="/login" className="text-slate-500 hover:text-white transition duration-300 text-xs font-semibold inline-flex items-center gap-1.5">
                  <FaArrowLeft className="h-3 w-3" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
