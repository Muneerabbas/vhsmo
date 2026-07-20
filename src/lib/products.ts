export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  depositNote: string;
  estimatedShipping: string;
  images: ProductImage[];
  highlights: string[];
}

export interface SpecGroup {
  group: string;
  items: { label: string; value: string }[];
}

export interface Accessory {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Named icon rendered on a kodak disc - no stock photography. */
  icon: "strap" | "skin" | "battery" | "looks";
  comingSoon?: boolean;
}

export const cameraProduct: Product = {
  id: "vhsmo-camera",
  slug: "vhsmo-camera",
  name: "VHSMO Vol. 1",
  tagline: "A pocket camera with instant wireless transfer.",
  price: 4999,
  compareAtPrice: 6999,
  currency: "INR",
  depositNote:
    "Reserve now to lock in the early price. Fully refundable if not shipped by September 15th 2026.",
  estimatedShipping: "First batch · ships 2026",
  images: [
    {
      src: "/buyproduct/firstimage.jpg",
      alt: "VHSMO Camera, front view on a neutral background",
    },
    {
      src: "/buyproduct/vhsmoinhand.jpg",
      alt: "VHSMO Camera held in hand, showing compact size and finish",
    },
    {
      src: "/buyproduct/usingvhsmo.jpg",
      alt: "Someone shooting with the VHSMO Camera outdoors",
    },
    {
      src: "/buyproduct/vhsmoparty.jpg",
      alt: "VHSMO Camera on a table at a party",
    },
  ],
  highlights: [
    "Real 2000s-style photos. No filters. No overlays.",
    "Screen-free. No menus. Stay in the moment.",
    "Wireless to the VHSMO app in seconds.",
    "Palm-sized. Cloud-free. Ready to go.",
  ],
};

export const specifications: SpecGroup[] = [
  {
    group: "Sensor & Image",
    items: [
      { label: "Sensor", value: "61MP full-frame BSI CMOS" },
      { label: "ISO range", value: "64 – 102,400" },
      { label: "Dynamic range", value: "15 stops" },
      { label: "Colour science", value: "Aperture Warm Profile" },
    ],
  },
  {
    group: "Body & Controls",
    items: [
      { label: "Construction", value: "CNC aluminium, full-grain leather" },
      { label: "Weight", value: "498 g (body only)" },
      { label: "Controls", value: "Mechanical shutter, ISO & aperture dials" },
      { label: "Weather sealing", value: "IP53 dust & splash resistant" },
    ],
  },
  {
    group: "Performance",
    items: [
      { label: "Stabilisation", value: "8-stop 5-axis in-body" },
      { label: "Shutter", value: "1/8000s – 60s, silent electronic" },
      { label: "Viewfinder", value: "5.76M-dot OLED, 0.9× magnification" },
      { label: "Storage", value: "Dual UHS-II SD" },
    ],
  },
  {
    group: "Connectivity & Power",
    items: [
      { label: "Battery", value: "Up to 540 frames per charge" },
      { label: "Charging", value: "USB-C PD, full charge in 90 min" },
      { label: "Wireless", value: "Wi-Fi 6 + Bluetooth 5.2" },
      { label: "Ports", value: "USB-C, micro-HDMI, 3.5mm" },
    ],
  },
];

export const boxContents: { item: string; detail: string }[] = [
  { item: "Aperture Field One body", detail: "In Graphite or Sand finish" },
  { item: "USB-C charging cable", detail: "Braided, 1.5m" },
  { item: "Leather wrist strap", detail: "Full-grain, hand-stitched" },
  { item: "Lens cap & body cap", detail: "Machined aluminium" },
  { item: "Quick-start guide", detail: "Letterpress printed" },
  { item: "Lifetime membership", detail: "Aperture Field Notes community" },
];

/** A feature callout in the 3D inspect section. Selecting one glides the
 *  orbit camera to `view` (spherical angles around the model, radians). */
export interface InspectFeature {
  id: string;
  title: string;
  detail: string;
  view: { azimuth: number; polar: number; radius: number };
}

export const inspectFeatures: InspectFeature[] = [
  {
    id: "lens",
    title: "True 2000s optics",
    detail:
      "A real CCD-era lens and flash that slightly soft, overexposed digicam look straight off the sensor. No filters faking it.",
    view: { azimuth: 0.15, polar: 1.25, radius: 5.6 },
  },
  {
    id: "button",
    title: "One button",
    detail:
      "Point, press, done. No menus, no modes, no settings to scroll  the camera decides so you can stay in the moment.",
    view: { azimuth: 0.35, polar: 0.5, radius: 6.4 },
  },
  {
    id: "transfer",
    title: "Instant transfer",
    detail:
      "Every shot lands in the VHSMO app within seconds of pressing the shutter. Shoot the night, post the night.",
    view: { azimuth: Math.PI - 0.35, polar: 1.2, radius: 6.2 },
  },
  {
    id: "pocket",
    title: "Palm-sized body",
    detail:
      "Small enough for a jeans pocket, light enough to forget it's there  until the moment you don't want to miss.",
    view: { azimuth: Math.PI / 2, polar: 1.45, radius: 7 },
  },
];

/** Product-specific FAQ shown under the 3D inspect section. */
export const productFaq: { q: string; a: string }[] = [
  {
    q: "Is this a film camera? Do I need to buy film?",
    a: "No film, ever. VHSMO is digital with a sensor and lens tuned to shoot like the pocket cameras of the 2000s - you get the look without developing costs or waiting weeks for scans.",
  },
  {
    q: "How do my photos get to my phone?",
    a: "The camera pairs with the VHSMO app over wireless. Every shot appears in the app within seconds of taking it - no cables, no card readers, no exporting.",
  },
  {
    q: "How long does the battery last?",
    a: "A full night out and then some - hundreds of shots on one charge. When it does run flat, it charges over USB-C with the same cable as your phone.",
  },
  {
    q: "How many photos can it hold?",
    a: "Thousands. And since everything syncs to your phone as you shoot, the camera's storage is a backup, not a limit.",
  },
  {
    q: "Will it survive a night out?",
    a: "It's built for exactly that - a solid, pocket-proof body that shrugs off bags, jackets and dance floors. Treat it like your keys, not like glassware.",
  },
  {
    q: "When does it ship, and can I get my money back?",
    a: "First batch ships in 2026. Reserving locks the early price and is fully refundable - nothing is charged until your camera actually ships.",
  },
];

export const accessories: Accessory[] = [
  {
    id: "acc-strap",
    name: "Wrist Strap",
    description: "A woven cord that keeps VHSMO on you - not in a drawer.",
    price: 299,
    icon: "strap",
  },
  {
    id: "acc-skin",
    name: "Pocket Skin",
    description: "A grippy silicone skin. Blush, cream or charcoal.",
    price: 499,
    icon: "skin",
  },
  {
    id: "acc-battery",
    name: "Day-Two Battery",
    description: "A second charge for the nights that keep going.",
    price: 899,
    icon: "battery",
  },
  {
    id: "acc-looks",
    name: "Film-Look Pack",
    description: "Extra in-app looks, straight from the darkroom.",
    price: 0,
    icon: "looks",
    comingSoon: true,
  },
];
