export const STATUS_LABELS: Record<string, string> = {
  pending: 'Čeká',
  approved: 'Schváleno',
  rejected: 'Zamítnuto',
};

export const FACILITY_LABELS: Record<string, string> = {
  kitchen: 'Kuchyně',
  wifi: 'Wi-Fi',
  fireplace: 'Krb / ohniště',
  parking: 'Parkoviště',
  heating: 'Topení',
  electricity: 'Elektřina',
  water: 'Voda',
  outdoor_grill: 'Venkovní gril',
  sports_equipment: 'Sportovní vybavení',
};

export const GRADE_LABELS: Record<string, string> = {
  '0': 'Předškolák',
  '1': '1. třída',
  '2': '2. třída',
  '3': '3. třída',
  '4': '4. třída',
  '5': '5. třída',
  '6': '6. třída',
  '7': '7. třída',
  '8': '8. třída',
};

export function csvEscape(value: unknown): string {
  if (value === undefined || value === null) return '';
  const str = String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
