"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import landingImage from "@/public/images/bgift-social-media-landing.webp";
import Plasma from "../Plasma/Plasma";

const HeroSection = () => {
  return (
    <section className=" flex flex-col items-center justify-center text-center overflow-hidden bg-black min-h-screen px-6 md:px-12 pt-32 pb-20">
      {/* 🔮 Plasma Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Plasma
          color="#7b6ef6"
          speed={0.4}
          direction="forward"
          scale={0.5}
          opacity={1}
          mouseInteractive={false}
        />
      </div>

      {/* ✨ Gradient Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[370px] sm:w-[400px] md:w-[600px] h-[700px] bg-gradient-to-tr from-indigo-500/30 to-purple-600/20 blur-[160px] rounded-full z-0" />

      {/* 🧠 Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-white max-w-4xl"
      >
        Connect Smarter.
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500">
          Grow Together.
        </span>
      </motion.h1>

      {/* 💬 Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="relative z-10 mt-6 text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed"
      >
        BGIFT is your next-generation social network — powered by AI to help you
        build meaningful connections, share your voice, and inspire others.
      </motion.p>

      {/* 🚀 Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="relative z-10 mt-10 flex flex-wrap gap-5 justify-center"
      >
        <Link
          href="/login"
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/20 hover:scale-105 hover:shadow-blue-500/40 transition-transform duration-300"
        >
          Join Now
        </Link>
        <Link
          href="#features"
          className="px-8 py-3.5 rounded-xl border border-gray-600/50 text-gray-200 hover:bg-white/10 backdrop-blur-sm font-medium transition-all duration-300"
        >
          Learn More
        </Link>
      </motion.div>

      {/* 🖼️ App Preview */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mt-24 w-full max-w-5xl"
      >
        <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-900/40 backdrop-blur-md">
          <Image
            src={landingImage}
            alt="BGIFT App Preview"
            width={1200}
            height={700}
            className="w-full h-auto"
            priority
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
