import type { Provider } from '@/types/models';
import { PROVIDERS } from '@/data/providers';

/**
 * Couche d'accès aux données.
 * Aujourd'hui : adapter mock (données locales + latence simulée).
 * Demain : remplacer l'implémentation par des requêtes Supabase
 * sans toucher aux écrans (même signature).
 */

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface SearchFilters {
  categoryId?: string;
  subCategoryId?: string;
  query?: string;
  maxDistanceKm?: number;
  maxPriceMad?: number;
  minRating?: number;
  openNow?: boolean;
  atHome?: boolean;
  atProvider?: boolean;
}

export type SortKey = 'pertinence' | 'distance' | 'rating' | 'price';

export async function fetchProviders(filters: SearchFilters = {}, sort: SortKey = 'pertinence'): Promise<Provider[]> {
  await delay(350);
  let out = PROVIDERS.slice();

  if (filters.categoryId) out = out.filter((p) => p.categoryId === filters.categoryId);
  if (filters.subCategoryId) out = out.filter((p) => p.subCategoryId === filters.subCategoryId);
  if (filters.query) {
    const q = filters.query.toLowerCase();
    out = out.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.services.some((s) => s.name.toLowerCase().includes(q))
    );
  }
  if (filters.maxDistanceKm != null) out = out.filter((p) => p.distanceKm <= filters.maxDistanceKm!);
  if (filters.maxPriceMad != null) out = out.filter((p) => Math.min(...p.services.map((s) => s.priceMad)) <= filters.maxPriceMad!);
  if (filters.minRating != null) out = out.filter((p) => p.rating >= filters.minRating!);
  if (filters.openNow) out = out.filter((p) => p.openNow);
  if (filters.atHome) out = out.filter((p) => p.mobile);
  if (filters.atProvider) out = out.filter((p) => p.services.some((s) => !s.atHome));

  switch (sort) {
    case 'distance':
      out.sort((a, b) => a.distanceKm - b.distanceKm);
      break;
    case 'rating':
      out.sort((a, b) => b.rating - a.rating);
      break;
    case 'price':
      out.sort((a, b) => Math.min(...a.services.map((s) => s.priceMad)) - Math.min(...b.services.map((s) => s.priceMad)));
      break;
    default:
      out.sort((a, b) => Number(b.premium) - Number(a.premium) || b.rating - a.rating);
  }
  return out;
}

export async function fetchProvider(id: string): Promise<Provider | undefined> {
  await delay(200);
  return PROVIDERS.find((p) => p.id === id);
}

export function searchSuggestions(query: string): string[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const pool = new Set<string>();
  for (const p of PROVIDERS) {
    if (p.name.toLowerCase().includes(q)) pool.add(p.name);
    for (const s of p.services) if (s.name.toLowerCase().includes(q)) pool.add(s.name);
  }
  return [...pool].slice(0, 6);
}
