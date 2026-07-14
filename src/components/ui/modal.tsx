"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Classe Tailwind max-w-* pour élargir la modal (ex: contenu en deux colonnes). */
  maxWidth?: string;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30"
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed inset-x-0 top-[8vh] z-50 mx-auto max-h-[84vh] w-[92vw] ${maxWidth} overflow-y-auto rounded-3xl bg-white p-6 shadow-xl sm:p-8`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-sage-800">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-stone-400 hover:bg-sage-50 hover:text-sage-700"
              >
                ✕
              </button>
            </div>
            <div className="mt-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
