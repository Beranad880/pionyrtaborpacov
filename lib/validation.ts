/** Escapuje speciální znaky pro bezpečné použití v MongoDB $regex */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Vrátí chybovou zprávu pokud je rozsah dat neplatný, jinak null */
export function validateDateRange(start: Date, end: Date): string | null {
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'Neplatný formát data';
  if (end < start) return 'Datum konce musí být po datu začátku';
  return null;
}

/** Validuje emailovou adresu */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/** Validuje české nebo slovenské telefonní číslo (různé formáty) */
export function isValidPhone(phone: string): boolean {
  // Akceptuje: +420 123 456 789, 123456789, 00420123456789 apod.
  return /^(\+?\d[\d\s\-()]{6,19}\d)$/.test(phone.trim());
}

/** Povolené hodnoty pro filtr status přihlášek / žádostí */
export const ALLOWED_STATUSES = ['pending', 'approved', 'rejected'] as const;
export type AllowedStatus = typeof ALLOWED_STATUSES[number];

/** Vrátí validní status nebo null (všechny = filtr vypnut) */
export function parseStatusFilter(value: string | null): AllowedStatus | null {
  if (!value || value === 'all') return null;
  if ((ALLOWED_STATUSES as readonly string[]).includes(value)) return value as AllowedStatus;
  return null;
}
