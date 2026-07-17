/**
 * Development fallback for the address APIs.
 *
 * The route handlers use Google Places (New) when GOOGLE_MAPS_API_KEY is set.
 * When it isn't (e.g. local dev / preview without a key), they fall back to
 * this small in-memory dataset so the UI is fully demonstrable. This fallback
 * is guarded by `NODE_ENV !== "production"` in the routes and never runs in
 * production, where a missing key is treated as a real error.
 */

import type { AddressDetails, AddressSuggestionItem } from "@/components/address/types";

interface MockPlace {
  id: string;
  title: string;
  subtitle: string;
  details: AddressDetails;
}

const MOCK_PLACES: MockPlace[] = [
  {
    id: "mock-pune-airport",
    title: "Pune Airport",
    subtitle: "Airport Road, Lohegaon, Pune",
    details: {
      street: "Airport Road",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411032",
      country: "India",
      formattedAddress: "Airport Road, Lohegaon, Pune, Maharashtra 411032, India",
      latitude: 18.5793,
      longitude: 73.9089,
    },
  },
  {
    id: "mock-pune-railway",
    title: "Pune Railway Station",
    subtitle: "Station Road, Pune",
    details: {
      street: "Station Road",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411001",
      country: "India",
      formattedAddress: "Station Road, Pune, Maharashtra 411001, India",
      latitude: 18.5286,
      longitude: 73.8743,
    },
  },
  {
    id: "mock-fc-road",
    title: "FC Road",
    subtitle: "Shivajinagar, Pune",
    details: {
      street: "Fergusson College Road",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411005",
      country: "India",
      formattedAddress: "FC Road, Shivajinagar, Pune, Maharashtra 411005, India",
      latitude: 18.5236,
      longitude: 73.8407,
    },
  },
  {
    id: "mock-koregaon-park",
    title: "Koregaon Park",
    subtitle: "North Main Road, Pune",
    details: {
      street: "North Main Road",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411001",
      country: "India",
      formattedAddress: "North Main Road, Koregaon Park, Pune, Maharashtra 411001, India",
      latitude: 18.5362,
      longitude: 73.8939,
    },
  },
  {
    id: "mock-bandra",
    title: "Bandra Bandstand",
    subtitle: "Bandra West, Mumbai",
    details: {
      street: "Bandstand Promenade",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400050",
      country: "India",
      formattedAddress: "Bandstand Promenade, Bandra West, Mumbai, Maharashtra 400050, India",
      latitude: 19.0421,
      longitude: 72.8195,
    },
  },
  {
    id: "mock-connaught",
    title: "Connaught Place",
    subtitle: "Rajiv Chowk, New Delhi",
    details: {
      street: "Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      postalCode: "110001",
      country: "India",
      formattedAddress: "Connaught Place, Rajiv Chowk, New Delhi, Delhi 110001, India",
      latitude: 28.6315,
      longitude: 77.2167,
    },
  },
  {
    id: "mock-mg-road",
    title: "MG Road",
    subtitle: "Bengaluru, Karnataka",
    details: {
      street: "Mahatma Gandhi Road",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560001",
      country: "India",
      formattedAddress: "MG Road, Bengaluru, Karnataka 560001, India",
      latitude: 12.9756,
      longitude: 77.6068,
    },
  },
];

export function mockAutocomplete(query: string): AddressSuggestionItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return MOCK_PLACES.filter(
    (p) =>
      p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q),
  ).map(({ id, title, subtitle }) => ({ id, title, subtitle }));
}

export function mockDetails(placeId: string): AddressDetails | null {
  return MOCK_PLACES.find((p) => p.id === placeId)?.details ?? null;
}
