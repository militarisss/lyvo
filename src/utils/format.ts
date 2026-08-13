export function mad(n: number): string {
  const s = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${s} MAD`;
}

const DAYS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const DAYS_FULL = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

export function shortDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function fullDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return `${DAYS_FULL[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function dayLetter(iso: string): { day: string; num: number } {
  const d = new Date(iso + 'T00:00:00');
  return { day: DAYS[d.getDay()], num: d.getDate() };
}

export function nextDays(count: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}
