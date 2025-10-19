"use client";

import React from "react";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      title: "Smart Feed",
      desc: "AI-curated content that connects you with topics and people that truly matter.",
      icon: "✨",
    },
    {
      title: "Real-Time Insights",
      desc: "Stay ahead with engagement metrics and data-driven growth analytics.",
      icon: "📈",
    },
    {
      title: "Privacy Focused",
      desc: "Your security matters. Experience total control over your data and visibility.",
      icon: "🛡️",
    },
  ];

  return (
    <section id="features" className="py-28 px-6 text-white  ">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-16"
        >
          Built for the <span className="text-indigo-600">Future</span> of
          Social Interaction
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl flex flex-col items-center text-center"
            >
              <div className="mb-6 text-2xl">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
