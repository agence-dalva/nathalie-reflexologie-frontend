"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export type HeroSlide = {
  src: string;
  alt: string;
};

const SLIDE_DURATION = 6000;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      SLIDE_DURATION,
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-sage-900">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <motion.div
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: SLIDE_DURATION / 1000 + 2, ease: "linear" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[index].src}
              alt={slides[index].alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Soft gradient overlays for text legibility and calm mood */}
      <div className="absolute inset-0 bg-sage-900/35" />
      <div className="absolute inset-0 bg-linear-to-t from-sage-900/70 via-transparent to-sage-900/25" />

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Image ${i + 1}`}
            onClick={() => setIndex(i)}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === index ? "2rem" : "0.375rem",
              backgroundColor:
                i === index ? "var(--color-cream)" : "rgba(252,250,246,0.45)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
