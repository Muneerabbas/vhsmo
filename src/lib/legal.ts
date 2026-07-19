/**
 * Policy content for the footer legal pages. Editorial placeholder copy
 * written for VHSMO — a pre-order pocket camera brand shipping in India via
 * Razorpay (payments) and WARIQ Logistics (fulfilment). Review with counsel
 * before launch.
 */

export type LegalSection = {
  heading: string;
  body: string[];
};

export type LegalDoc = {
  slug: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

const CONTACT = "support@vhsmo.com";

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "terms",
    title: "Terms of Service",
    updated: "July 2026",
    intro:
      "These terms govern your use of the VHSMO website and your purchase or pre-order of VHSMO products. By placing an order, you agree to them.",
    sections: [
      {
        heading: "1. About these terms",
        body: [
          "VHSMO (\"we\", \"us\", \"our\") operates this website and sells the VHSMO camera and related accessories. By browsing, reserving, or purchasing, you accept these Terms of Service in full.",
          "We may update these terms from time to time. The version in effect at the moment you place an order is the version that applies to that order.",
        ],
      },
      {
        heading: "2. Orders and pre-orders",
        body: [
          "Some items are sold as pre-orders. Placing a pre-order reserves your unit and authorises payment; your camera ships in the batch and estimated window shown at checkout.",
          "All orders are subject to acceptance and availability. We may cancel and fully refund an order if an item is unavailable, mispriced, or the order is flagged for suspected fraud.",
        ],
      },
      {
        heading: "3. Pricing and payment",
        body: [
          "Prices are shown in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. Payments are processed securely by Razorpay; we never store your full card details.",
          "If a payment is declined or reversed, we may hold or cancel the associated order.",
        ],
      },
      {
        heading: "4. Acceptable use",
        body: [
          "You agree not to misuse the site, attempt to disrupt it, or resell VHSMO products in a way that misrepresents the brand. All VHSMO names, logos, and imagery remain our property.",
        ],
      },
      {
        heading: "5. Liability",
        body: [
          "To the fullest extent permitted by law, VHSMO is not liable for indirect or consequential losses. Nothing in these terms limits your statutory rights as a consumer.",
        ],
      },
      {
        heading: "6. Contact",
        body: [
          `Questions about these terms? Email us at ${CONTACT} and we'll help.`,
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    updated: "July 2026",
    intro:
      "This policy explains what personal information we collect when you use VHSMO, why we collect it, and the choices you have.",
    sections: [
      {
        heading: "1. What we collect",
        body: [
          "When you reserve, check out, or join the waitlist, we collect your name, email address, phone number, and shipping address. When you pay, Razorpay processes your payment details on our behalf.",
          "We also collect basic technical data — such as device and browsing information — to keep the site secure and working well.",
        ],
      },
      {
        heading: "2. How we use it",
        body: [
          "We use your information to process orders, arrange delivery through our logistics partner, send order and shipping updates, provide support, and — only if you opt in — send you product news.",
        ],
      },
      {
        heading: "3. Who we share it with",
        body: [
          "We share only what's necessary with our payment processor (Razorpay), our fulfilment partner (WARIQ Logistics), and service providers who help us run the business. We do not sell your personal data.",
        ],
      },
      {
        heading: "4. Data retention & security",
        body: [
          "We keep order records for as long as needed to meet legal and accounting obligations, then delete or anonymise them. Data is protected in transit with encryption.",
        ],
      },
      {
        heading: "5. Your rights",
        body: [
          `You can ask us to access, correct, or delete your personal information, or to stop marketing emails, at any time by writing to ${CONTACT}.`,
        ],
      },
    ],
  },
  {
    slug: "refund",
    title: "Refund Policy",
    updated: "July 2026",
    intro:
      "We want you to love your VHSMO. If something isn't right, here's how returns and refunds work.",
    sections: [
      {
        heading: "1. Returns window",
        body: [
          "You may request a return within 7 days of delivery, provided the camera is unused, in its original packaging, and with all accessories included.",
          "Pre-order reservations can be cancelled for a full refund any time before your order ships.",
        ],
      },
      {
        heading: "2. Damaged or defective items",
        body: [
          "If your camera arrives damaged or develops a fault covered by warranty, contact us within 48 hours of delivery with photos. We'll arrange a free replacement or full refund.",
        ],
      },
      {
        heading: "3. How refunds are issued",
        body: [
          "Approved refunds are returned to your original payment method through Razorpay. Refunds typically reflect within 5–7 business days after we receive and inspect the returned item.",
        ],
      },
      {
        heading: "4. Non-returnable items",
        body: [
          "For hygiene and safety, certain accessories may be non-returnable once opened. Any such exceptions are noted on the product page.",
        ],
      },
      {
        heading: "5. Start a return",
        body: [
          `Email ${CONTACT} with your order ID and reason, and we'll send you return instructions.`,
        ],
      },
    ],
  },
  {
    slug: "shipping",
    title: "Shipping Policy",
    updated: "July 2026",
    intro:
      "Everything you need to know about how, when, and where your VHSMO ships.",
    sections: [
      {
        heading: "1. Processing time",
        body: [
          "In-stock orders are processed and handed to our courier within 24–48 hours. Pre-orders ship in the batch window shown at checkout.",
        ],
      },
      {
        heading: "2. Delivery & partners",
        body: [
          "Orders are fulfilled through WARIQ Logistics and their courier network. You'll receive a tracking link by email once your order is dispatched.",
          "Delivery timelines vary by location but typically fall within 3–7 business days after dispatch for most serviceable pincodes.",
        ],
      },
      {
        heading: "3. Shipping charges",
        body: [
          "Standard shipping is free across India for camera orders. Any charges for expedited options are shown at checkout before payment.",
        ],
      },
      {
        heading: "4. Addresses & failed deliveries",
        body: [
          "Please double-check your shipping address at checkout — we can't redirect a parcel once it's dispatched. If a delivery fails after multiple attempts, the parcel returns to us and we'll reach out to re-ship.",
        ],
      },
      {
        heading: "5. Questions",
        body: [
          `For anything shipping-related, email ${CONTACT} with your order ID.`,
        ],
      },
    ],
  },
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return LEGAL_DOCS.find((d) => d.slug === slug);
}
