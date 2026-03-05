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
