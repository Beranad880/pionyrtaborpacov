/** Centralizované UI labels a konstanty — sdílené napříč admin stránkami a komponentami */

// ─── Statusy přihlášek / žádostí ─────────────────────────────────────────────

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Čekající',
  approved: 'Schváleno',
  rejected: 'Odmítnuto',
};

export const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

// ─── Vybavení hájenky ─────────────────────────────────────────────────────────

export const FACILITY_LABELS: Record<string, string> = {
  kitchen: 'Kuchyně',
  wifi: 'Wi-Fi',
  fireplace: 'Krb',
  parking: 'Parkování',
  heating: 'Topení',
  electricity: 'Elektřina',
  water: 'Voda',
  outdoor_grill: 'Venkovní gril',
  sports_equipment: 'Sportovní vybavení',
};

/** Seřazené pole pro formuláře a checkboxy */
export const FACILITY_OPTIONS = Object.entries(FACILITY_LABELS).map(
  ([id, label]) => ({ id, label })
);

// ─── Třídy účastníků tábora ───────────────────────────────────────────────────

export const GRADE_LABELS: Record<string, string> = {
  '0': '1. třída',
  '1': '2. třída',
  '2': '3. třída',
  '3': '4. třída',
  '4': '5. třída',
  '5': '6. třída',
  '6': '7. třída',
  '7': '8. třída',
  '8': '9. třída',
};

// ─── České lokalizace kalendáře ──────────────────────────────────────────────

export const DAYS_CS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

export const MONTHS_CS = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
];
