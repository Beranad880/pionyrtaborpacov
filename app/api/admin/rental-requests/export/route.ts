import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import RentalRequest from '@/models/RentalRequest';
import { requireAuth } from '@/lib/auth-middleware';
import { dbError } from '@/lib/api-response';

const FACILITY_LABELS: Record<string, string> = {
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

const STATUS_LABELS: Record<string, string> = {
  pending: 'Čeká',
  approved: 'Schváleno',
  rejected: 'Zamítnuto',
};

function csvEscape(value: unknown): string {
  if (value === undefined || value === null) return '';
  const str = String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function formatDate(d: Date | string | null | undefined): string {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') filter.status = status;

    const requests = await RentalRequest.find(filter).sort({ createdAt: -1 }).lean();

    const headers = [
      'ID',
      'Stav',
      'Jméno',
      'Email',
      'Telefon',
      'Organizace',
      'Příjezd',
      'Odjezd',
      'Počet osob',
      'Účel',
      'Vybavení',
      'Zpráva',
      'Admin poznámka',
      'Zpracoval',
      'Zpracováno',
      'Přijato',
    ];

    const rows = requests.map(r => [
      r._id?.toString(),
      STATUS_LABELS[r.status] ?? r.status,
      r.name,
      r.email,
      r.phone,
      r.organization ?? '',
      formatDate(r.startDate),
      formatDate(r.endDate),
      r.guestCount,
      r.purpose,
      (r.facilities ?? []).map((f: string) => FACILITY_LABELS[f] ?? f).join('; '),
      r.message ?? '',
      r.adminNotes ?? '',
      r.processedBy ?? '',
      formatDate(r.processedAt),
      formatDate(r.createdAt),
    ]);

    const csv =
      '\uFEFF' + // BOM pro správné zobrazení v Excelu
      [headers, ...rows].map(row => row.map(csvEscape).join(',')).join('\r\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="rezervace-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    return dbError(error, 'GET /api/admin/rental-requests/export error:');
  }
}
