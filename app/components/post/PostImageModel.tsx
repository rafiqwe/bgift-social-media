"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import Image from "next/image";

interface PostImageModalProps {
  src: string;
  alt?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PostImageModal({
  src,
  alt = "Post image",
  isOpen,
  onClose,
}: PostImageModalProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // transform state
  const [scale, setScale] = useState<number>(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  // panning helpers
  const isPanningRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);

  // clamp helpers
  const MIN_SCALE = 1;
  const MAX_SCALE = 4;
  const SCALE_STEP = 0.25;

  useEffect(() => {
    // reset when opening/closing
    if (!isOpen) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, scale]);

  const clamp = (v: number, a: number, b: number) =>
    Math.max(a, Math.min(b, v));

  const zoomTo = (newScale: number, center?: { x: number; y: number }) => {
    // center is pointer coords in wrapper space
    const wrapper = wrapperRef.current;
    if (!wrapper || !imgRef.current) {
      setScale(clamp(newScale, MIN_SCALE, MAX_SCALE));
      return;
    }

    const rect = wrapper.getBoundingClientRect();
    const cx = typeof center?.x === "number" ? center.x - rect.left : rect.width / 2;
    const cy = typeof center?.y === "number" ? center.y - rect.top : rect.height / 2;

    // compute image offset in current scale
    // we want the point under cursor to stay fixed relative to wrapper while scaling
    const prevScale = scale;
    const ds = newScale / prevScale;

    const newTx = (translate.x - cx) * ds + cx;
    const newTy = (translate.y - cy) * ds + cy;

    setScale(clamp(newScale, MIN_SCALE, MAX_SCALE));
    setTranslate({ x: newTx, y: newTy });
  };

  const zoomIn = () => zoomTo(clamp(scale + SCALE_STEP, MIN_SCALE, MAX_SCALE));
  const zoomOut = () => zoomTo(clamp(scale - SCALE_STEP, MIN_SCALE, MAX_SCALE));
  const reset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  // wheel zooming — center on pointer
  const handleWheel = (e: React.WheelEvent) => {
    if (!isOpen) return;
    if (!imgRef.current || !wrapperRef.current) return;

    e.preventDefault();
    const delta = -e.deltaY; // invert for natural feel
    const direction = delta > 0 ? 1 : -1;
    const factor = SCALE_STEP * direction;
    const newScale = clamp(scale + factor, MIN_SCALE, MAX_SCALE);

    zoomTo(newScale, { x: e.clientX, y: e.clientY });
  };

  // pointer (mouse/touch) handlers for panning
  const onPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return; // no panning at default scale
    isPanningRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isPanningRef.current || !lastPointerRef.current) return;
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    setTranslate((t) => ({ x: t.x + dx, y: t.y + dy }));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    isPanningRef.current = false;
    lastPointerRef.current = null;
    try {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  // download image (fetch blob then trigger link)
  const handleDownload = async () => {
    try {
      const res = await fetch(src, { mode: "cors" });
      if (!res.ok) throw new Error("Failed to fetch image");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // try to get filename from src
      const parts = src.split("/");
      const defaultName = parts[parts.length - 1].split("?")[0] || "image.jpg";
      a.download = defaultName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download image:", err);
    }
  };

  // limit panning so image can't be dragged infinitely away (basic clamp)
  // We do a soft clamp each render to avoid sudden snapping; better to clamp on pointer up:
  useEffect(() => {
    if (!wrapperRef.current || !imgRef.current) return;
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const img = imgRef.current;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    // compute displayed image size inside wrapper at current scale (fit contain)
    const wrapperW = wrapperRect.width;
    const wrapperH = wrapperRect.height;
    // compute image displayed dimensions preserving aspect ratio
    const ratio = Math.min(wrapperW / iw, wrapperH / ih);
    const displayW = iw * ratio * scale;
    const displayH = ih * ratio * scale;

    // allowed translate ranges: half of extra dimension
    const maxX = Math.max(0, (displayW - wrapperW) / 2 + 20); // +20 grace
    const maxY = Math.max(0, (displayH - wrapperH) / 2 + 20);
    setTranslate((t) => ({
      x: clamp(t.x, -maxX, maxX),
      y: clamp(t.y, -maxY, maxY),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs p-4"
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative max-w-[95vw] max-h-[95vh] w-full md:w-[90vw] lg:w-[80vw] bg-transparent"
          >
            {/* Controls */}
            <div className="absolute top-3 right-3 z-40 flex gap-2 items-center">
              <button
                aria-label="Zoom out"
                onClick={zoomOut}
                className="bg-white/90 hover:bg-white rounded-md p-2 shadow-md"
                title="Zoom out"
              >
                <ZoomOut size={18} />
              </button>
              <button
                aria-label="Reset"
                onClick={reset}
                className="bg-white/90 hover:bg-white rounded-md p-2 shadow-md"
                title="Reset"
              >
                <RefreshCw size={18} />
              </button>
              <button
                aria-label="Zoom in"
                onClick={zoomIn}
                className="bg-white/90 hover:bg-white rounded-md p-2 shadow-md"
                title="Zoom in"
              >
                <ZoomIn size={18} />
              </button>
              <button
                aria-label="Download"
                onClick={handleDownload}
                className="bg-white/90 hover:bg-white rounded-md p-2 shadow-md"
                title="Download"
              >
                <Download size={18} />
              </button>
              <button
                aria-label="Close"
                onClick={onClose}
                className="bg-white/90 hover:bg-white rounded-md p-2 shadow-md ml-1"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Wrapper: listens to wheel/pointer */}
            <div
              ref={wrapperRef}
              onWheel={handleWheel}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="w-full h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden touch-pan-y bg-black/60 rounded"
              style={{ cursor: scale > 1 ? "grab" : "auto" }}
            >
              {/* Centered image container */}
              <div
                className="relative"
                style={{
                  transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                  transition: isPanningRef.current ? "none" : "transform 120ms linear",
                  willChange: "transform",
                }}
              >
                {/* Use normal <img> so we can measure naturalWidth/Height and allow cross-origin fetching for download */}
                <img
                  ref={imgRef}
                  src={src}
                  alt={alt}
                  className="max-w-[90vw] max-h-[68vh] md:max-w-[80vw] md:max-h-[78vh] object-contain select-none z-50"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            </div>

            {/* Mobile hint / scale indicator */}
            <div className="absolute bottom-3 left-3 z-40">
              <div className="bg-white/90 px-3 py-1 rounded-md text-sm shadow">
                {scale.toFixed(2)}×
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
