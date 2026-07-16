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
  /** Named icon rendered on a kodak disc — no stock photography. */
  icon: "strap" | "skin" | "battery" | "looks";
  comingSoon?: boolean;
}

export const cameraProduct: Product = {
  id: "vhsmo-camera",
  slug: "vhsmo-camera",
  name: "VHSMO Camera",
  tagline: "A pocket camera with the soul of the 2000s.",
  price: 4999,
  compareAtPrice: 6999,
  currency: "INR",
  depositNote:
    "Reserve now to lock in the early price. Fully refundable — nothing's charged until it ships.",
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
    "True 2000s optics — no filters, no overlays",
    "One button. No menus. No learning curve.",
    "Wireless to your phone in seconds",
    "Palm-sized — always in reach",
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

export const accessories: Accessory[] = [
  {
    id: "acc-strap",
    name: "Wrist Strap",
    description: "A woven cord that keeps VHSMO on you — not in a drawer.",
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
