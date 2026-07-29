"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatReviewerName } from "@/lib/format";
import { Modal } from "@/components/ui/modal";

export type Testimonial = {
  name: string;
  text: string;
};

const CHAR_LIMIT = 150;

function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : limit).trimEnd()}…`;
}

function TestimonialCard({
  testimonial,
  onReadMore,
}: {
  testimonial: Testimonial;
  onReadMore: () => void;
}) {
  const isLong = testimonial.text.length > CHAR_LIMIT;

  return (
    <figure
      data-card
      className="flex w-[85%] shrink-0 snap-start flex-col rounded-2xl border border-sage-200/70 bg-white p-8 shadow-[0_8px_30px_-12px_rgba(43,58,48,0.15)] sm:w-[45%] lg:w-[calc(25%-18px)]"
    >
      <span className="font-display text-4xl leading-none text-sage-300">
        &ldquo;
      </span>
      <blockquote className="mt-2 leading-relaxed text-stone-600">
        {isLong ? truncate(testimonial.text, CHAR_LIMIT) : testimonial.text}
      </blockquote>
      {isLong && (
        <button
          type="button"
          onClick={onReadMore}
          className="mt-2 cursor-pointer self-start text-sm font-medium text-sage-600 underline decoration-sage-300 underline-offset-4 transition-colors hover:text-sage-800"
        >
          Lire la suite
        </button>
      )}
      <figcaption className="mt-6 text-sm font-medium tracking-wide text-sage-700">
        {formatReviewerName(testimonial.name)}
      </figcaption>
    </figure>
  );
}

export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: readonly Testimonial[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Testimonial | null>(null);

  function scrollByCards(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth ?? 320) + 24;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <div>
      <div
        ref={trackRef}
        className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4"
      >
        {testimonials.map((t) => (
          <TestimonialCard
            key={t.name}
            testimonial={t}
            onReadMore={() => setActive(t)}
          />
        ))}
      </div>

      {testimonials.length > 4 && (
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            aria-label="Avis précédents"
            onClick={() => scrollByCards(-1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-sage-200 text-sage-600 transition-colors hover:bg-sage-50"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Avis suivants"
            onClick={() => scrollByCards(1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-sage-200 text-sage-600 transition-colors hover:bg-sage-50"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      )}

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        title={active ? formatReviewerName(active.name) : ""}
      >
        <span className="font-display text-4xl leading-none text-sage-300">
          &ldquo;
        </span>
        <blockquote className="mt-2 leading-relaxed text-stone-600">
          {active?.text}
        </blockquote>
      </Modal>
    </div>
  );
}
