import type { MetadataRoute } from "next";
import { LEGAL_DOCS } from "@/lib/legal";

const BASE = "https://aperture.camera";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...LEGAL_DOCS.map((doc) => ({
      url: `${BASE}/legal/${doc.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
