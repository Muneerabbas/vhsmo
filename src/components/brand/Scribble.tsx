/** Hand-drawn yellow scribble, drawn under a word like a highlighter pass. */
export function Scribble({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      className={className ?? "absolute -bottom-2 left-0 h-2.5 w-full"}
    >
      <path
        d="M2 7 Q 26 2, 50 6 T 98 5"
        fill="none"
        stroke="#FDF100"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M6 9 Q 30 5, 55 8 T 94 7"
        fill="none"
        stroke="#FDF100"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
