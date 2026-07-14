"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export type SliderImage = {
  src: string;
  alt: string;
};

const SLIDE_DURATION = 5000;

export function ImageSlider({
  images,
  className = "",
}: {
  images: SliderImage[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      SLIDE_DURATION,
    );
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <motion.div
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: SLIDE_DURATION / 1000 + 1.4, ease: "linear" }}
            className="absolute inset-0"
          >
            <Image
              src={images[index].src}
              alt={images[index].alt}
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Image ${i + 1}`}
              onClick={() => setIndex(i)}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === index ? "1.5rem" : "0.375rem",
                backgroundColor:
                  i === index ? "var(--color-cream)" : "rgba(252,250,246,0.45)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
