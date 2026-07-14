"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navigation } from "@/lib/site-config";

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Certaines pages ont une image/un slider plein écran derrière le header
  // transparent : tant qu'on n'a pas scrollé, il faut du texte clair.
  const pagesWithDarkHero = ["/", "/reflexologie"];
  const hasDarkHero = pagesWithDarkHero.includes(pathname);
  const light = hasDarkHero && !scrolled && !isOpen;

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-500 ${
        scrolled || isOpen
          ? "border-b border-sage-100 bg-cream/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-28 max-w-7xl items-center justify-between px-6 sm:px-10">
        <Link href="/" className="group flex items-center gap-3 leading-none">
          <Image
            src="/images/nathalie-logo.png"
            alt="Nathalie OHL Réflexologue"
            width={84}
            height={84}
            className="h-20 w-20 shrink-0 object-contain"
            priority
          />
          <span className="flex flex-col">
            <span
              className={`font-display text-[1.35rem] font-normal tracking-tight transition-colors ${
                light ? "text-cream" : "text-sage-900 group-hover:text-sage-700"
              }`}
            >
              Nathalie&nbsp;OHL
            </span>
            <span
              className={`mt-1 text-[0.6rem] font-medium tracking-widest-plus uppercase transition-colors ${
                light ? "text-cream/80" : "text-sage-500"
              }`}
            >
              Réflexologue
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {navigation.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative text-[0.82rem] tracking-wide transition-colors ${
                  light
                    ? "text-cream/90 hover:text-cream"
                    : "text-sage-800 hover:text-sage-900"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px transition-all duration-300 ${
                    light ? "bg-cream" : "bg-sage-500"
                  } ${active ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>
            );
          })}
          <Link
            href="/reservation"
            className={`rounded-full px-6 py-2.5 text-[0.8rem] font-medium tracking-wide transition-colors duration-300 ${
              light
                ? "bg-cream text-sage-900 hover:bg-white"
                : "bg-sage-800 text-cream hover:bg-sage-900"
            }`}
          >
            Prendre rendez-vous
          </Link>
        </nav>

        <button
          type="button"
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
          className={`flex h-10 w-10 items-center justify-center transition-colors lg:hidden ${
            light ? "text-cream" : "text-sage-800"
          }`}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 block h-px w-6 bg-current transition-transform duration-300 ${
                isOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] block h-px w-6 bg-current transition-opacity duration-200 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] block h-px w-6 bg-current transition-transform duration-300 ${
                isOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-sage-100 bg-cream lg:hidden"
          >
            <div className="flex flex-col px-6 py-6">
              {navigation.map((item, i) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`border-b border-sage-100/70 py-4 font-display text-2xl transition-colors ${
                      active ? "text-sage-800" : "text-sage-600 hover:text-sage-800"
                    } ${i === 0 ? "border-t border-sage-100/70" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/reservation"
                className="mt-6 rounded-full bg-sage-800 px-6 py-4 text-center text-[0.9rem] font-medium tracking-wide text-cream"
              >
                Prendre rendez-vous
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
