"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 border-t border-white/10 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center md:text-left"
        >
          <h2 className="text-2xl font-bold text-white tracking-tight">
            BGIFT
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Empowering meaningful AI-driven connections.
          </p>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap justify-center md:justify-end gap-6 text-sm font-medium"
        >
          <Link href="#features" className="hover:text-white transition">
            Features
          </Link>
          <Link href="#about" className="hover:text-white transition">
            About
          </Link>
          <Link href="/login" className="hover:text-white transition">
            Join Now
          </Link>
          <Link href="/privacy" className="hover:text-white transition">
            Privacy
          </Link>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 my-8" />

      {/* Bottom text */}
      <p className="text-center text-gray-600 text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="text-gray-300 font-medium">BGIFT</span> — All rights
        reserved.
      </p>
    </footer>
  );
};

export default Footer;
