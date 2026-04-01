import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import CampApplication from '@/models/CampApplication';
import { requireAuth } from '@/lib/auth-middleware';
import { dbError } from '@/lib/api-response';

const GRADE_LABELS: Record<string, string> = {
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
    const search = searchParams.get('search');

    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { participantName: { $regex: safe, $options: 'i' } },
        { guardianName: { $regex: safe, $options: 'i' } },
        { guardianEmail: { $regex: safe, $options: 'i' } },
      ];
    }

    const applications = await CampApplication.find(filter).sort({ createdAt: -1 }).lean();

    const headers = [
      'ID',
      'Stav',
      // Účastník
      'Jméno účastníka',
      'Třída',
      'Datum narození',
      'Rodné číslo',
      'Ulice',
      'Město',
      // Zákonný zástupce
      'Zákonný zástupce – jméno',
      'Zákonný zástupce – telefon',
      'Zákonný zástupce – email',
      'Zákonný zástupce – adresa',
      // Druhý kontakt
      'Druhý kontakt – jméno',
      'Druhý kontakt – telefon',
      'Druhý kontakt – email',
      'Druhý kontakt – adresa',
      // Tábor
      'Téma tábora',
      'Termín tábora',
      'Cena (Kč)',
      // Admin
      'Admin poznámka',
      'Zpracoval',
      'Zpracováno',
      'Přijato',
    ];

    const rows = applications.map(a => [
      a._id?.toString(),
      STATUS_LABELS[a.status] ?? a.status,
      a.participantName,
      GRADE_LABELS[String(a.grade)] ?? a.grade,
      a.dateOfBirth,
      a.birthNumber,
      a.address?.street ?? '',
      a.address?.city ?? '',
      a.guardianName,
      a.guardianPhone,
      a.guardianEmail,
      a.guardianAddress ?? '',
      a.secondContactName,
      a.secondContactPhone,
      a.secondContactEmail ?? '',
      a.secondContactAddress ?? '',
      a.campInfo?.theme ?? 'Star Wars: Vzestup Jediů',
      a.campInfo?.dates ?? '2. 7. — 11. 7. 2026',
      a.campInfo?.price ?? 4900,
      a.adminNotes ?? '',
      a.processedBy ?? '',
      formatDate(a.processedAt),
      formatDate(a.createdAt),
    ]);

    const csv =
      '\uFEFF' + // BOM pro správné zobrazení v Excelu
      [headers, ...rows].map(row => row.map(csvEscape).join(',')).join('\r\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="prihlasky-tabor-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    return dbError(error, 'GET /api/admin/camp-applications/export error:');
  }
}
