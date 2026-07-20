"use client";

/**
 * Flies a small round product image from `source` to the header cart icon
 * (marked with [data-cart-icon]). Resolves when the image lands so callers
 * can sequence "add to cart" / drawer opening after the flight.
 */
export function flyToCart(
  source: HTMLElement | null,
  imageSrc: string,
): Promise<void> {
  if (typeof window === "undefined" || !source) return Promise.resolve();

  const target = document.querySelector<HTMLElement>("[data-cart-icon]");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (!target || reducedMotion || typeof source.animate !== "function") {
    return Promise.resolve();
  }

  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();

  const size = 64;
  const startX = from.left + from.width / 2 - size / 2;
  const startY = from.top + from.height / 2 - size / 2;
  const endX = to.left + to.width / 2 - size / 2;
  const endY = to.top + to.height / 2 - size / 2;
  const dx = endX - startX;
  const dy = endY - startY;

  const img = document.createElement("img");
  img.src = imageSrc;
  img.alt = "";
  img.setAttribute("aria-hidden", "true");
  Object.assign(img.style, {
    position: "fixed",
    left: `${startX}px`,
    top: `${startY}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: "cover",
    borderRadius: "9999px",
    zIndex: "100",
    pointerEvents: "none",
    boxShadow: "0 8px 24px rgba(31,26,24,0.35)",
    willChange: "transform, opacity",
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(img);

  // Arc: the midpoint keyframe lifts the image above the straight line.
  const flight = img.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      {
        transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 80}px) scale(0.7)`,
        opacity: 1,
        offset: 0.55,
      },
      { transform: `translate(${dx}px, ${dy}px) scale(0.25)`, opacity: 0.4 },
    ],
    { duration: 650, easing: "cubic-bezier(0.45, 0, 0.25, 1)" },
  );

  return new Promise((resolve) => {
    let landed = false;
    const land = () => {
      if (landed) return;
      landed = true;
      img.remove();
      // Little pop on the cart icon as the item lands.
      target.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.35)" },
          { transform: "scale(1)" },
        ],
        { duration: 320, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
      );
      resolve();
    };
    flight.addEventListener("finish", land);
    flight.addEventListener("cancel", land);
    // Frozen timelines (e.g. hidden tab) never fire finish - don't let the
    // add-to-cart hang behind the animation.
    setTimeout(land, 1000);
  });
}
