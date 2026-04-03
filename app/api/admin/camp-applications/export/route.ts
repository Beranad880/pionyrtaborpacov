import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import CampApplication from '@/models/CampApplication';
import { requireAuth } from '@/lib/auth-middleware';
import { dbError } from '@/lib/api-response';
import { csvEscape, formatDate, STATUS_LABELS, GRADE_LABELS } from '@/lib/csv';
import { escapeRegex, parseStatusFilter } from '@/lib/validation';

const MAX_EXPORT_ROWS = 5000;

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const filter: Record<string, unknown> = {};
    const validStatus = parseStatusFilter(status);
    if (validStatus) filter.status = validStatus;
    if (search) {
      const safe = escapeRegex(search);
      filter.$or = [
        { participantName: { $regex: safe, $options: 'i' } },
        { guardianName: { $regex: safe, $options: 'i' } },
        { guardianEmail: { $regex: safe, $options: 'i' } },
      ];
    }

    const total = await CampApplication.countDocuments(filter);
    if (total > MAX_EXPORT_ROWS) {
      return NextResponse.json(
        { success: false, message: `Export obsahuje příliš mnoho záznamů (${total}). Použijte filtr pro zúžení výběru (max ${MAX_EXPORT_ROWS}).` },
        { status: 400 }
      );
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
