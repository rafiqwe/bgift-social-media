"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, X, Camera } from "lucide-react";

type Severity = "Low" | "Medium" | "High" | "Critical";

export default function ReportBug() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [steps, setSteps] = useState("");
  const [severity, setSeverity] = useState<Severity>("Medium");
  const [email, setEmail] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const MAX_FILES = 3;
  const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);

    // validate count and size and type
    const valid: File[] = [];
    for (const f of incoming) {
      if (!f.type.startsWith("image/")) {
        setError("Only image files are allowed for attachments.");
        continue;
      }
      if (f.size > MAX_FILE_SIZE) {
        setError("Each file must be smaller than 4 MB.");
        continue;
      }
      valid.push(f);
    }

    setAttachments((prev) => {
      const merged = [...prev, ...valid].slice(0, MAX_FILES);
      return merged;
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    setError(null);
    if (!title.trim()) return "Title is required";
    if (!details.trim()) return "Details are required";
    if (!steps.trim()) return "Steps to reproduce are required";
    // optional: validate email format if provided
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return "Invalid email address";
    return null;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("title", title);
      form.append("details", details);
      form.append("steps", steps);
      form.append("severity", severity);
      if (email) form.append("reporterEmail", email);
      attachments.forEach((f, idx) => form.append("attachments", f, f.name));

      const res = await axios.post("/api/reports", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201 || res.status === 200) {
        setSuccess(true);
        // clear form after small delay so UX shows success
        setTimeout(() => {
          setTitle("");
          setDetails("");
          setSteps("");
          setEmail("");
          setAttachments([]);
          setSeverity("Medium");
          setSuccess(false);
        }, 1400);
      } else {
        setError(res.data?.error || "Something went wrong. Try again.");
      }
    } catch (err: any) {
      console.error("Report error:", err);
      setError(
        err?.response?.data?.error || err.message || "Failed to send report"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 md:p-12">
      <div className="bg-white  rounded-2xl shadow-lg border border-gray-100  overflow-hidden">
        <div className="p-8 md:p-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Report a bug
          </h1>
          <p className="mt-2 text-sm text-gray-500  max-w-2xl">
            Help us improve BGIFT. Share what happened, how to reproduce it, and
            attach screenshots if possible. We’ll investigate and get back to
            you.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-gray-700 ">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short summary of the issue"
                className="mt-2 w-full rounded-lg border border-gray-200  bg-white  px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Severity + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 ">
                  Severity
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as Severity)}
                  className="mt-2 w-full rounded-lg border border-gray-200  bg-white  px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 ">
                  Your email (optional)
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="we'll contact you if we need more info"
                  className="mt-2 w-full rounded-lg border border-gray-200  bg-white  px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Details */}
            <div>
              <label className="text-sm font-medium text-gray-700 ">
                Details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what happened — expected vs actual behavior, console errors, network issues, etc."
                rows={5}
                className="mt-2 w-full rounded-lg border border-gray-200  bg-white  px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Steps */}
            <div>
              <label className="text-sm font-medium text-gray-700 ">
                Steps to reproduce
              </label>
              <textarea
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="1) Do this  2) Click that  3) See error..."
                rows={4}
                className="mt-2 w-full rounded-lg border border-gray-200  bg-white  px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Attachments */}
            <div>
              <label className="text-sm font-medium text-gray-700 ">
                Attach screenshots (optional)
              </label>

              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200  bg-white  text-sm shadow-sm hover:shadow-md transition"
                >
                  <Camera className="w-4 h-4" />
                  Add screenshot
                </button>
                <p className="text-sm text-gray-400">
                  Up to {MAX_FILES} images, max 4MB each
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              {/* Previews */}
              {attachments.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {attachments.map((f, idx) => {
                    const url = URL.createObjectURL(f);
                    return (
                      <div
                        key={idx}
                        className="relative rounded-lg overflow-hidden border border-gray-200 "
                      >
                        <Image
                          src={url}
                          alt={f.name}
                          width={320}
                          height={200}
                          className="object-cover w-full h-28"
                        />
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="absolute top-2 right-2 bg-white/90  p-1 rounded-full shadow"
                          aria-label="Remove attachment"
                        >
                          <X className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-md bg-red-50 border border-red-100 text-red-700 px-4 py-2 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 justify-between">
              <div className="text-sm text-gray-500">
                We appreciate reports — we read every one.
              </div>

              <div className="flex w-full items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTitle("");
                    setDetails("");
                    setSteps("");
                    setEmail("");
                    setAttachments([]);
                    setSeverity("Medium");
                    setError(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-200  text-sm hover:bg-gray-50 transition"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:opacity-95 disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Send report"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Success toast/modal */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 36, scale: 0.98 }}
            transition={{ duration: 0.28 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="flex items-center gap-3 bg-white border border-gray-100  rounded-lg px-4 py-3 shadow-lg">
              <div className="p-2 bg-green-50 rounded-md">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 ">Report sent</div>
                <div className="text-xs text-gray-500">
                  Thanks — we’ll investigate and follow up if needed.
                </div>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="ml-3 p-2 rounded-md hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
