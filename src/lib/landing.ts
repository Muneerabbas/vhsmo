/**
 * VHSMO landing page — the whole magazine issue, copy and assets.
 * Voice: fashion campaign, never spec sheet. Edit copy here, not in sections.
 */

export const RESERVE_HREF = "/product";
export const YEAR_MARK = "/2026";
export const TAGLINE = ["Play it.", "Live it.", "Rewind Nothing."];

export const hero = {
  kicker: "Designed to be noticed · Built to last a lifetime",
  headline: "VHSMO",
  sub: "A pocket camera with the soul of the 2000s.",
  cta: "Reserve yours",
  image: {
    src: "/hero-new.png",
    alt: "VHSMO camera in a cinematic scene",
  },
};

export const features = {
  items: [
    {
      icon: "lens",
      title: "Retro lens",
      body: "True 2000s optics — no filters, no overlays.",
    },
    {
      icon: "transfer",
      title: "Instant transfer",
      body: "Every shot on your phone, wirelessly, in seconds.",
    },
    {
      icon: "pocket",
      title: "Pocket build",
      body: "Palm-sized — always with you, always ready.",
    },
  ],
};

export const story = {
  kicker: "Why we exist",
  pullQuote: "Cameras got smarter. Photos got emptier.",
  paragraphs: [
    "Somewhere along the way, taking a picture stopped being a moment and started being a workflow. Fourteen apps. Nine filters. A grid of near-identical takes you'll never look at again.",
    "VHSMO started as two founders in a rented garage and one stubborn idea: a camera you grabbed on the way out the door. One button. No preview worth trusting. You found out what you caught later — and the finding out was half the joy.",
  ],
  crew: [
    {
      name: "Maya Okonkwo",
      role: "Optics intern",
      bio: "Film-photography obsessive. Maya spent three months chasing the exact warm bloom of an early-2000s point-and-shoot, then rebuilt our lens coating to keep the beautiful flaw instead of correcting it.",
      fact: "Owns 41 disposable cameras.",
    },
    {
      name: "Diego Marchetti",
      role: "Firmware intern",
      bio: "Allergic to menus. Diego wrote the one-button firmware and the instant-transfer pipeline, deleting every setting he possibly could until only the shutter was left.",
      fact: "Ships photos to your phone in under 3s.",
    },
    {
      name: "Priya Raman",
      role: "Design intern",
      bio: "Shaped the pocketable body and the tactile click of the shutter. Priya prototyped 60 shells in foam before the one that disappears into your palm.",
      fact: "60 foam prototypes, 1 keeper.",
    },
  ],
  note: "that's what made it real.",
  photos: [
    {
      src: "/vhsmoclicks/two.avif",
      alt: "A night out, caught in direct flash",
      caption: "the night we didn't plan",
      story: "Ten minutes before the party. Nobody said 'pose'.",
    },
    {
      src: "/vhsmoclicks/five.avif",
      alt: "A warm, grainy golden-hour moment shot on VHSMO",
      caption: "golden hour, no retakes",
      story: "The light lasted forty seconds. The camera was already out.",
    },
    {
      src: "/vhsmoclicks/three.avif",
      alt: "An in-between moment shot on VHSMO, straight out of camera",
      caption: "somewhere off route 9",
      story: "We weren't even supposed to stop here.",
    },
    {
      src: "/samples/sample-warm.jpg",
      alt: "Two friends in warm indoor light, shot on VHSMO",
      caption: "the one we almost deleted",
      story: "Blurry, overexposed — and the only one that felt like that night.",
    },
  ],
};

export const instantTransfer = {
  kicker: "Instant transfer",
  headline: ["Shoot it.", "It's already on", "your phone."],
  body: "No cables. No card readers. No transfers. Every shot lands in your camera roll in seconds, while the night keeps going.",
  note: "it's already there",
  app: {
    name: "The VHSMO App",
    description:
      "Edit with our film filters, curate your moments, and relive them — exactly as you saw them.",
  },
  features: ["Film Filters", "Your Gallery", "Easy Sharing"],
  phone: {
    title: "Camera Roll",
    subtitle: "Instant. Seamless. Yours.",
    photos: [
      "/vhsmoclicks/one.jpeg",
      "/vhsmoclicks/two.avif",
      "/vhsmoclicks/three.avif",
      "/vhsmoclicks/four.avif",
      "/vhsmoclicks/five.avif",
      "/vhsmoclicks/six.avif",
      "/vhsmoclicks/seven.avif",
      "/samples/sample-warm.jpg",
      "/samples/sample-flat.jpg",
      "/buyproduct/vhsmoparty.jpg",
      "/buyproduct/usingvhsmo.jpg",
      "/hero-green.jpg",
    ],
  },
  flyingPrint: "/vhsmoclicks/four.avif",
  cameraCutout: "/camera-cutout.png",
};

