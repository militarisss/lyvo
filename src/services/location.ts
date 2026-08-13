/**
 * Abstraction localisation / cartes.
 * V1 : position simulée (Casablanca centre) + carte stylisée maison.
 * V2 : brancher expo-location + react-native-maps (Google Maps) ou Mapbox
 * en remplaçant uniquement ce module.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export const CASABLANCA_CENTER: LatLng = { lat: 33.5883, lng: -7.6114 };

export async function getCurrentPosition(): Promise<LatLng> {
  await new Promise((r) => setTimeout(r, 300));
  return CASABLANCA_CENTER;
}

export function distanceKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)) * 10) / 10;
}
