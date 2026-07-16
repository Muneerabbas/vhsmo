"use client";

import { useEffect, useState } from "react";

export type Accent = "green" | "pink" | "red";

/**
 * Reactively tracks the active accent theme (set on <html data-accent>)
 * so components can swap assets when the footer theme switcher changes.
 */
export function useAccent(): Accent {
  const [accent, setAccent] = useState<Accent>("green");

  useEffect(() => {
    const read = () =>
      (document.documentElement.dataset.accent as Accent | undefined) ?? "green";
    setAccent(read());

    const observer = new MutationObserver(() => setAccent(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-accent"],
    });
    return () => observer.disconnect();
  }, []);

  return accent;
}
