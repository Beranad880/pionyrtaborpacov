function esc(str: string | undefined): string {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function sendRentalNotification(data: {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  startDate: Date;
  endDate: Date;
  guestCount: number;
  purpose: string;
  message?: string;
}) {
  const apiKey = process.env.MAILEROO_API_KEY;
  const toEmail = process.env.NOTIFICATION_EMAIL;
  const fromEmail = process.env.MAILEROO_FROM || 'noreply@pionyrtaborpacov.cz';

  if (!apiKey || !toEmail) {
    console.warn('Maileroo není nakonfigurován (MAILEROO_API_KEY nebo NOTIFICATION_EMAIL chybí)');
    return;
  }

  const formatDate = (d: Date) =>
    d.toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const html = `
    <h2>Nová žádost o pronájem hájenky</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><strong>Jméno:</strong></td><td>${esc(data.name)}</td></tr>
      <tr><td><strong>Email:</strong></td><td>${esc(data.email)}</td></tr>
      <tr><td><strong>Telefon:</strong></td><td>${esc(data.phone)}</td></tr>
      ${data.organization ? `<tr><td><strong>Organizace:</strong></td><td>${esc(data.organization)}</td></tr>` : ''}
      <tr><td><strong>Od:</strong></td><td>${formatDate(data.startDate)}</td></tr>
      <tr><td><strong>Do:</strong></td><td>${formatDate(data.endDate)}</td></tr>
      <tr><td><strong>Počet osob:</strong></td><td>${data.guestCount}</td></tr>
      <tr><td><strong>Účel:</strong></td><td>${esc(data.purpose)}</td></tr>
      ${data.message ? `<tr><td><strong>Zpráva:</strong></td><td>${esc(data.message)}</td></tr>` : ''}
    </table>
    <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://pionyrtaborpacov.cz'}/admin/rental-requests">
      Zobrazit v administraci
    </a></p>
  `;

  const res = await fetch('https://smtp.maileroo.com/send', {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: toEmail,
      subject: `Nová rezervace hájenky – ${data.name} (${formatDate(data.startDate)} – ${formatDate(data.endDate)})`,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Maileroo chyba:', res.status, text);
  }
}

export async function sendCampApplicationNotification(data: {
  participantName: string;
  grade: string;
  dateOfBirth: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  secondContactName: string;
  secondContactPhone: string;
  address: { street: string; city: string };
  campInfo?: string;
}) {
  const apiKey = process.env.MAILEROO_API_KEY;
  const toEmail = process.env.NOTIFICATION_EMAIL;
  const fromEmail = process.env.MAILEROO_FROM || 'noreply@pionyrtaborpacov.cz';

  if (!apiKey || !toEmail) {
    console.warn('Maileroo není nakonfigurován (MAILEROO_API_KEY nebo NOTIFICATION_EMAIL chybí)');
    return;
  }

  const html = `
    <h2>Nová přihláška na tábor</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><strong>Účastník:</strong></td><td>${esc(data.participantName)}</td></tr>
      <tr><td><strong>Ročník:</strong></td><td>${esc(data.grade)}</td></tr>
      <tr><td><strong>Datum narození:</strong></td><td>${esc(data.dateOfBirth)}</td></tr>
      <tr><td><strong>Adresa:</strong></td><td>${esc(data.address.street)}, ${esc(data.address.city)}</td></tr>
      <tr><td colspan="2"><hr></td></tr>
      <tr><td><strong>Zákonný zástupce:</strong></td><td>${esc(data.guardianName)}</td></tr>
      <tr><td><strong>Telefon:</strong></td><td>${esc(data.guardianPhone)}</td></tr>
      <tr><td><strong>Email:</strong></td><td>${esc(data.guardianEmail)}</td></tr>
      <tr><td colspan="2"><hr></td></tr>
      <tr><td><strong>2. kontakt:</strong></td><td>${esc(data.secondContactName)}</td></tr>
      <tr><td><strong>Telefon:</strong></td><td>${esc(data.secondContactPhone)}</td></tr>
      ${data.campInfo ? `<tr><td><strong>Info k táboru:</strong></td><td>${esc(data.campInfo)}</td></tr>` : ''}
    </table>
    <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://pionyrtaborpacov.cz'}/admin/camp-applications">
      Zobrazit v administraci
    </a></p>
  `;

  const res = await fetch('https://smtp.maileroo.com/send', {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: toEmail,
      subject: `Nová přihláška na tábor – ${data.participantName}`,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Maileroo chyba:', res.status, text);
  }
}