export const careers = {
  kicker: "Join the crew",
  headline: "Create Your Own Career.",
  body: "We're always on the lookout for creators & enthusiasts to join our team. If VHSMO sounds like the place for you, drop us your info — we'll be sure to reach out :)",
  image: {
    src: "/buyproduct/usingvhsmo.jpg",
    alt: "A VHSMO creator shooting on the pink camera",
    width: 1500,
    height: 1200,
  },
  areas: ["Design", "Engineering", "Marketing", "Retail & Ops", "Something else"],
  cta: "Work with Us",
  stickers: ["Play it live.", "Let's retro", "Rewind nothing.", "No filters. No cloud."],
};

export const shotOn = {
  kicker: "Shot on VHSMO / Vol. I",
  headline: "Real moments. No filters.",
  photos: [
    { src: "/vhsmoclicks/one.jpeg", alt: "Two friends dressed up at a house party" },
    { src: "/vhsmoclicks/two.avif", alt: "A night out, caught in direct flash" },
    { src: "/vhsmoclicks/three.avif", alt: "An in-between moment shot on VHSMO" },
    { src: "/vhsmoclicks/four.avif", alt: "A trip photographed on VHSMO" },
    { src: "/vhsmoclicks/five.avif", alt: "Golden hour shot on VHSMO" },
    { src: "/vhsmoclicks/six.avif", alt: "Friends shot on VHSMO" },
    { src: "/vhsmoclicks/seven.avif", alt: "A quiet moment shot on VHSMO" },
    { src: "/samples/sample-flat.jpg", alt: "A flash photo shot on VHSMO" },
  ],
  marquee: "now rolling",
};

export const community = {
  kicker: "The corkboard",
  headline: "People keep sending us their nights.",
  scraps: [
    {
      handle: "@mars.jpg",
      text: "took it to a wedding instead of my phone. best decision. everyone kept grabbing it",
    },
    {
      handle: "@felixshoots",
      text: "the photos look like my childhood and i can't explain it better than that",
    },
    {
      handle: "@notlaura",
      text: "my friends fight over who holds the vhsmo now",
    },
    {
      handle: "@dev.rolls",
      text: "shot our whole road trip on it. 300 photos, zero edits, all keepers",
    },
    {
      handle: "@kira_kira",
      text: "it was on my phone before we left the parking lot. HOW",
    },
  ],
  photos: [
    { src: "/vhsmoclicks/six.avif", alt: "Community photo shot on VHSMO" },
    { src: "/vhsmoclicks/two.avif", alt: "Community photo shot on VHSMO" },
    { src: "/vhsmoclicks/seven.avif", alt: "Community photo shot on VHSMO" },
  ],
};

export const showcase = {
  kicker: "The object",
  image: {
    src: "/camera-cutout.png",
    alt: "The VHSMO pocket camera, studio lit",
    width: 1536,
    height: 1024,
  },
  cta: "Reserve yours",
};

export const faq = {
  kicker: "Fine print",
  items: [
    {
      q: "What makes VHSMO different from other cameras?",
      a: "It's the only camera of its kind: true vintage photos straight from the lens, and wireless delivery to your phone in seconds. Not the modern-now-disposable cycle — one object, built to last.",
    },
    {
      q: "How do I transfer photos from the camera?",
      a: "You don't, really — VHSMO does. Your photos transfer wirelessly to any phone, compatible with iOS and Android. No app gymnastics, no cables, no card readers.",
    },
    {
      q: "Is the camera beginner-friendly?",
      a: "If you can press one button, you're overqualified. No settings, no modes, no learning curve. Point, press, keep living. The photo's on your phone before you've put the camera down.",
    },
    {
      q: "What is the battery life of a VHSMO?",
      a: "Built for full days, not full bars. A charge covers a weekend of normal shooting — trips, nights, and the in-between — and tops up over USB-C while you sleep.",
    },
    {
      q: "When does it ship?",
      a: "First batch ships in 2026. Reserving now holds your place in line — early reservations get the first cameras off the line.",
    },
  ],
};

export const finalCta = {
  lineOne: "The world keeps moving.",
  lineTwo: "Thanks for pausing to look.",
  sub: "First batch — /2026. Reserve yours before it's gone.",
  cta: "Reserve yours",
  photo: {
    src: "/buyproduct/vhsmoparty.jpg",
    alt: "VHSMO on a party table, night in full swing behind it",
  },
};
