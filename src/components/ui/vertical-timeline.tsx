"use client";

import { motion } from "framer-motion";

export type TimelineEntry = {
  period: string;
  text: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function VerticalTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="relative mx-auto max-w-3xl">
      {/* Ligne centrale — masquée sur mobile au profit d'une ligne à gauche */}
      <div className="absolute top-0 bottom-0 left-4 w-px bg-sage-700/50 sm:left-1/2 sm:-translate-x-1/2" />

      <div className="space-y-16">
        {entries.map((entry, i) => {
          const fromLeft = i % 2 === 0;
          return (
            <div
              key={entry.period}
              className="relative grid grid-cols-[2rem_1fr] items-start gap-x-6 sm:grid-cols-2 sm:gap-x-16"
            >
              {/* Point sur la ligne */}
              <span className="absolute top-1.5 left-4 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-terracotta-400 sm:left-1/2" />

              {fromLeft ? (
                <>
                  <div className="hidden sm:block" />
                  <TimelineCard entry={entry} align="left" delay={i * 0.05} />
                  <div className="col-start-2 sm:hidden">
                    <TimelineCard entry={entry} align="left" delay={i * 0.05} mobile />
                  </div>
                </>
              ) : (
                <>
                  <TimelineCard entry={entry} align="right" delay={i * 0.05} className="hidden sm:block" />
                  <div className="hidden sm:block" />
                  <div className="col-start-2 sm:hidden">
                    <TimelineCard entry={entry} align="right" delay={i * 0.05} mobile />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimelineCard({
  entry,
  align,
  delay,
  mobile = false,
  className = "",
}: {
  entry: TimelineEntry;
  align: "left" | "right";
  delay: number;
  mobile?: boolean;
  className?: string;
}) {
  const fromX = mobile ? 0 : align === "left" ? -24 : 24;

  return (
    <motion.div
      initial={{ opacity: 0, x: fromX, y: mobile ? 16 : 0 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={`${align === "right" && !mobile ? "text-right" : ""} ${className}`}
    >
      <p className="font-display text-xl font-light text-terracotta-400">
        {entry.period}
      </p>
      <p className="mt-2 leading-relaxed text-sage-100">{entry.text}</p>
    </motion.div>
  );
}
