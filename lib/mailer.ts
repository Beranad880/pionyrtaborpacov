import * as nodemailer from 'nodemailer';

function esc(str: string | undefined): string {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const NOTIFICATION_EMAILS = (process.env.NOTIFICATION_EMAIL || 'adamhumblee150@gmail.com')
  .split(',')
  .map(e => e.trim());

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

  await transport.sendMail({
    from: `"Pionýr Pacov" <${process.env.GMAIL_USER}>`,
    to: NOTIFICATION_EMAILS,
    subject: `Nová rezervace hájenky – ${data.name} (${formatDate(data.startDate)} – ${formatDate(data.endDate)})`,
    html,
  });
}

