"use client";
import Image from "next/image";
import React from "react";
import LogoImage from "@/public/images/bgift-icon-light.png"
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between w-full px-6 md:px-12 py-5 max-w-7xl mx-auto backdrop-blur-xl  border border-white/20 shadow-sm sticky top-0 z-50 rounded-b-2xl">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Image
          src={LogoImage}
          alt="BGIFT Logo"
          width={36}
          height={36}
          className="rounded-lg"
        />
        <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
          BGIFT
        </span>
      </div>

      {/* Links */}
      <div className="flex items-center gap-6 text-sm md:text-base font-medium">
        <Link
          href="#features"
          className="hover:text-gray-800 transition"
        >
          Features
        </Link>
        <Link
          href={"#about"}
          className="hover:text-gray-800 transition"
        >
          About
        </Link>
        <Link
          href="/login"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
