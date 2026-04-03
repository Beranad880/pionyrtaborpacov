import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import RentalRequest from '@/models/RentalRequest';
import { requireAuth } from '@/lib/auth-middleware';
import { dbError } from '@/lib/api-response';
import { csvEscape, formatDate, STATUS_LABELS, FACILITY_LABELS } from '@/lib/csv';
import { parseStatusFilter } from '@/lib/validation';

const MAX_EXPORT_ROWS = 5000;

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const filter: Record<string, unknown> = {};
    const validStatus = parseStatusFilter(status);
    if (validStatus) filter.status = validStatus;

    const total = await RentalRequest.countDocuments(filter);
    if (total > MAX_EXPORT_ROWS) {
      return NextResponse.json(
        { success: false, message: `Export obsahuje příliš mnoho záznamů (${total}). Použijte filtr pro zúžení výběru (max ${MAX_EXPORT_ROWS}).` },
        { status: 400 }
      );
    }

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
