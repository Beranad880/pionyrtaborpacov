import { NextRequest, NextResponse } from 'next/server';
import connectToMongoose from '@/lib/mongoose';
import CampApplication from '@/models/CampApplication';
import { requireAuth } from '@/lib/auth-middleware';
import { parsePagination, paginationMeta } from '@/lib/pagination';
import { escapeRegex } from '@/lib/validation';
import { checkRateLimit, FORM_MAX } from '@/lib/rate-limit';
import { dbError } from '@/lib/api-response';
import { sendCampApplicationNotification } from '@/lib/mailer';
// GET - Načíst táborové přihlášky (pouze pro adminy)
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    await connectToMongoose();

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const filter: any = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { participantName: { $regex: safeSearch, $options: 'i' } },
        { guardianName: { $regex: safeSearch, $options: 'i' } },
        { guardianEmail: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    const applications = await CampApplication.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await CampApplication.countDocuments(filter);

    // Statistiky podle statusu
    const statusStats = await CampApplication.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const stats = { pending: 0, approved: 0, rejected: 0, total };

    statusStats.forEach(stat => {
      if (stat._id in stats) {
        stats[stat._id as keyof typeof stats] = stat.count;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        applications,
        pagination: paginationMeta(page, limit, total),
        stats
      }
    });
  } catch (error) {
    return dbError(error, 'GET /api/admin/camp-applications error:');
  }
}

// POST - Vytvořit novou táborovou přihlášku (veřejné API)
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  const rateCheck = checkRateLimit(`camp-application:${ip}`, FORM_MAX);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, message: `Příliš mnoho požadavků. Zkuste to znovu za ${rateCheck.retryAfter} sekund.` },
      { status: 429 }
    );
  }

  try {
    await connectToMongoose();

    const body = await request.json();

    const requiredFields = [
      'participantName', 'grade', 'dateOfBirth', 'birthNumber',
      'guardianName', 'guardianPhone', 'guardianEmail',
      'secondContactName', 'secondContactPhone'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} je povinný` },
          { status: 400 }
        );
      }
    }

    if (!body.address || !body.address.street || !body.address.city) {
      return NextResponse.json(
        { success: false, message: 'Adresa účastníka je povinná' },
        { status: 400 }
      );
    }

    const existingApplication = await CampApplication.findOne({
      $or: [
        { birthNumber: body.birthNumber },
        { guardianEmail: body.guardianEmail }
      ]
    });

    if (existingApplication) {
      return NextResponse.json(
        { success: false, message: 'Přihláška s tímto rodným číslem nebo emailem již existuje' },
        { status: 409 }
      );
    }

    const campApplication = new CampApplication({
      participantName: body.participantName,
      grade: body.grade,
      dateOfBirth: body.dateOfBirth,
      birthNumber: body.birthNumber,
      address: {
        street: body.address.street,
        city: body.address.city
      },
      guardianName: body.guardianName,
      guardianPhone: body.guardianPhone,
      guardianEmail: body.guardianEmail,
      guardianAddress: body.guardianAddress,
      secondContactName: body.secondContactName,
      secondContactPhone: body.secondContactPhone,
      secondContactEmail: body.secondContactEmail,
      secondContactAddress: body.secondContactAddress,
      campInfo: body.campInfo,
      status: 'pending'
    });

    await campApplication.save();

    sendCampApplicationNotification({
      participantName: body.participantName,
      grade: body.grade,
      dateOfBirth: body.dateOfBirth,
      birthNumber: body.birthNumber,
      address: { street: body.address.street, city: body.address.city },
      guardianName: body.guardianName,
      guardianPhone: body.guardianPhone,
      guardianEmail: body.guardianEmail,
      guardianAddress: body.guardianAddress,
      secondContactName: body.secondContactName,
      secondContactPhone: body.secondContactPhone,
      secondContactEmail: body.secondContactEmail,
      secondContactAddress: body.secondContactAddress,
      campInfo: body.campInfo,
    }).catch((err) => console.error('sendCampApplicationNotification selhalo:', err));

    return NextResponse.json({
      success: true,
      message: 'Přihláška byla úspěšně odeslána',
      data: campApplication
    }, { status: 201 });

  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { success: false, message: 'Validace selhala', errors },
        { status: 400 }
      );
    }
    return dbError(error, 'POST /api/admin/camp-applications error:');
  }
}
