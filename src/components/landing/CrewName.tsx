"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Person = {
  name: string;
  role: string;
  bio: string;
  fact: string;
};

/**
 * An intern's name set inline in the story. Hover or focus the name and
 * their details develop into a small card floating above the word - like
 * a caption surfacing off a contact sheet.
 */
export function CrewName({ person }: { person: Person }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        className="font-marker cursor-help font-normal tracking-normal text-darkroom underline decoration-bluehour decoration-2 underline-offset-4 transition-colors hover:text-bluehour focus-visible:text-bluehour focus:outline-none"
      >
        {person.name}
      </button>

      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full left-1/2 z-30 mb-3 block w-72 max-w-[80vw] -translate-x-1/2 rounded-sm bg-darkroom-deep p-5 text-left text-halide shadow-[0.4rem_0.7rem_1.6rem_rgba(31,26,24,0.55)]"
          >
            <span className="block font-sans text-base font-bold leading-tight text-kodak">
              {person.name}
            </span>
            <span className="eyebrow mt-1 block text-halide/60">{person.role}</span>
            <span className="mt-3 block text-sm font-normal normal-case leading-relaxed tracking-normal text-halide/90">
              {person.bio}
            </span>
            <span className="font-marker mt-3 block text-sm font-normal normal-case tracking-normal text-kodak">
              {person.fact}
            </span>
            {/* little pointer */}
            <span
              aria-hidden
              className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-darkroom-deep"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
