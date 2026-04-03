import { Resend } from 'resend';
import { FACILITY_LABELS, GRADE_LABELS } from './csv';

if (!process.env.RESEND_API_KEY) {
  console.warn('[mailer] RESEND_API_KEY není nastaven — emaily nebudou odesílány.');
}

const resend = new Resend(process.env.RESEND_API_KEY);

function esc(str: string | undefined | null): string {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const ADMIN_EMAILS = [
  process.env.NOTIFICATION_EMAIL,
  process.env.NOTIFICATION_EMAIL_2,
].filter(Boolean) as string[];

if (ADMIN_EMAILS.length === 0) {
  console.warn('[mailer] NOTIFICATION_EMAIL není nastaven — adminové nebudou dostávat notifikace.');
}

const FROM = process.env.RESEND_FROM || 'Pionýr Pacov <onboarding@resend.dev>';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://pionyrtaborpacov.cz';

// ─── Pronájem hájenky ────────────────────────────────────────────────────────

export async function sendRentalNotification(data: {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  startDate: Date;
  endDate: Date;
  guestCount: number;
  purpose: string;
  facilities?: string[];
  message?: string;
}) {
  if (ADMIN_EMAILS.length === 0) return;

  const formatDate = (d: Date) =>
    d.toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const facilitiesHtml =
    data.facilities && data.facilities.length > 0
      ? data.facilities.map(f => esc(FACILITY_LABELS[f] ?? f)).join(', ')
      : '—';

  const html = `
    <h2>Nová žádost o pronájem hájenky</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><strong>Jméno:</strong></td><td>${esc(data.name)}</td></tr>
      <tr><td><strong>Email:</strong></td><td>${esc(data.email)}</td></tr>
      <tr><td><strong>Telefon:</strong></td><td>${esc(data.phone)}</td></tr>
      ${data.organization ? `<tr><td><strong>Organizace:</strong></td><td>${esc(data.organization)}</td></tr>` : ''}
      <tr><td><strong>Příjezd:</strong></td><td>${formatDate(data.startDate)}</td></tr>
      <tr><td><strong>Odjezd:</strong></td><td>${formatDate(data.endDate)}</td></tr>
      <tr><td><strong>Počet osob:</strong></td><td>${data.guestCount}</td></tr>
      <tr><td><strong>Účel pobytu:</strong></td><td>${esc(data.purpose)}</td></tr>
      <tr><td><strong>Požadované vybavení:</strong></td><td>${facilitiesHtml}</td></tr>
      ${data.message ? `<tr><td><strong>Zpráva:</strong></td><td>${esc(data.message)}</td></tr>` : ''}
    </table>
    <p><a href="${BASE_URL}/admin/rental-requests">Zobrazit v administraci</a></p>
  `;

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAILS,
    subject: `Nová rezervace hájenky – ${data.name} (${formatDate(data.startDate)} – ${formatDate(data.endDate)})`,
    html,
  });
}

// ─── Táborová přihláška ──────────────────────────────────────────────────────

export async function sendCampApplicationNotification(data: {
  participantName: string;
  grade: string;
  dateOfBirth: string;
  birthNumber: string;
  address: { street: string; city: string };
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianAddress?: string;
  secondContactName: string;
  secondContactPhone: string;
  secondContactEmail?: string;
  secondContactAddress?: string;
  campInfo?: { theme?: string; dates?: string; price?: number };
}) {
  if (ADMIN_EMAILS.length === 0) return;

  const gradeLabel = GRADE_LABELS[String(data.grade)] ?? data.grade;
  const campTheme = esc(data.campInfo?.theme ?? 'Star Wars: Vzestup Jediů');
  const campDates = esc(data.campInfo?.dates ?? '2. 7. — 11. 7. 2026');
  const campPrice = data.campInfo?.price ?? 4900;

  const html = `
    <h2>Nová přihláška na tábor</h2>
    <table cellpadding="6" style="border-collapse:collapse;min-width:400px">
      <tr><td colspan="2" style="background:#f0f0f0;padding:6px 8px"><strong>Účastník</strong></td></tr>
      <tr><td><strong>Jméno:</strong></td><td>${esc(data.participantName)}</td></tr>
      <tr><td><strong>Třída:</strong></td><td>${esc(gradeLabel)}</td></tr>
      <tr><td><strong>Datum narození:</strong></td><td>${esc(data.dateOfBirth)}</td></tr>
      <tr><td><strong>Rodné číslo:</strong></td><td>${esc(data.birthNumber)}</td></tr>
      <tr><td><strong>Adresa:</strong></td><td>${esc(data.address.street)}, ${esc(data.address.city)}</td></tr>

      <tr><td colspan="2" style="background:#f0f0f0;padding:6px 8px"><strong>Zákonný zástupce</strong></td></tr>
      <tr><td><strong>Jméno:</strong></td><td>${esc(data.guardianName)}</td></tr>
      <tr><td><strong>Telefon:</strong></td><td>${esc(data.guardianPhone)}</td></tr>
      <tr><td><strong>Email:</strong></td><td>${esc(data.guardianEmail)}</td></tr>
      ${data.guardianAddress ? `<tr><td><strong>Adresa:</strong></td><td>${esc(data.guardianAddress)}</td></tr>` : ''}

      <tr><td colspan="2" style="background:#f0f0f0;padding:6px 8px"><strong>Druhý kontakt</strong></td></tr>
      <tr><td><strong>Jméno:</strong></td><td>${esc(data.secondContactName)}</td></tr>
      <tr><td><strong>Telefon:</strong></td><td>${esc(data.secondContactPhone)}</td></tr>
      ${data.secondContactEmail ? `<tr><td><strong>Email:</strong></td><td>${esc(data.secondContactEmail)}</td></tr>` : ''}
      ${data.secondContactAddress ? `<tr><td><strong>Adresa:</strong></td><td>${esc(data.secondContactAddress)}</td></tr>` : ''}

      <tr><td colspan="2" style="background:#f0f0f0;padding:6px 8px"><strong>Tábor</strong></td></tr>
      <tr><td><strong>Téma:</strong></td><td>${campTheme}</td></tr>
      <tr><td><strong>Termín:</strong></td><td>${campDates}</td></tr>
      <tr><td><strong>Cena:</strong></td><td>${campPrice} Kč</td></tr>
    </table>
    <p><a href="${BASE_URL}/admin/camp-applications">Zobrazit v administraci</a></p>
  `;

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAILS,
    subject: `Nová přihláška na tábor – ${data.participantName}`,
    html,
  });
}
