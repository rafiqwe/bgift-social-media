"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="relative w-[90%] rounded-2xl py-14 mx-auto mb-7 bg-gradient-to-r from-purple-600/70 via-indigo-600/70 to-blue-600/70  text-white text-center overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)]" />

      <motion.h2
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-6 relative z-10"
      >
        Ready to Experience the Next Generation of Social Media?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-lg text-blue-100 max-w-2xl mx-auto mb-10 relative z-10"
      >
        Join BGIFT today and become part of an intelligent, vibrant community
        that celebrates authentic connections.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative z-10"
      >
        <Link
          href="/login"
          className="px-8 py-3 rounded-xl bg-white text-blue-700 font-semibold hover:bg-gray-100 transition shadow-lg hover:shadow-xl"
        >
          Get Started
        </Link>
      </motion.div>
    </section>
  );
};

export default CTA;
